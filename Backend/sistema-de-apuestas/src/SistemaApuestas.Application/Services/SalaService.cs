using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.DTOs.Salas;
using SistemaApuestas.Application.Interfaces;
using SistemaApuestas.Application.Interfaces.Salas;
using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Betting;

namespace SistemaApuestas.Application.Services
{
    public class SalaService : ISalaService
    {
        private readonly ISalaRepository _repository;

        public SalaService(ISalaRepository repository)
        {
            _repository = repository;
        }

        public async Task<int> CrearSalaAsync(int creadorId, CrearSalaDto request)
        {
            var nuevaSala = new Sala
            {
                CreadorId = creadorId,
                Juego = request.Juego,
                CostoEntrada = request.CostoEntrada,
                PremioARepartir = request.PremioARepartir,
                GananciaPlataforma = request.GananciaPlataforma,
                // 👇 CAMBIO 1: La sala nace pendiente de revisión
                Estado = "PENDIENTE_APROBACION",
                TipoSala = "BASICA",
                FechaCreacion = DateTime.UtcNow
            };

            await _repository.AgregarSalaAsync(nuevaSala);
            await _repository.GuardarCambiosAsync();

            return nuevaSala.SalaId;
        }

        public async Task<UnirseSalaResponseDto> UnirseASalaAsync(int jugadorId, InscripcionSalaDto request)
        {
            var jugador = await _repository.ObtenerUsuarioPorIdAsync(jugadorId);
            if (jugador == null) throw new Exception("Jugador no encontrado.");

            var sala = await _repository.ObtenerSalaPorIdAsync(request.SalaId);
            if (sala == null) throw new Exception("La sala no existe.");

            var gameAccount = await _repository.ObtenerGameAccountAsync(request.GameAccountId, jugadorId);
            if (gameAccount == null) throw new Exception("La cuenta de juego no existe o no te pertenece.");

            if (sala.Estado != "ESPERANDO") throw new Exception("La sala ya no acepta participantes.");

            if (await _repository.ExisteInscripcionAsync(request.SalaId, jugadorId))
                throw new Exception("Ya estás inscrito en esta sala.");

            decimal costoEntrada = sala.CostoEntrada;
            if ((jugador.SaldoBono + jugador.SaldoReal) < costoEntrada)
                throw new Exception("Saldo insuficiente para unirte a esta sala.");

            // CAJERO INTELIGENTE
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
                Equipo = "PORASIGNAR"
            };
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

        public async Task<string> ProcesarSalaAsync(int salaId, bool aprobar, decimal costo, int adminId)
        {
            var sala = await _repository.ObtenerSalaPorIdAsync(salaId);
            if (sala == null) throw new Exception("Sala no encontrada");

            if (aprobar)
            {
                sala.Estado = "ESPERANDO";
                sala.CostoEntrada = costo; // <-- Actualizamos con el nuevo precio del Admin
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
            // (Ajusta el nombre del método según lo que tengas en ISalaRepository)
            var salasBD = await _repository.ObtenerTodasAsync();

            // Mapeamos los datos para que coincidan con lo que pide tu React
            var salasMapeadas = salasBD.Select(s => new
            {
                id = s.SalaId,
                nombre = s.Nombre ?? $"Sala de {s.Juego}",
                creador = s.Creador?.Username ?? "Usuario",
                formato = s.TipoSala ?? s.Juego,
                juego = s.Juego,
                costo = s.CostoEntrada,
                estado = s.Estado,
                fecha = s.FechaCreacion.ToString("dd/MM/yyyy HH:mm"),
                jugadores = s.Participantes.Count,
                maxJugadores = (s.TipoSala ?? "").Contains("5v5") ? 10 : 2,

                 
                participantes = s.Participantes.Select(p => new {
                    username = p.Usuario.Username,
                    steamName = p.GameAccount.IdVisible, // El nombre de Steam que agregó tu amigo
                    equipo = p.Equipo // "PORASIGNAR", "EQUIPO1", "EQUIPO2"
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


    }

}