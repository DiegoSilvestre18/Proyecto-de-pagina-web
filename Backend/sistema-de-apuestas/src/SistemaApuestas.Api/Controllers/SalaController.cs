using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaApuestas.Application.DTOs.Salas;
using SistemaApuestas.Application.Interfaces.Salas;
using System.Security.Claims;

namespace SistemaApuestas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalaController : ControllerBase
    {
        private readonly ISalaService _salaService;

        public SalaController(ISalaService salaService)
        {
            _salaService = salaService;
        }

        private int ObtenerUsuarioId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpPost("crear")]
        [Authorize]
        public async Task<IActionResult> CrearSala([FromBody] CrearSalaDto request)
        {
            try
            {
                var salaId = await _salaService.CrearSalaAsync(ObtenerUsuarioId(), request);
                return Ok(new { mensaje = "Sala creada exitosamente", salaId });
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }

        [HttpPost("unirse")]
        [Authorize]
        public async Task<IActionResult> UnirseASala([FromBody] InscripcionSalaDto request)
        {
            try
            {
                var resultado = await _salaService.UnirseASalaAsync(ObtenerUsuarioId(), request);
                return Ok(resultado);
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }

        [HttpPost("cancelar/{id}")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> CancelarSala(int id)
        {
            try
            {
                var mensaje = await _salaService.CancelarSalaAsync(id);
                return Ok(new { mensaje });
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }

        [HttpGet("sugerir-ganador/{id}")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> SugerirGanador(int id)
        {
            try
            {
                var sugerencia = await _salaService.SugerirGanadorAsync(id);
                return Ok(sugerencia);
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }

        [HttpPost("finalizar")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> FinalizarSala([FromBody] FinalizarSalaDto request)
        {
            try
            {
                var mensaje = await _salaService.FinalizarSalaAsync(request);
                return Ok(new { mensaje });
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }
    }
}