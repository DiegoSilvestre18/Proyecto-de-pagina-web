using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.DTOs.Salas;
using SistemaApuestas.Application.Interfaces;
using SistemaApuestas.Application.Interfaces.Salas;
using SistemaApuestas.Application.Repositories.GameAccount;
using SistemaApuestas.Application.Repositories.Identity;
using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Betting;
using SistemaApuestas.Domain.Entities.Identity;
using Microsoft.AspNetCore.SignalR;
using SistemaApuestas.Application.Hubs;
using System.Globalization;
using System.Text.RegularExpressions;

namespace SistemaApuestas.Application.Services
{
    public class SalaService : ISalaService
    {
        private readonly ISalaRepository _repository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IGameAccountRepository _gameAccountRepository;
        private readonly IHubContext<SalaHub> _hubContext;

        public SalaService(ISalaRepository repository, IUsuarioRepository repositoryUser, IGameAccountRepository gameAccountRepository, IHubContext<SalaHub> hubContext)
        {
            _repository = repository;
            _usuarioRepository = repositoryUser;
            _gameAccountRepository = gameAccountRepository;
            _hubContext = hubContext;
        }

        public async Task<int> CrearSalaAsync(int creadorId, CrearSalaDto request)
        {
            // 1. Buscamos quién está creando la sala para saber su ROL
            var creador = await _repository.ObtenerUsuarioPorIdAsync(creadorId);
            bool esAdmin = creador != null && (creador.Rol == "SUPERADMIN" || creador.Rol == "ADMIN");
            bool esSuperAdmin = creador != null && creador.Rol == "SUPERADMIN";

            if (esSuperAdmin)
            {
                if (string.IsNullOrWhiteSpace(request.NombreLobby) || string.IsNullOrWhiteSpace(request.PasswordLobby))
                {
                    throw new Exception("Para salas creadas por SUPERADMIN, el nombre y la contraseña del lobby son obligatorios.");
                }
            }

            var nuevaSala = new Sala
            {
                CreadorId = creadorId,
                Juego = request.Juego,
                CostoEntrada = request.CostoEntrada,
                PremioARepartir = request.PremioARepartir,
                GananciaPlataforma = request.GananciaPlataforma,
                Formato = request.Formato,
                TipoSala = request.TipoSala ?? "BASICA", // Asegurar que no sea nulo
                FechaCreacion = DateTime.UtcNow,
                MmrMinimo = request.MmrMinimo,
                MmrMaximo = request.MmrMaximo,
                NombreLobby = esSuperAdmin ? request.NombreLobby?.Trim() : null,
                PasswordLobby = esSuperAdmin ? request.PasswordLobby?.Trim() : null,

                // 👇 LA MAGIA: Si es admin, sale pública al instante. Si es usuario, va a revisión.
                Estado = esAdmin ? "ESPERANDO" : "PENDIENTE_APROBACION"
            };

            await _repository.AgregarSalaAsync(nuevaSala);
            await _repository.GuardarCambiosAsync();

            return nuevaSala.SalaId;
        }

