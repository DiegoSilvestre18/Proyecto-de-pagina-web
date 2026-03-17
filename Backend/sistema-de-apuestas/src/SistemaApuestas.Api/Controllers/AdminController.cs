using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaApuestas.Application.Interfaces.Admin;
using System.Security.Claims;

namespace SistemaApuestas.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "SUPERADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // ==========================================
        // 🔍 1. BUSCADOR DE USUARIOS (¡El que faltaba!)
        // ==========================================
        [HttpGet("usuarios/buscar")]
        public async Task<IActionResult> BuscarUsuarios([FromQuery] string q = "")
        {
            try
            {
                var usuarios = await _adminService.BuscarUsuariosAsync(q);
                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
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
            try
            {
                var mensaje = await _adminService.ForzarMmrAsync(id, request.Juego, request.NuevoMmr);
                return Ok(new { mensaje });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        // ==========================================
        // 🔨 3. APLICAR BANEO A USUARIO
        // ==========================================
        [HttpPost("usuarios/{id}/banear")]
        public async Task<IActionResult> BanearUsuario(int id)
        {
            try
            {
                var mensaje = await _adminService.BanearUsuarioAsync(id, GetAdminId());
                return Ok(new { mensaje });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }
    }

    public class UpdateMmrDto
    {
        public string Juego { get; set; } = string.Empty;
        public string NuevoMmr { get; set; } = string.Empty;
    }
}