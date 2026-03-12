using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Domain.Entities.Gaming;
using SistemaApuestas.Domain.Entities.Identity;
using SistemaApuestas.Infrastructure.Persistence;
using System.Security.Claims;

namespace SistemaApuestas.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "SUPERADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 🔍 1. BUSCADOR DE USUARIOS (¡El que faltaba!)
        // ==========================================
        [HttpGet("usuarios/buscar")]
        public async Task<IActionResult> BuscarUsuarios([FromQuery] string q = "")
        {
            var query = _context.Usuarios.AsQueryable();

            // Si el Admin escribió algo, filtramos por nombre o email
            if (!string.IsNullOrWhiteSpace(q))
            {
                var termino = q.ToLower();
                query = query.Where(u => u.Username.ToLower().Contains(termino) ||
                                         u.Email.ToLower().Contains(termino));
            }

            // Ordenamos por los más nuevos y sacamos máximo 20
            var usuarios = await query
                .OrderByDescending(u => u.UsuarioId)
                .Take(20)
                .Select(u => new
                {
                    id = u.UsuarioId,
                    username = u.Username,
                    email = u.Email,
                    estado = "ACTIVO",
                    rangoDota = "N/A",
                    rangoValorant = "N/A"
                })
                .ToListAsync();

            return Ok(usuarios);
        }

        // Herramienta interna para saber qué Admin está ejecutando la acción
        private int GetAdminId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : 1;
        }

        // ==========================================
        // 🎯 2. FORZAR MMR MANUAL 
        // ==========================================
        [HttpPost("usuarios/{id}/forzar-mmr")]
        public async Task<IActionResult> ForzarMmr(int id, [FromBody] UpdateMmrDto request)
        {
            // Busca en la tabla game_account
            var cuenta = await _context.GameAccounts
                .FirstOrDefaultAsync(c => c.UsuarioId == id && c.Juego == request.Juego.ToUpper());

            if (cuenta == null)
            {
                return BadRequest(new { mensaje = $"El usuario no tiene una cuenta vinculada de {request.Juego}." });
            }

            // Actualizamos rango_actual y encendemos es_rango_manual = true
            cuenta.RangoActual = request.NuevoMmr;
            cuenta.EsRangoManual = true;

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = $"MMR forzado a {request.NuevoMmr}." });
        }

        // ==========================================
        // 🔨 3. APLICAR BANEO A USUARIO
        // ==========================================
        [HttpPost("usuarios/{id}/banear")]
        public async Task<IActionResult> BanearUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound(new { mensaje = "Usuario no encontrado." });

            int idDelAdmin = GetAdminId(); // Sacamos tu ID del token

            // Insertamos directamente en tu tabla 'baneo'
            var nuevoBaneo = new Baneo
            {
                UsuarioId = id,           // usuario_id
                AdminId = idDelAdmin,     // admin_id
                Motivo = "Baneado desde el Panel de Administración", // motivo
                Tiempo = 9999,            // tiempo (9999 = Permanente)
                FechaBaneo = DateTime.UtcNow // fecha_baneo
            };

            _context.Baneos.Add(nuevoBaneo);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"El usuario {usuario.Username} ha sido baneado permanentemente." });
        }
    }

    public class UpdateMmrDto
    {
        public string Juego { get; set; } = string.Empty;
        public string NuevoMmr { get; set; } = string.Empty;
    }
}