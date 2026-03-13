using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.DTOs.Salas;
using SistemaApuestas.Application.Interfaces;
using SistemaApuestas.Application.Interfaces.Salas;
using SistemaApuestas.Application.Repositories.GameAccount;
using SistemaApuestas.Application.Repositories.Identity;
using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Betting;
using SistemaApuestas.Domain.Entities.Identity;

namespace SistemaApuestas.Application.Services
{
    public class SalaService : ISalaService
    {
        private readonly ISalaRepository _repository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IGameAccountRepository _gameAccountRepository;

        public SalaService(ISalaRepository repository, IUsuarioRepository repositoryUser, IGameAccountRepository gameAccountRepository)
        {
            _repository = repository;
            _usuarioRepository = repositoryUser;
            _gameAccountRepository = gameAccountRepository;
        }

        public async Task<int> CrearSalaAsync(int creadorId, CrearSalaDto request)
        {
            // 1. Buscamos quién está creando la sala para saber su ROL
            var creador = await _repository.ObtenerUsuarioPorIdAsync(creadorId);
            bool esAdmin = creador != null && (creador.Rol == "SUPERADMIN" || creador.Rol == "ADMIN");

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

            // Verificamos si la sala ya está llena ANTES de procesar el pago
            // (Asegúrate de tener un método para contar participantes, ej: _repository.ContarParticipantesSalaAsync)
            // O si ya tienes la colección Participantes cargada en 'sala', puedes usar sala.Participantes.Count
            int numParticipantesActuales = sala.Participantes?.Count ?? 0;

            // Si la sala es de 5v5, el límite es 10. (Si es 1v1, el límite es 2).
            int limiteJugadores = sala.Formato.Contains("5v5") ? 10 : 2;

            if (numParticipantesActuales >= limiteJugadores)
            {
                throw new Exception("La sala ya está llena.");
            }

            // --- LÓGICA DE COBRO INTACTA ---
            decimal costoEntrada = sala.CostoEntrada;
            if ((jugador.SaldoBono + jugador.SaldoReal) < costoEntrada)
                throw new Exception("Saldo insuficiente para unirte a esta sala.");

            decimal montoBonoUsado = 0;
            decimal montoRealUsado = 0;

            if (jugador.SaldoBono >= costoEntrada)
            {
                jugador.SaldoBono -= costoEntrada;
                montoBonoUsado = costoEntrada;
            }
            else
            {
                montoBonoUsado = jugador.SaldoBono;
                montoRealUsado = costoEntrada - jugador.SaldoBono;
                jugador.SaldoBono = 0;
                jugador.SaldoReal -= montoRealUsado;
            }

            var nuevoParticipante = new ParticipanteSala
            {
                SalaId = sala.SalaId,
                UsuarioId = jugador.UsuarioId,
                GameAccountId = gameAccount.GameAccountId,
                // Al entrar en Captains Draft, todos entran sin equipo (o puedes ponerles "POOL" o algo genérico)
                Equipo = (sala.Formato == "5v5 Captains Mode") ? "ESPERANDO_DRAFT" : request.Equipo
            };

            // Añadimos el participante (ya sea por repositorio o añadiéndolo a la colección de la sala)
            // Si tu repositorio no carga la colección 'Participantes' de la 'sala', es importante que lo haga 
            // para que la lógica de abajo funcione correctamente.
            sala.Participantes.Add(nuevoParticipante); // Si tienes la colección instanciada
            await _repository.AgregarParticipanteAsync(nuevoParticipante);

            var movimiento = new Movimiento
            {
                UsuarioId = jugador.UsuarioId,
                Tipo = "EGRESO",
                MontoReal = montoRealUsado,
                MontoBono = montoBonoUsado,
                Concepto = $"Inscripción a Sala {sala.SalaId}",
                Fecha = DateTime.UtcNow
            };
            await _repository.AgregarMovimientoAsync(movimiento);


            // =========================================================
            // 👇 NUEVO: LÓGICA DE DETECCIÓN DE SALA LLENA (CAPTAINS DRAFT) 👇
            // =========================================================

            // Volvemos a contar, sumando al jugador actual
            numParticipantesActuales++;

            if (numParticipantesActuales == limiteJugadores && sala.Formato == "5v5 Captains Mode")
            {
                // 1. Necesitamos cargar los datos completos de las cuentas de juego de los participantes
                // para poder leer su MMR. (Asegúrate de que tu repositorio pueda traer esto)

                // --- AQUÍ HAY UN RETO TÉCNICO ---
                // Para ordenar por MMR, necesitamos que los 'Participantes' tengan acceso a su 'GameAccount'.
                // Si tu modelo actual de 'ParticipanteSala' no tiene la propiedad de navegación hacia 'GameAccount' 
                // o no está cargada (Include), tendrás que pedirle al repositorio la lista con los datos completos.

                // Suponiendo que tienes un método que trae los participantes con su cuenta de juego:
                var participantesConCuentas = await _repository.ObtenerParticipantesConCuentasAsync(sala.SalaId);

                // Si no tienes ese método, tendrás que crearlo en tu repositorio o usar una consulta LINQ si usas DbContext directo.

                // Una vez que tienes la lista, la ordenas de mayor a menor MMR
                var participantesOrdenados = participantesConCuentas
                    .OrderByDescending(p => int.TryParse(p.GameAccount?.RangoActual, out int mmr) ? mmr : 0)
                    .ToList();

                // 2. Asignamos a los capitanes (los dos con más MMR)
                if (participantesOrdenados.Count >= 2)
                {
                    sala.Capitan1Id = participantesOrdenados[0].UsuarioId;
                    sala.Capitan2Id = participantesOrdenados[1].UsuarioId;

                    // 3. Pasamos la sala a la fase de sorteo de moneda
                    sala.Estado = "SORTEO";
                }
            }

            // =========================================================

            await _repository.GuardarCambiosAsync();

            return new UnirseSalaResponseDto
            {
                Mensaje = $"Inscripción exitosa. Se cobraron S/ {montoRealUsado} (Real) y S/ {montoBonoUsado} (Bono).",
                SaldoRealRestante = jugador.SaldoReal,
                SaldoBonoRestante = jugador.SaldoBono
            };
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




        public async Task<string> FinalizarSalaAsync(FinalizarSalaDto request)
        {
            var sala = await _repository.ObtenerSalaConParticipantesAsync(request.SalaId);
            if (sala == null) throw new Exception("Sala no encontrada.");

            if (sala.Estado == "FINALIZADA" || sala.Estado == "CANCELADA")
                throw new Exception("La sala ya no está activa.");

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

            return $"¡Sala finalizada con éxito! Se han transferido S/ {sala.PremioARepartir} de Saldo Real a {ganador.Username}.";
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

            return !quedanLibres ? "¡Draft finalizado! La partida va a comenzar." : $"Jugador reclutado para el {equipoDelCapitan}.";
        }




    }

}