        public async Task<UnirseSalaResponseDto> UnirseASalaAsync(int jugadorId, InscripcionSalaDto request)
        {
            var estaBaneado = await _usuarioRepository.EstaBaneadoAsync(jugadorId);
            if (estaBaneado)
            {
                throw new Exception("ACCESO DENEGADO: No puedes unirte a salas porque tu cuenta está baneada.");
            }

            var jugador = await _repository.ObtenerUsuarioPorIdAsync(jugadorId);
            if (jugador == null) throw new Exception("Jugador no encontrado.");

            var sala = await _repository.ObtenerSalaPorIdAsync(request.SalaId);
            if (sala == null) throw new Exception("La sala no existe.");

            var gameAccount = await _repository.ObtenerGameAccountAsync(request.GameAccountId, jugadorId);
            if (gameAccount == null) throw new Exception("La cuenta de juego no existe o no te pertenece.");

            // 1. Buscamos el MMR del jugador
            var cuentaJuego = await _gameAccountRepository.ObtenerPorUsuarioYJuegoAsync(jugadorId, sala.Juego);

            // Si no tiene rango numérico válido, lo tratamos como 0 (Unranked)
            int mmrJugador = 0;
            if (int.TryParse(gameAccount.RangoActual, out int mmrParseado))
            {
                mmrJugador = mmrParseado;
            }

            if (mmrJugador < sala.MmrMinimo || mmrJugador > sala.MmrMaximo)
            {
                throw new Exception($"Nivel no permitido. Tu MMR ({mmrJugador}) está fuera del rango ({sala.MmrMinimo} a {sala.MmrMaximo}).");
            }

            // Permitimos unirse si está ESPERANDO (o en otro estado previo al draft si tienes uno)
            if (sala.Estado != "ESPERANDO") throw new Exception("La sala ya no acepta participantes.");

            if (await _repository.ExisteInscripcionAsync(request.SalaId, jugadorId))
                throw new Exception("Ya estás inscrito en esta sala.");

            var salaActivaExistente = await _repository.ObtenerSalaActivaPorCuentaJuegoAsync(gameAccount.GameAccountId, request.SalaId);
            if (salaActivaExistente != null)
            {
                throw new Exception($"No puedes inscribirte en otra sala mientras tu cuenta de juego siga activa en la sala {salaActivaExistente.SalaId}.");
            }

            // Verificamos si la sala ya está llena ANTES de procesar el pago
            // (Asegúrate de tener un método para contar participantes, ej: _repository.ContarParticipantesSalaAsync)
            // O si ya tienes la colección Participantes cargada en 'sala', puedes usar sala.Participantes.Count
            int numParticipantesActuales = sala.Participantes?.Count ?? 0;

            // Límites por formato soportado actualmente:
            // - 5v5 All Pick => 10
            // - Auto Chess   => 8
            // - fallback     => 2
            string formato = sala.Formato ?? string.Empty;
            bool es5v5 = formato.Contains("5v5", StringComparison.OrdinalIgnoreCase);
            bool esAutoChess = formato.Contains("Auto Chess", StringComparison.OrdinalIgnoreCase);
            // Aunque el nombre visible sea "All Pick", para 5v5 mantenemos el flujo de capitanes
            // (SORTEO -> DRAFTING -> EN_CURSO).
            bool usaFlujoCapitanes = es5v5 || formato.Contains("Captains", StringComparison.OrdinalIgnoreCase);

            int limiteJugadores = es5v5 ? 10 : (esAutoChess ? 8 : 2);

            if (numParticipantesActuales >= limiteJugadores)
            {
                throw new Exception("La sala ya está llena.");
            }

            // =========================================================
            // 👇 NUEVA LÓGICA DE COBRO EN CASCADA (BONO -> RECARGA -> REAL) 👇
            // =========================================================
            decimal costoEntrada = sala.CostoEntrada;

            // 1. Verificamos si la suma de sus 3 bolsillos alcanza
            if ((jugador.SaldoBono + jugador.SaldoRecarga + jugador.SaldoReal) < costoEntrada)
                throw new Exception("Saldo insuficiente para unirte a esta sala.");

            decimal porCobrar = costoEntrada;
            decimal montoBonoUsado = 0;
            decimal montoRecargaUsado = 0;
            decimal montoRealUsado = 0;

            // PASO 1: Exprimir el Saldo Bono (El dinero regalado)
            if (jugador.SaldoBono >= porCobrar)
            {
                jugador.SaldoBono -= porCobrar;
                montoBonoUsado = porCobrar;
                porCobrar = 0;
            }
            else
            {
                montoBonoUsado = jugador.SaldoBono;
                porCobrar -= jugador.SaldoBono;
                jugador.SaldoBono = 0;
            }

            // PASO 2: Exprimir el Saldo Recarga (El dinero depositado)
            if (porCobrar > 0)
            {
                if (jugador.SaldoRecarga >= porCobrar)
                {
                    jugador.SaldoRecarga -= porCobrar;
                    montoRecargaUsado = porCobrar;
                    porCobrar = 0;
                }
                else
                {
                    montoRecargaUsado = jugador.SaldoRecarga;
                    porCobrar -= jugador.SaldoRecarga;
                    jugador.SaldoRecarga = 0;
                }
            }

            // PASO 3: Exprimir el Saldo Real (Las ganancias retirables)
            if (porCobrar > 0)
            {
                jugador.SaldoReal -= porCobrar;
                montoRealUsado = porCobrar;
            }

            var nuevoParticipante = new ParticipanteSala
            {
                SalaId = sala.SalaId,
                UsuarioId = jugador.UsuarioId,
                GameAccountId = gameAccount.GameAccountId,
                // En flujo de capitanes entran al pool de draft; en el resto conservan el equipo elegido.
                Equipo = usaFlujoCapitanes ? "ESPERANDO_DRAFT" : request.Equipo
            };

            // Añadimos el participante (ya sea por repositorio o añadiéndolo a la colección de la sala)
            // Si tu repositorio no carga la colección 'Participantes' de la 'sala', es importante que lo haga 
            // para que la lógica de abajo funcione correctamente.
            sala.Participantes.Add(nuevoParticipante); // Si tienes la colección instanciada
            await _repository.AgregarParticipanteAsync(nuevoParticipante);

            // Actualizamos el concepto del Movimiento para que el contador vea de dónde salió el dinero
            var movimiento = new Movimiento
            {
                UsuarioId = jugador.UsuarioId,
                SalaId = sala.SalaId,
                Tipo = "EGRESO",
                MontoReal = montoRealUsado, // Lo que dolió de verdad (Ganancias)
                MontoBono = montoBonoUsado, // Lo que puso el admin (Regalo)
                                            // OJO: Si luego quieres agregar MontoRecarga a tu tabla Movimientos, puedes hacerlo. 
                                            // Por ahora lo ponemos en el concepto para que haya registro.
                Concepto = $"Inscripción Sala {sala.SalaId}. Pagado con: S/{montoRecargaUsado} Recarga, S/{montoRealUsado} Ganancias, S/{montoBonoUsado} Bono.",
                Fecha = DateTime.UtcNow
            };
            await _repository.AgregarMovimientoAsync(movimiento);


            // =========================================================
            // 👇 NUEVO: LÓGICA DE DETECCIÓN DE SALA LLENA (CAPTAINS DRAFT) 👇
            // =========================================================

            // Volvemos a contar, sumando al jugador actual
            numParticipantesActuales++;

            if (numParticipantesActuales == limiteJugadores)
            {
                if (usaFlujoCapitanes)
                {
                    // Flujo de capitanes: ESPERANDO -> SORTEO -> DRAFTING -> EN_CURSO
                    var participantesConCuentas = await _repository.ObtenerParticipantesConCuentasAsync(sala.SalaId);

                    var participantesOrdenados = participantesConCuentas
                        .OrderByDescending(p => int.TryParse(p.GameAccount?.RangoActual, out int mmr) ? mmr : 0)
                        .ToList();

                    if (participantesOrdenados.Count >= 2)
                    {
                        sala.Capitan1Id = participantesOrdenados[0].UsuarioId;
                        sala.Capitan2Id = participantesOrdenados[1].UsuarioId;
                        sala.Estado = "SORTEO";
                    }
                }
                else
                {
                    // Flujo para formatos activos (5v5 All Pick y Auto Chess):
                    // al completarse el aforo, la sala pasa a EN_CURSO.
                    sala.Estado = "EN_CURSO";
                }
            }

            // =========================================================

            await _repository.GuardarCambiosAsync();

            return new UnirseSalaResponseDto
            {
                Mensaje = $"Inscripción exitosa. Se cobraron S/ {montoRealUsado} (Real) y S/ {montoBonoUsado} (Bono).",
                SaldoRealRestante = jugador.SaldoReal,
                SaldoBonoRestante = jugador.SaldoBono,
                SaldoRecargaRestante = jugador.SaldoRecarga
            };
        }

