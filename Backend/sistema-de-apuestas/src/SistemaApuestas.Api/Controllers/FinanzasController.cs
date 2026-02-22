using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Financial;
using SistemaApuestas.Infrastructure.Persistence;
using System.Security.Claims;

namespace SistemaApuestas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 🔒 TODO este controlador requiere estar logueado con el Token
    public class FinanzasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FinanzasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ====================================================================
        // 1. RECARGA DIRECTA (SOLO ADMINS)
        // El Admin ya coordinó por WhatsApp y le suma el saldo al jugador.
        // ====================================================================
        [HttpPost("admin/recargar")]
        [Authorize(Roles = "SUPERADMIN")] // 🛡️ Solo el Admin puede hacer esto
        public async Task<IActionResult> RecargarSaldoFisico([FromBody] RecargaAdminDto request)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var usuarioDestino = await _context.Usuarios.FindAsync(request.UsuarioDestinoId);

            if (usuarioDestino == null) return NotFound("Usuario no encontrado.");

            // Variable auxiliar para saber fácilmente si es bono
            bool esBono = request.TipoSaldo.ToUpper() == "BONO";

            // 1. SUMAR EL DINERO AL JUGADOR (Solo se hace una vez)
            if (esBono)
            {
                usuarioDestino.SaldoBono += request.Monto;
            }
            else
            {
                usuarioDestino.SaldoReal += request.Monto;
            }

            // 2. Crear el registro de la recarga completada (Para auditoría)
            var recarga = new SolicitudRecarga
            {
                UsuarioId = usuarioDestino.UsuarioId,
                Monto = request.Monto,
                Metodo = request.MetodoPago,
                CodigoOperacion = request.CodigoOperacion,
                Estado = "COMPLETADA",
                AdminAtendiendoId = adminId,
                FechaEmision = DateTime.UtcNow,
                FechaCierre = DateTime.UtcNow
            };
            _context.SolicitudesRecarga.Add(recarga);
            await _context.SaveChangesAsync(); // Guardamos para obtener el ID de la recarga

            // 3. Registrar en el Libro Mayor (MOVIMIENTOS)
            var movimiento = new Movimiento
            {
                UsuarioId = usuarioDestino.UsuarioId,
                RecargaId = recarga.RecargaId,
                Tipo = "INGRESO",
                // Aquí usamos lógica condicional: Si es bono, el real es 0. Si no, es el monto.
                MontoReal = esBono ? 0 : request.Monto,
                MontoBono = esBono ? request.Monto : 0,
                Concepto = $"Recarga por WhatsApp aprobada por Admin {adminId}",
                
                Fecha = DateTime.UtcNow
            };
            _context.Movimientos.Add(movimiento);

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"Se ha recargado S/ {request.Monto} ({request.TipoSaldo.ToUpper()}) a {usuarioDestino.Username} exitosamente." });
        }

        // ====================================================================
        // 2. SOLICITAR RETIRO (USUARIO)
        // El jugador pide su plata. Queda en PENDIENTE.
        // ====================================================================
        [HttpPost("retiros/solicitar")]
        public async Task<IActionResult> SolicitarRetiro([FromBody] RetiroSolicitudDto request)
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var usuario = await _context.Usuarios.FindAsync(usuarioId);

            // Regla de Negocio: Mínimo 20 soles (Como está en tu base de datos)
            if (request.Monto < 20) return BadRequest("El retiro mínimo es de S/ 20.00");

            // Validar que tenga saldo suficiente
            if (usuario!.SaldoReal < request.Monto) return BadRequest("No tienes saldo suficiente para este retiro.");

            // Validar que no tenga otros retiros pendientes (Evita que retire 2 veces su mismo saldo)
            var retirosPendientes = await _context.SolicitudesRetiro
                .Where(r => r.UsuarioId == usuarioId && (r.Estado == "PENDIENTE" || r.Estado == "EN_PROCESO"))
                .SumAsync(r => r.Monto);

            if ((usuario.SaldoReal - retirosPendientes) < request.Monto)
                return BadRequest("Tienes retiros en proceso que comprometen tu saldo actual. Espera a que se aprueben.");

            // Crear solicitud
            var solicitud = new SolicitudRetiro
            {
                UsuarioId = usuarioId,
                Monto = request.Monto,
                CuentaDestino = request.CuentaDestino, // Ej: "Yape: 987654321"
                Estado = "PENDIENTE",
                FechaEmision = DateTime.UtcNow
            };

            _context.SolicitudesRetiro.Add(solicitud);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Solicitud de retiro enviada. Un administrador te contactará." });
        }


        // ====================================================================
        // 3. TOMAR SOLICITUD DE RETIRO (SOLO ADMINS) - EL SEMÁFORO 🚦
        // Bloquea la solicitud para que otro admin no la pague.
        // ====================================================================
        [HttpPut("admin/retiros/{retiroId}/tomar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> TomarRetiro(int retiroId)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var solicitud = await _context.SolicitudesRetiro.Include(r => r.Usuario).FirstOrDefaultAsync(r => r.RetiroId == retiroId);

            if (solicitud == null) return NotFound("Solicitud no encontrada.");

            // EL SEMÁFORO: Si ya lo tomó otro admin, rechaza la acción
            if (solicitud.Estado != "PENDIENTE")
                return BadRequest("Esta solicitud ya está siendo atendida por otro administrador o ya fue cerrada.");

            // Bloquear la solicitud
            solicitud.Estado = "EN_PROCESO";
            solicitud.AdminAtendiendoId = adminId;
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"Has bloqueado la solicitud. Ahora descuenta el saldo y comunícate con {solicitud.Usuario.Username}." });
        }

        // ====================================================================
        // 4. COMPLETAR RETIRO (SOLO ADMINS)
        // El admin ya yapeó, ahora resta el saldo del sistema.
        // ====================================================================
        [HttpPut("admin/retiros/{retiroId}/completar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> CompletarRetiro(int retiroId)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var solicitud = await _context.SolicitudesRetiro.Include(r => r.Usuario).FirstOrDefaultAsync(r => r.RetiroId == retiroId);

            if (solicitud == null) return NotFound();

            // Solo el admin que "Tomó" la solicitud puede completarla
            if (solicitud.Estado != "EN_PROCESO" || solicitud.AdminAtendiendoId != adminId)
                return BadRequest("No puedes completar esta solicitud porque no la tienes asignada o ya fue pagada.");

            // 1. Restar saldo al usuario
            solicitud.Usuario.SaldoReal -= solicitud.Monto;

            // 2. Cambiar estado
            solicitud.Estado = "COMPLETADO";
            solicitud.FechaPago = DateTime.UtcNow;

            // 3. Registrar en Libro Mayor (MOVIMIENTOS)
            var movimiento = new Movimiento
            {
                UsuarioId = solicitud.UsuarioId,
                RetiroId = solicitud.RetiroId,
                Tipo = "EGRESO",
                MontoReal = solicitud.Monto,
                MontoBono = 0,
                Concepto = $"Retiro procesado a la cuenta {solicitud.CuentaDestino}",
                Fecha = DateTime.UtcNow
            };
            _context.Movimientos.Add(movimiento);

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Retiro completado y saldo descontado del jugador exitosamente." });
        }
    }

    // --- DTOs (Data Transfer Objects) ---
    public class RecargaAdminDto
    {
        public int UsuarioDestinoId { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; } = string.Empty;
        public string CodigoOperacion { get; set; } = string.Empty;

        public string TipoSaldo { get; set; } = "REAL";
    }

    public class RetiroSolicitudDto
    {
        public decimal Monto { get; set; }
        public string CuentaDestino { get; set; } = string.Empty; // Celular o número de cuenta
    }
}