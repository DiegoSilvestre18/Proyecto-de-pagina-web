using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaApuestas.Application.DTOs.Financial.Request;
using SistemaApuestas.Application.Interfaces.Financial;
using System.Security.Claims;
using System;
using System.Threading.Tasks;

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
            try
            {
                var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var resultado = await _financialService.SolicitarRecargaAsync(usuarioId, request);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPost("retiros/solicitar")]
        public async Task<IActionResult> SolicitarRetiro([FromBody] SolicitudRetiroDto request)
        {
            try
            {
                var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var resultado = await _financialService.SolicitarRetiroAsync(usuarioId, request);
                return Ok(resultado);
            }
            catch (Exception ex) // 👈 Aquí atrapamos el error del retiro pendiente
            {
                // Devolvemos el mensaje exacto para que el Frontend lo muestre en un alert()
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpGet("mi-saldo")]
        public async Task<IActionResult> ObtenerMiSaldo()
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var saldo = await _financialService.ObtenerMiSaldoAsync(usuarioId);
            return Ok(saldo);
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

        [HttpGet("admin/mis-solicitudes")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> ObtenerMisSolicitudes()
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var solicitudes = await _financialService.ObtenerMisSolicitudesEnProcesoAsync(adminId);
            return Ok(solicitudes);
        }

        [HttpPut("admin/solicitudes/tomar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> TomarSolicitud([FromBody] TomarSolicitudDto request)
        {
            try
            {
                var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var resultado = await _financialService.TomarSolicitudAsync(adminId, request.SolicitudId, request.Tipo);

                if (resultado.Estado == "CONFLICTO")
                    return Conflict(resultado);

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
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
            try
            {
                var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var resultado = await _financialService.ProcesarRecargaAsync(adminId, request);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPut("admin/retiros/procesar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> ProcesarRetiro([FromBody] ProcesarSolicitudDto request)
        {
            try
            {
                var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var resultado = await _financialService.ProcesarRetiroAsync(adminId, request);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPost("admin/bonos/otorgar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> OtorgarBono([FromBody] OtorgarBonoDto request)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var resultado = await _financialService.OtorgarBonoAsync(adminId, request);
            return Ok(resultado);
        }
    }
}