        public async Task<UnirseSalaResponseDto> RetirarseDeSalaAsync(int usuarioId, int salaId)
        {
            var sala = await _repository.ObtenerSalaPorIdAsync(salaId);
            if (sala == null) throw new Exception("La sala no existe.");

            if (sala.Estado != "ESPERANDO")
                throw new Exception("Solo puedes retirarte cuando la sala aún está en estado ESPERANDO.");

            string formato = sala.Formato ?? string.Empty;
            bool es5v5 = formato.Contains("5v5", StringComparison.OrdinalIgnoreCase);
            bool esAutoChess = formato.Contains("Auto Chess", StringComparison.OrdinalIgnoreCase);
            int limiteJugadores = es5v5 ? 10 : (esAutoChess ? 8 : 2);
            int participantesActuales = sala.Participantes?.Count ?? 0;

            if (participantesActuales >= limiteJugadores)
                throw new Exception("La sala ya se llenó. No es posible retirarse con reembolso.");

            var participante = await _repository.ObtenerParticipanteAsync(salaId, usuarioId);
            if (participante == null)
                throw new Exception("No estás inscrito en esta sala.");

            var movimientoInscripcion = await _repository.ObtenerMovimientoInscripcionAsync(usuarioId, salaId);
            if (movimientoInscripcion == null)
                throw new Exception("No se encontró el registro de inscripción para calcular reembolso.");

            var minutosTranscurridos = (DateTime.UtcNow - movimientoInscripcion.Fecha).TotalMinutes;
            if (minutosTranscurridos < 8)
            {
                var restante = Math.Max(0, 8 - (int)Math.Floor(minutosTranscurridos));
                throw new Exception($"Debes esperar {restante} minuto(s) más para retirarte con reembolso.");
            }

            var usuario = await _repository.ObtenerUsuarioPorIdAsync(usuarioId);
            if (usuario == null) throw new Exception("Usuario no encontrado.");

            decimal montoReal = movimientoInscripcion.MontoReal;
            decimal montoBono = movimientoInscripcion.MontoBono;
            decimal montoRecarga = ExtraerMontoRecarga(movimientoInscripcion.Concepto);

            usuario.SaldoRecarga += montoRecarga;
            usuario.SaldoReal += montoReal;
            usuario.SaldoBono += montoBono;

            await _repository.EliminarParticipanteAsync(participante);

            var movimientoReembolso = new Movimiento
            {
                UsuarioId = usuarioId,
                SalaId = salaId,
                Tipo = "INGRESO",
                MontoReal = montoReal,
                MontoBono = montoBono,
                Concepto = $"Reembolso por retiro voluntario de Sala {salaId}. Devuelto: S/{montoRecarga} Recarga, S/{montoReal} Ganancias, S/{montoBono} Bono.",
                Fecha = DateTime.UtcNow
            };

            await _repository.AgregarMovimientoAsync(movimientoReembolso);
            await _repository.GuardarCambiosAsync();

            return new UnirseSalaResponseDto
            {
                Mensaje = "Te retiraste de la sala y se reembolsó tu inscripción.",
                SaldoRealRestante = usuario.SaldoReal,
                SaldoBonoRestante = usuario.SaldoBono,
                SaldoRecargaRestante = usuario.SaldoRecarga
            };
        }

