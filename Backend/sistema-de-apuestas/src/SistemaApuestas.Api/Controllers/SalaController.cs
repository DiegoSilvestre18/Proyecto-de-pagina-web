using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Betting;
using SistemaApuestas.Infrastructure.Persistence;
using System.Security.Claims;
// Agrega aquí los using de tus Entidades (ParticipanteSala, Movimiento, etc) si te salen en rojo

namespace SistemaApuestas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SalaController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpPost("crear")]
        [Authorize] // Dependiendo de tus reglas, podrías poner [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> CrearSala([FromBody] CrearSalaDto request)
        {
            var creadorIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(creadorIdStr) || !int.TryParse(creadorIdStr, out int creadorId))
                return Unauthorized("Token inválido.");

            var nuevaSala = new Sala // Quizás debas importar tu entidad con Ctrl + .
            {
                CreadorId = creadorId,
                Juego = request.Juego,
                CostoEntrada = request.CostoEntrada,
                PremioARepartir = request.PremioARepartir,
                GananciaPlataforma = request.GananciaPlataforma,
                Estado = "ESPERANDO",
                TipoSala = "BASICA",
                FechaCreacion = DateTime.UtcNow
            };

            _context.Salas.Add(nuevaSala);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Sala creada exitosamente", salaId = nuevaSala.SalaId });
        }


        [HttpPost("unirse")]
        [Authorize] // 🛡️ Solo jugadores logueados pueden entrar
        public async Task<IActionResult> UnirseASala([FromBody] InscripcionSalaDto request)
        {
            // 1. Identificar al jugador desde su Token
            var jugadorIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(jugadorIdStr) || !int.TryParse(jugadorIdStr, out int jugadorId))
                return Unauthorized("Token inválido.");

            var jugador = await _context.Usuarios.FindAsync(jugadorId);
            if (jugador == null) return NotFound("Jugador no encontrado.");



            // 2. Buscar la sala y su precio
            var sala = await _context.Salas.FindAsync(request.SalaId);
            if (sala == null) return NotFound("La sala no existe.");

            // 2.5 Validar la cuenta de juego
            var gameAccount = await _context.GameAccounts
                .FirstOrDefaultAsync(ga => ga.GameAccountId == request.GameAccountId && ga.UsuarioId == jugadorId);

            if (gameAccount == null)
                return BadRequest("La cuenta de juego no existe o no te pertenece.");

            // Validar estado de la sala (Ajusta "ABIERTA" según cómo lo tengas en tu BD)
            if (sala.Estado != "ESPERANDO") return BadRequest("La sala ya no acepta participantes.");

            // 3. Validar si ya está inscrito
            bool yaInscrito = await _context.ParticipanteSalas.AnyAsync(p => p.SalaId == request.SalaId && p.UsuarioId == jugadorId);
            if (yaInscrito) return BadRequest("Ya estás inscrito en esta sala.");

            decimal costoEntrada = sala.CostoEntrada;

            // 4. Verificar si tiene fondos suficientes (Sumando ambos saldos)
            if ((jugador.SaldoBono + jugador.SaldoReal) < costoEntrada)
            {
                return BadRequest("Saldo insuficiente para unirte a esta sala.");
            }

            // 5. EL CAJERO INTELIGENTE (Cobro priorizando el Bono)
            decimal montoBonoUsado = 0;
            decimal montoRealUsado = 0;

            if (jugador.SaldoBono >= costoEntrada)
            {
                // El bono cubre todo
                jugador.SaldoBono -= costoEntrada;
                montoBonoUsado = costoEntrada;
            }
            else
            {
                // El bono no cubre todo, vaciamos el bono y sacamos el resto del real
                montoBonoUsado = jugador.SaldoBono;
                montoRealUsado = costoEntrada - jugador.SaldoBono;

                jugador.SaldoBono = 0;
                jugador.SaldoReal -= montoRealUsado;
            }

            // 6. Inscribir al jugador en la sala
            var nuevoParticipante = new ParticipanteSala // Asegúrate de que esta clase exista
            {
                SalaId = sala.SalaId,
                UsuarioId = jugador.UsuarioId,
                GameAccountId = gameAccount.GameAccountId,
                Equipo = "PORASIGNAR"
                // FechaInscripcion = DateTime.UtcNow,
                // Estado = "ACTIVO"
            };
            _context.ParticipanteSalas.Add(nuevoParticipante);

            // 7. Registrar el gasto en el Libro Mayor (Movimientos)
            var movimiento = new Movimiento
            {
                UsuarioId = jugador.UsuarioId,
                RecargaId = null, // Como es un gasto, no hay ID de recarga
                Tipo = "EGRESO", // ¡El dinero sale de su cuenta!
                MontoReal = montoRealUsado,
                MontoBono = montoBonoUsado,
                Concepto = $"Inscripción a Sala {sala.SalaId}",
                Fecha = DateTime.UtcNow
            };
            _context.Movimientos.Add(movimiento);

            // Guardar todo en la base de datos de un solo golpe
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = $"Inscripción exitosa a la sala. Se cobraron S/ {montoRealUsado} de Saldo Real y S/ {montoBonoUsado} de Saldo Bono.",
                saldoRealRestante = jugador.SaldoReal,
                saldoBonoRestante = jugador.SaldoBono
            });
        }


        //----------------------PARA REMBOLSOS SI ES QUE NO LLEGASE A COMPLETAR LA PARTIDA------------------------------------
        [HttpPost("cancelar/{id}")]
        [Authorize(Roles = "SUPERADMIN")] // Solo el admin puede cancelar salas
        public async Task<IActionResult> CancelarSala(int id)
        {
            // 1. Buscar la sala con todos sus participantes
            var sala = await _context.Salas
                .Include(s => s.Participantes) // Traemos la lista de inscritos
                .FirstOrDefaultAsync(s => s.SalaId == id);

            if (sala == null) return NotFound("Sala no encontrada.");
            if (sala.Estado == "CANCELADA") return BadRequest("La sala ya está cancelada.");

            // 2. Cambiar el estado de la sala
            sala.Estado = "CANCELADA";

            int jugadoresReembolsados = 0;

            // 3. Devolver el dinero a cada participante
            foreach (var participante in sala.Participantes)
            {
                // Buscamos el recibo de pago original en el Libro Mayor
                var reciboPago = await _context.Movimientos
                    .FirstOrDefaultAsync(m => m.UsuarioId == participante.UsuarioId
                                           && m.Concepto == $"Inscripción a Sala {id}"
                                           && m.Tipo == "EGRESO");

                if (reciboPago != null)
                {
                    var jugador = await _context.Usuarios.FindAsync(participante.UsuarioId);
                    if (jugador != null)
                    {
                        // Le devolvemos exactamente lo que gastó de cada saldo
                        jugador.SaldoReal += reciboPago.MontoReal;
                        jugador.SaldoBono += reciboPago.MontoBono;

                        // Creamos un nuevo recibo de Ingreso por Reembolso
                        var movimientoReembolso = new Movimiento
                        {
                            UsuarioId = jugador.UsuarioId,
                            Tipo = "INGRESO",
                            MontoReal = reciboPago.MontoReal,
                            MontoBono = reciboPago.MontoBono,
                            Concepto = $"Reembolso por cancelación de Sala {id}",
                            Fecha = DateTime.UtcNow
                        };
                        _context.Movimientos.Add(movimientoReembolso);

                        jugadoresReembolsados++;
                    }
                }
            }

            // 4. Guardar todos los cambios en la base de datos de un solo golpe
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"Sala {id} cancelada exitosamente. Se reembolsó el dinero a {jugadoresReembolsados} jugadores." });
        }


        //-------------API ASISTENTE PARA ASEGURAR EL GANADOR -------------------------
        [HttpGet("sugerir-ganador/{id}")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> SugerirGanador(int id)
        {
            var sala = await _context.Salas
                .Include(s => s.Participantes)
                .ThenInclude(p => p.GameAccount) // Necesitamos sus cuentas de juego
                .FirstOrDefaultAsync(s => s.SalaId == id);

            if (sala == null) return NotFound("Sala no encontrada.");

            // Aquí iría tu lógica de comparar a los dos jugadores.
            // Ej: Sacas el GameAccount del Jugador A y del Jugador B.
            // Haces 1 sola llamada a OpenDota pidiendo la última partida del Jugador A.
            // Revisas si ganó y si el Jugador B estaba en el equipo perdedor.

            // Como resultado, devuelves una "Sugerencia" al Frontend para que el Admin la lea:
            return Ok(new
            {
                salaId = id,
                sugerenciaGanadorId = sala.Participantes.First().UsuarioId, // El ID que la API cree que ganó
                confianza = "ALTA",
                motivo = "Se detectó una victoria reciente del Jugador A contra el Jugador B en OpenDota."
            });
        }




        //-------------------SE DECIDE QUIEN ES EL GANADOR DEL CAMPEONATOOOOOOO----------
        [HttpPost("finalizar")]
        [Authorize(Roles = "SUPERADMIN")] // 🛡️ Solo el Admin decide quién gana
        public async Task<IActionResult> FinalizarSala([FromBody] FinalizarSalaDto request)
        {
            var sala = await _context.Salas
                .Include(s => s.Participantes)
                .FirstOrDefaultAsync(s => s.SalaId == request.SalaId);

            if (sala == null) return NotFound("Sala no encontrada.");

            // Evitar pagar doble por accidente
            if (sala.Estado == "FINALIZADA" || sala.Estado == "CANCELADA")
                return BadRequest("La sala ya no está activa.");

            // Seguridad: Verificar que el ganador realmente estaba jugando en esta sala
            var participanteGanador = sala.Participantes.FirstOrDefault(p => p.UsuarioId == request.GanadorId);
            if (participanteGanador == null)
                return BadRequest("El jugador indicado como ganador no participó en esta sala.");

            var ganador = await _context.Usuarios.FindAsync(request.GanadorId);
            if (ganador == null) return NotFound("Usuario ganador no encontrado.");

            // 1. ENTREGAR EL PREMIO (¡La regla de oro: Los premios siempre son Saldo Real!)
            ganador.SaldoReal += sala.PremioARepartir;

            // 2. Registrar el ingreso en el Libro Mayor
            var movimientoPremio = new Movimiento
            {
                UsuarioId = ganador.UsuarioId,
                Tipo = "INGRESO",
                MontoReal = sala.PremioARepartir, // Todo el premio es dinero retirable
                MontoBono = 0,
                Concepto = $"Premio por ganar la Sala {sala.SalaId} de {sala.Juego}",
                Fecha = DateTime.UtcNow
            };
            _context.Movimientos.Add(movimientoPremio);

            // 3. Cerrar la sala
            sala.Estado = "FINALIZADA";
            sala.ResultadoGanador = ganador.Username; // Guardamos el nombre para el historial

            // Guardar todo de un solo golpe (Transacción segura)
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = $"¡Sala finalizada con éxito! Se han transferido S/ {sala.PremioARepartir} de Saldo Real a {ganador.Username}."
            });
        }
    }

    // El DTO ahora vive feliz y ordenado al final del archivo de Salas
    public class InscripcionSalaDto
    {
        public int SalaId { get; set; }
        public int GameAccountId { get; set; } 
    }

    public class CrearSalaDto
    {
        public string Juego { get; set; } = string.Empty;
        public decimal CostoEntrada { get; set; }
        public decimal PremioARepartir { get; set; }
        public decimal GananciaPlataforma { get; set; }
    }

    //----------------EL ADMIN DECIDE QUIEN SE LLEVA EL PREMIO-----------------
    public class FinalizarSalaDto
    {
        public int SalaId { get; set; }
        public int GanadorId { get; set; }  
    }


}