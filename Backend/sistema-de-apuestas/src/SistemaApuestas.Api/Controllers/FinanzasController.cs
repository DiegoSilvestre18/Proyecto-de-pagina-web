using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaApuestas.Application.DTOs.Finanzas;
using SistemaApuestas.Application.Interfaces.Finanzas;
using System.Security.Claims;

namespace SistemaApuestas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FinanzasController : ControllerBase
    {
        private readonly IFinanzasService _finanzasService;

        public FinanzasController(IFinanzasService finanzasService)
        {
            _finanzasService = finanzasService;
        }

        private int ObtenerUsuarioId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpPost("admin/recargar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> RecargarSaldoFisico([FromBody] RecargaAdminDto request)
        {
            try
            {
                var mensaje = await _finanzasService.RecargarSaldoFisicoAsync(ObtenerUsuarioId(), request);
                return Ok(new { mensaje });
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }

        [HttpPost("retiros/solicitar")]
        public async Task<IActionResult> SolicitarRetiro([FromBody] RetiroSolicitudDto request)
        {
            try
            {
                var mensaje = await _finanzasService.SolicitarRetiroAsync(ObtenerUsuarioId(), request);
                return Ok(new { mensaje });
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }

        [HttpPut("admin/retiros/{retiroId}/tomar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> TomarRetiro(int retiroId)
        {
            try
            {
                var mensaje = await _finanzasService.TomarRetiroAsync(ObtenerUsuarioId(), retiroId);
                return Ok(new { mensaje });
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }

        [HttpPut("admin/retiros/{retiroId}/completar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> CompletarRetiro(int retiroId)
        {
            try
            {
                var mensaje = await _finanzasService.CompletarRetiroAsync(ObtenerUsuarioId(), retiroId);
                return Ok(new { mensaje });
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }
    }
}