        public async Task<UnirseSalaResponseDto> ExpulsarUsuarioPorAdminAsync(int salaId, int usuarioId)
        {
            var sala = await _repository.ObtenerSalaPorIdAsync(salaId);
            if (sala == null) throw new Exception("La sala no existe.");

            if (sala.Estado == "FINALIZADA" || sala.Estado == "CANCELADA" || sala.Estado == "RECHAZADA")
                throw new Exception("No se puede expulsar jugadores en una sala cerrada.");

            var participante = await _repository.ObtenerParticipanteAsync(salaId, usuarioId);
            if (participante == null)
                throw new Exception("El usuario no está inscrito en esta sala.");

            var movimientoInscripcion = await _repository.ObtenerMovimientoInscripcionAsync(usuarioId, salaId);
            if (movimientoInscripcion == null)
                throw new Exception("No se encontró el movimiento de inscripción para reembolsar.");

            var usuario = await _repository.ObtenerUsuarioPorIdAsync(usuarioId);
            if (usuario == null) throw new Exception("Usuario no encontrado.");

            decimal montoReal = movimientoInscripcion.MontoReal;
            decimal montoBono = movimientoInscripcion.MontoBono;
            decimal montoRecarga = ExtraerMontoRecarga(movimientoInscripcion.Concepto);

            usuario.SaldoRecarga += montoRecarga;
            usuario.SaldoReal += montoReal;
            usuario.SaldoBono += montoBono;

            await _repository.EliminarParticipanteAsync(participante);

            if (sala.Capitan1Id == usuarioId) sala.Capitan1Id = null;
            if (sala.Capitan2Id == usuarioId) sala.Capitan2Id = null;
            if (sala.GanadorSorteoId == usuarioId) sala.GanadorSorteoId = null;
            if (sala.TurnoActualId == usuarioId) sala.TurnoActualId = null;

            if (sala.Estado == "SORTEO" || sala.Estado == "DRAFTING")
            {
                if (sala.Capitan1Id == null || sala.Capitan2Id == null)
                {
                    sala.Estado = "ESPERANDO";
                }
            }

            var movimientoReembolso = new Movimiento
            {
                UsuarioId = usuarioId,
                SalaId = salaId,
                Tipo = "INGRESO",
                MontoReal = montoReal,
                MontoBono = montoBono,
                Concepto = $"Reembolso por retiro administrativo de Sala {salaId}. Devuelto: S/{montoRecarga} Recarga, S/{montoReal} Ganancias, S/{montoBono} Bono.",
                Fecha = DateTime.UtcNow
            };

            await _repository.AgregarMovimientoAsync(movimientoReembolso);
            await _repository.GuardarCambiosAsync();

            return new UnirseSalaResponseDto
            {
                Mensaje = "Jugador retirado de la sala por administración y reembolso aplicado.",
                SaldoRealRestante = usuario.SaldoReal,
                SaldoBonoRestante = usuario.SaldoBono,
                SaldoRecargaRestante = usuario.SaldoRecarga
            };
        }

        private static decimal ExtraerMontoRecarga(string? concepto)
        {
            var matchRecarga = Regex.Match(
                concepto ?? string.Empty,
                @"Pagado con:\s*S/(?<recarga>[0-9]+(?:[\.,][0-9]+)?)\s+Recarga",
                RegexOptions.IgnoreCase);

            if (!matchRecarga.Success)
            {
                return 0m;
            }

            var recargaText = matchRecarga.Groups["recarga"].Value.Replace(',', '.');
            return decimal.TryParse(recargaText, NumberStyles.Number, CultureInfo.InvariantCulture, out var parsed)
                ? parsed
                : 0m;
        }

