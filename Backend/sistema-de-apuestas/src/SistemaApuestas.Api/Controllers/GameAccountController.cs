using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaApuestas.Application.DTOs.GameAccount;
using SistemaApuestas.Application.Interfaces.GameAccount;
using System.Security.Claims;

namespace SistemaApuestas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 🛡️ Protegido por Token JWT
    public class GameAccountController : ControllerBase
    {
        private readonly IGameAccountService _gameAccountService;

        public GameAccountController(IGameAccountService gameAccountService)
        {
            _gameAccountService = gameAccountService;
        }

        [HttpPost("vincular")]
        public async Task<IActionResult> VincularCuenta([FromBody] VincularCuentaDto request)
        {
            try
            {
                // Extraemos el ID del usuario directamente del Token JWT de Postman
                var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (usuarioIdClaim == null) return Unauthorized("Token inválido.");

                int usuarioId = int.Parse(usuarioIdClaim);

                var mensaje = await _gameAccountService.VincularCuentaAsync(usuarioId, request);
                return Ok(new { mensaje });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPut("sincronizar")]
        public async Task<IActionResult> SincronizarRango([FromBody] SincronizarCuentaDto request)
        {
            try
            {
                var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (usuarioIdClaim == null) return Unauthorized("Token inválido.");

                int usuarioId = int.Parse(usuarioIdClaim);
                var mensaje = await _gameAccountService.SincronizarRangoAsync(usuarioId, request);

                return Ok(new { mensaje });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }


    }
}