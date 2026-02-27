using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaApuestas.Application.DTOs.Financial.Request;
using SistemaApuestas.Application.Interfaces.Financial;
using System.Security.Claims;

namespace SistemaApuestas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FinanzasController : ControllerBase
    {
        private readonly IFinancialService _financialService;

        public FinanzasController(IFinancialService financialService)
        {
            _financialService = financialService;
        }

        // ====================================================================
        // ACCIONES DEL USUARIO
        // ====================================================================

        [HttpPost("recargas/solicitar")]
        public async Task<IActionResult> SolicitarRecarga([FromBody] SolicitudRecargaDto request)
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var resultado = await _financialService.SolicitarRecargaAsync(usuarioId, request);
            return Ok(resultado);
        }

        [HttpPost("retiros/solicitar")]
        public async Task<IActionResult> SolicitarRetiro([FromBody] SolicitudRetiroDto request)
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var resultado = await _financialService.SolicitarRetiroAsync(usuarioId, request);
            return Ok(resultado);
        }

        // ====================================================================
        // ACCIONES DEL ADMIN
        // ====================================================================

        [HttpGet("admin/solicitudes-pendientes")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> ObtenerPendientes()
        {
            var solicitudes = await _financialService.ObtenerSolicitudesPendientesAsync();
            return Ok(solicitudes);
        }

        /// <summary>
        /// TOMAR SOLICITUD — Operación atómica anti-concurrencia.
        /// Si otro admin ya la tomó, retorna 409 Conflict.
        /// </summary>
        [HttpPut("admin/solicitudes/tomar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> TomarSolicitud([FromBody] TomarSolicitudDto request)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var resultado = await _financialService.TomarSolicitudAsync(adminId, request.SolicitudId, request.Tipo);

            if (resultado.Estado == "CONFLICTO")
                return Conflict(resultado);

            return Ok(resultado);
        }

        [HttpPut("admin/solicitudes/liberar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> LiberarSolicitud([FromBody] TomarSolicitudDto request)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var resultado = await _financialService.LiberarSolicitudAsync(adminId, request.SolicitudId, request.Tipo);
            return Ok(resultado);
        }

        [HttpPut("admin/recargas/procesar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> ProcesarRecarga([FromBody] ProcesarSolicitudDto request)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var resultado = await _financialService.ProcesarRecargaAsync(adminId, request);
            return Ok(resultado);
        }

        [HttpPut("admin/retiros/procesar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> ProcesarRetiro([FromBody] ProcesarSolicitudDto request)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var resultado = await _financialService.ProcesarRetiroAsync(adminId, request);
            return Ok(resultado);
        }
    }
}