        public async Task<string> TomarSalaAsync(int salaId, int adminId)
        {
            // Usamos tu repositorio para buscar la sala
            var sala = await _repository.ObtenerSalaPorIdAsync(salaId);
            if (sala == null) throw new Exception("Sala no encontrada");

            // Pasamos la sala a la columna verde de "Mis Tareas Activas"
            sala.Estado = "EN_REVISION";

            await _repository.GuardarCambiosAsync();

            return "Sala tomada con éxito. Ahora está en tu bandeja.";
        }

        public async Task<string> ProcesarSalaAsync(int salaId, bool aprobar, decimal costo, int adminId, string? nombreLobby, string? passwordLobby)
        {
            var sala = await _repository.ObtenerSalaPorIdAsync(salaId);
            if (sala == null) throw new Exception("Sala no encontrada");

            if (aprobar)
            {
                sala.Estado = "ESPERANDO";
                sala.CostoEntrada = costo;

                // 👇 ¡AQUÍ ESTÁ LA MAGIA QUE FALTABA! 👇
                sala.NombreLobby = nombreLobby;
                sala.PasswordLobby = passwordLobby;
            }
            else
            {
                sala.Estado = "RECHAZADA";
            }

            await _repository.GuardarCambiosAsync();

            return aprobar ? "Sala aprobada y publicada" : "Sala rechazada";
        }

        public async Task<IEnumerable<object>> ObtenerTodasLasSalasAsync()
        {
            // Llama a tu repositorio para traer todas las salas de la BD
            var salasBD = await _repository.ObtenerTodasAsync();

            // Mapeamos los datos para que coincidan con lo que pide tu React
            var salasMapeadas = salasBD.Select(s => new
            {
                id = s.SalaId,
                nombre = s.Nombre ?? $"Sala de {s.Juego}",
                creador = s.Creador?.Username ?? "Usuario",
                juego = s.Juego,
                formato = s.Formato ?? s.TipoSala, // <-- Tu ajuste para el 5v5 Captains Mode
                costo = s.CostoEntrada,
                estado = s.Estado,
                fecha = s.FechaCreacion.ToString("dd/MM/yyyy HH:mm"),
                jugadores = s.Participantes.Count,
                maxJugadores = (s.Formato ?? "").Contains("5v5") ? 10 : ((s.Formato ?? "").Contains("Auto Chess") ? 8 : 2),
                mmrMinimo = s.MmrMinimo,
                mmrMaximo = s.MmrMaximo,
                nombreLobby = s.NombreLobby,
                passwordLobby = s.PasswordLobby,

                // 👇 1. MANDAMOS LOS DATOS DEL DRAFT AL FRONTEND 👇
                capitan1Id = s.Capitan1Id,
                capitan2Id = s.Capitan2Id,
                ganadorSorteoId = s.GanadorSorteoId,
                turnoId = s.TurnoActualId,

                // 👇 2. MANDAMOS EL ID DEL JUGADOR PARA QUE REACT LO RECONOZCA 👇
                participantes = s.Participantes.Select(p => new {
                    id = p.UsuarioId, // <--- ¡ÉSTA ES LA PIEZA CLAVE!
                    usuarioId = p.UsuarioId,
                    username = p.Usuario != null ? p.Usuario.Username : "Desconocido",
                    steamName = p.GameAccount != null ? p.GameAccount.IdVisible : "Sin cuenta",
                    mmr = p.GameAccount != null ? p.GameAccount.RangoActual : "N/A",
                    equipo = p.Equipo,
                    nombreLobby = s.NombreLobby,
                    passwordLobby = s.PasswordLobby
                }).ToList()
            });

            return salasMapeadas;
        }

        public async Task<string> CancelarSalaAsync(int salaId)
        {
            var sala = await _repository.ObtenerSalaConParticipantesAsync(salaId);
            if (sala == null) throw new Exception("Sala no encontrada.");
            if (sala.Estado == "CANCELADA") throw new Exception("La sala ya está cancelada.");

            sala.Estado = "CANCELADA";
            int jugadoresReembolsados = 0;

            foreach (var participante in sala.Participantes)
            {
                var reciboPago = await _repository.ObtenerReciboInscripcionAsync(participante.UsuarioId, salaId);
                if (reciboPago != null)
                {
                    var jugador = await _repository.ObtenerUsuarioPorIdAsync(participante.UsuarioId);
                    if (jugador != null)
                    {
                        jugador.SaldoReal += reciboPago.MontoReal;
                        jugador.SaldoBono += reciboPago.MontoBono;

                        var movimientoReembolso = new Movimiento
                        {
                            UsuarioId = jugador.UsuarioId,
                            Tipo = "INGRESO",
                            MontoReal = reciboPago.MontoReal,
                            MontoBono = reciboPago.MontoBono,
                            Concepto = $"Reembolso por cancelación de Sala {salaId}",
                            Fecha = DateTime.UtcNow
                        };
                        await _repository.AgregarMovimientoAsync(movimientoReembolso);
                        jugadoresReembolsados++;
                    }
                }
            }

            await _repository.GuardarCambiosAsync();
            return $"Sala {salaId} cancelada. Se reembolsó el dinero a {jugadoresReembolsados} jugadores.";
        }

        public async Task<string> CancelarSalaYReembolsarAdminAsync(int salaId)
        {
            // 1. Obtenemos la sala usando tu repositorio
            var sala = await _repository.ObtenerSalaConParticipantesAsync(salaId);

            if (sala == null)
                throw new Exception("La sala no existe.");

            if (sala.Estado != "ESPERANDO")
                throw new Exception("Solo se pueden cancelar salas que están en espera.");

            // 2. Cambiar el estado de la sala
            sala.Estado = "CANCELADA";

            // 3. Devolver el dinero exacto a cada participante
            foreach (var participante in sala.Participantes)
            {
                // Buscamos cuánto pagó exactamente y de qué monedero
                var movimientoInscripcion = await _repository.ObtenerMovimientoInscripcionAsync(participante.UsuarioId, salaId);

                if (movimientoInscripcion != null)
                {
                    var usuario = await _repository.ObtenerUsuarioPorIdAsync(participante.UsuarioId);
                    if (usuario != null)
                    {
                        // Calculamos los montos igual que en tu método de retiro
                        decimal montoReal = movimientoInscripcion.MontoReal;
                        decimal montoBono = movimientoInscripcion.MontoBono;
                        decimal montoRecarga = ExtraerMontoRecarga(movimientoInscripcion.Concepto);

                        // Devolvemos la plata a los saldos
                        usuario.SaldoRecarga += montoRecarga;
                        usuario.SaldoReal += montoReal;
                        usuario.SaldoBono += montoBono;

                        // Registramos el reembolso en el historial
                        var movimientoReembolso = new Movimiento
                        {
                            UsuarioId = usuario.UsuarioId,
                            SalaId = salaId,
                            Tipo = "INGRESO",
                            MontoReal = montoReal,
                            MontoBono = montoBono,
                            Concepto = $"Reembolso por cancelación de Sala {salaId} (Admin). Devuelto: S/{montoRecarga} Recarga, S/{montoReal} Real, S/{montoBono} Bono.",
                            Fecha = DateTime.UtcNow
                        };

                        await _repository.AgregarMovimientoAsync(movimientoReembolso);
                    }
                }
            }

            // 4. Guardamos todos los cambios en la base de datos de un solo golpe
            await _repository.GuardarCambiosAsync();

            // 5. ¡Avisamos por SignalR a los jugadores para que su pantalla se actualice al instante!
            await _hubContext.Clients.Group(salaId.ToString()).SendAsync("ActualizarPantalla");

            return "Sala cancelada y fondos reembolsados exitosamente.";
        }

        public async Task<SugerenciaGanadorResponseDto> SugerirGanadorAsync(int salaId)
        {
            var sala = await _repository.ObtenerSalaConParticipantesAsync(salaId);
            if (sala == null) throw new Exception("Sala no encontrada.");
            if (!sala.Participantes.Any()) throw new Exception("No hay participantes en esta sala.");

            return new SugerenciaGanadorResponseDto
            {
                SalaId = salaId,
                SugerenciaGanadorId = sala.Participantes.First().UsuarioId,
                Confianza = "ALTA",
                Motivo = "Se detectó una victoria reciente en OpenDota/HenrikDev (Simulado)."
            };
        }

        public async Task<string> LanzarMonedaAsync(int salaId, int usuarioId)
        {
            var sala = await _repository.ObtenerSalaPorIdAsync(salaId);
            if (sala == null) throw new Exception("Sala no encontrada.");

            if (sala.Estado != "SORTEO") throw new Exception("La sala no está en fase de sorteo.");

            // Verificamos que quien presiona el botón sea uno de los capitanes
            if (sala.Capitan1Id != usuarioId && sala.Capitan2Id != usuarioId)
                throw new Exception("Solo los capitanes pueden lanzar la moneda.");

            // 🪙 LANZAMOS LA MONEDA (50/50 de probabilidad)
            Random random = new Random();
            int ganadorId = random.Next(2) == 0 ? sala.Capitan1Id.Value : sala.Capitan2Id.Value;

            // Asignamos el ganador del sorteo y le damos el primer turno
            sala.GanadorSorteoId = ganadorId;
            sala.TurnoActualId = ganadorId;

            // Pasamos a la fase de reclutamiento
            sala.Estado = "DRAFTING";

            await _repository.GuardarCambiosAsync();

            return "La moneda ha hablado. ¡Que empiece el Draft!";
        }

        public async Task<string> ForzarCapitanAsync(int salaId, int nuevoCapitanId)
        {
            var sala = await _repository.ObtenerSalaPorIdAsync(salaId);
            if (sala == null) throw new Exception("Sala no encontrada.");

            if (sala.Estado != "SORTEO" && sala.Estado != "ESPERANDO")
                throw new Exception("No puedes cambiar capitanes en esta fase.");

            // Evitar que pongan al mismo dos veces
            if (sala.Capitan1Id == nuevoCapitanId || sala.Capitan2Id == nuevoCapitanId)
                throw new Exception("Este jugador ya es capitán.");

            // Lógica de reemplazo rotativo: El nuevo entra como Capitan 1, el viejo Capitan 1 pasa a ser Capitan 2, y el viejo Capitan 2 pierde la corona.
            sala.Capitan2Id = sala.Capitan1Id;
            sala.Capitan1Id = nuevoCapitanId;

            await _repository.GuardarCambiosAsync();

            return "Líder forzado con éxito por el Administrador.";
        }




        public async Task<string> FinalizarSalaAsync(FinalizarSalaDto request)
        {
            var sala = await _repository.ObtenerSalaConParticipantesAsync(request.SalaId);
            if (sala == null) throw new Exception("Sala no encontrada.");

            if (sala.Estado == "FINALIZADA" || sala.Estado == "CANCELADA")
                throw new Exception("La sala ya no está activa.");

            // =========================================================
            // 👇 NUEVA LÓGICA MAGICA PARA 5v5 (EQUIPOS) 👇
            // =========================================================
            if (sala.Formato != null && sala.Formato.Contains("5v5"))
            {
                // Detectamos si el front nos mandó el número 1 o 2
                string nombreEquipoGanador = request.GanadorId == 1 ? "EQUIPO1" : "EQUIPO2";

                // Filtramos a los 5 participantes ganadores
                var ganadores = sala.Participantes.Where(p => p.Equipo == nombreEquipoGanador).ToList();

                if (!ganadores.Any()) throw new Exception($"Nadie del {nombreEquipoGanador} está en la sala.");

                // Dividimos la torta (el premio)
                decimal premioPorJugador = sala.PremioARepartir / ganadores.Count;

                foreach (var participante in ganadores)
                {
                    var jugadorGanador = await _repository.ObtenerUsuarioPorIdAsync(participante.UsuarioId);
                    if (jugadorGanador != null)
                    {
                        jugadorGanador.SaldoReal += premioPorJugador; // 💰 ¡Dinero para cada uno!

                        var movimientoPremio = new Movimiento
                        {
                            UsuarioId = jugadorGanador.UsuarioId,
                            Tipo = "INGRESO",
                            MontoReal = premioPorJugador,
                            MontoBono = 0,
                            Concepto = $"Premio por ganar la Sala {sala.SalaId} ({nombreEquipoGanador})",
                            Fecha = DateTime.UtcNow
                        };
                        await _repository.AgregarMovimientoAsync(movimientoPremio);
                    }
                }

                sala.Estado = "FINALIZADA";
                sala.ResultadoGanador = nombreEquipoGanador;
                await _repository.GuardarCambiosAsync();

                return $"¡Partida 5v5 finalizada! Se han repartido S/ {premioPorJugador} a cada jugador del {nombreEquipoGanador}.";
            }
            // =========================================================
            // 👇 LÓGICA ANTIGUA PARA 1v1 (INDIVIDUAL) 👇
            // =========================================================
            else
            {
                var participanteGanador = sala.Participantes.FirstOrDefault(p => p.UsuarioId == request.GanadorId);
                if (participanteGanador == null)
                    throw new Exception("El jugador indicado como ganador no participó en esta sala.");

                var ganador = await _repository.ObtenerUsuarioPorIdAsync(request.GanadorId);
                if (ganador == null) throw new Exception("Usuario ganador no encontrado.");

                ganador.SaldoReal += sala.PremioARepartir;

                var movimientoPremio = new Movimiento
                {
                    UsuarioId = ganador.UsuarioId,
                    Tipo = "INGRESO",
                    MontoReal = sala.PremioARepartir,
                    MontoBono = 0,
                    Concepto = $"Premio por ganar la Sala {sala.SalaId} de {sala.Juego}",
                    Fecha = DateTime.UtcNow
                };

                await _repository.AgregarMovimientoAsync(movimientoPremio);

                sala.Estado = "FINALIZADA";
                sala.ResultadoGanador = ganador.Username;
                await _repository.GuardarCambiosAsync();



                return $"¡Sala finalizada con éxito! Se han transferido S/ {sala.PremioARepartir} a {ganador.Username}.";
            }
        }

        public async Task<string> CambiarEquipoAsync(int usuarioId, int salaId, string nuevoEquipo)
        {
            // 1. Validar que no manden cualquier texto raro
            if (nuevoEquipo != "EQUIPO1" && nuevoEquipo != "EQUIPO2")
                throw new Exception("El equipo seleccionado no es válido.");

            // 2. Buscar la sala con todos sus participantes
            var sala = await _repository.ObtenerSalaConParticipantesAsync(salaId);
            if (sala == null)
                throw new Exception("La sala no existe.");

            // 3. Buscar a este usuario dentro de los participantes de la sala
            var participante = sala.Participantes.FirstOrDefault(p => p.UsuarioId == usuarioId);
            if (participante == null)
                throw new Exception("No estás inscrito en esta sala.");

            // Opcional: Validar que la sala siga en estado "Esperando"
            // si (sala.Estado != "Esperando") throw new Exception("La partida ya empezó, no puedes cambiarte.");

            // 4. Hacer el cambio
            participante.Equipo = nuevoEquipo;

            // 5. Guardar los cambios en PostgreSQL
            await _repository.GuardarCambiosAsync();

            await _hubContext.Clients.Group(salaId.ToString()).SendAsync("ActualizarPantalla");

            return $"Te has cambiado al {(nuevoEquipo == "EQUIPO1" ? "Radiant/Atacantes" : "Dire/Defensores")} exitosamente.";
        }

        public async Task<string> ReclutarJugadorAsync(int salaId, int capitanId, int jugadorReclutadoId)
        {
            var sala = await _repository.ObtenerSalaPorIdAsync(salaId);
            if (sala == null) throw new Exception("Sala no encontrada.");

            if (sala.Estado != "DRAFTING") throw new Exception("La sala no está en fase de reclutamiento.");
            if (sala.TurnoActualId != capitanId) throw new Exception("No es tu turno de elegir.");

            // 1. Identificamos para qué equipo está reclutando este capitán
            string equipoDelCapitan = (capitanId == sala.Capitan1Id) ? "EQUIPO1" : "EQUIPO2";

            var jugador = sala.Participantes.FirstOrDefault(p => p.UsuarioId == jugadorReclutadoId);
            if (jugador == null) throw new Exception("El jugador no está en la sala.");
            if (jugador.Equipo != "ESPERANDO_DRAFT") throw new Exception("El jugador ya fue elegido por otro equipo.");

            // 2. Asignamos el equipo al jugador reclutado
            jugador.Equipo = equipoDelCapitan;

            // (Opcional pero recomendado: Asegurarnos de que el Capitán también tenga su equipo asignado)
            var capitan = sala.Participantes.FirstOrDefault(p => p.UsuarioId == capitanId);
            if (capitan != null) capitan.Equipo = equipoDelCapitan;

            // 3. Pasamos el turno al OTRO capitán
            sala.TurnoActualId = (capitanId == sala.Capitan1Id) ? sala.Capitan2Id : sala.Capitan1Id;

            // 4. Verificamos si ya no quedan jugadores libres para terminar el Draft
            // (Buscamos si queda alguien que no sea capitán y siga en ESPERANDO_DRAFT)
            bool quedanLibres = sala.Participantes.Any(p =>
                p.Equipo == "ESPERANDO_DRAFT" &&
                p.UsuarioId != sala.Capitan1Id &&
                p.UsuarioId != sala.Capitan2Id);

            if (!quedanLibres)
            {
                // ¡Se acabó el Draft! Pasamos la sala a EN CURSO
                sala.Estado = "EN_CURSO";

                // Le asignamos su equipo al último capitán por si acaso
                var otroCapitan = sala.Participantes.FirstOrDefault(p => p.UsuarioId == sala.TurnoActualId);
                if (otroCapitan != null)
                    otroCapitan.Equipo = (sala.TurnoActualId == sala.Capitan1Id) ? "EQUIPO1" : "EQUIPO2";
            }

            await _repository.GuardarCambiosAsync();

            await _hubContext.Clients.Group(salaId.ToString()).SendAsync("ActualizarPantalla");

            return !quedanLibres ? "¡Draft finalizado! La partida va a comenzar." : $"Jugador reclutado para el {equipoDelCapitan}.";
        }






    }

}