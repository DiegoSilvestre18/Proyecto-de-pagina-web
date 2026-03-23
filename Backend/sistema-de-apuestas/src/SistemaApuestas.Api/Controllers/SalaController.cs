using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.DTOs.Salas;
using SistemaApuestas.Application.Interfaces.Salas;
using SistemaApuestas.Application.Services;
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

        // 👇 ESTE ES EL ENDPOINT QUE TE FALTA PARA QUE EL 404 DESAPAREZCA 👇
        [HttpGet]
        public async Task<IActionResult> ObtenerSalas()
        {
            try
            {
                var salas = await _salaService.ObtenerTodasLasSalasAsync();
                return Ok(salas);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPut("admin/tomar/{id}")]
        [Authorize(Roles = "SUPERADMIN,HOST")]
        public async Task<IActionResult> TomarSala(int id)
        {
            try
            {
                var adminId = ObtenerUsuarioId();
                var mensaje = await _salaService.TomarSalaAsync(id, adminId);
                return Ok(new { mensaje });
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }

        [HttpPut("admin/procesar")]
        [Authorize(Roles = "SUPERADMIN,HOST")]
        public async Task<IActionResult> ProcesarSala([FromBody] ProcesarSalaDto request)
        {
            try
            {
                var adminId = ObtenerUsuarioId();
                var mensaje = await _salaService.ProcesarSalaAsync(
                    request.SalaId,
                    request.Aprobar,
                    request.Costo, 
                    adminId, 
                    request.NombreLobby,
                    request.PasswordLobby
                    );
                return Ok(new { mensaje });
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

        [HttpPost("{salaId}/retirarse")]
        [Authorize]
        public async Task<IActionResult> RetirarseDeSala(int salaId)
        {
            try
            {
                var resultado = await _salaService.RetirarseDeSalaAsync(ObtenerUsuarioId(), salaId);
                return Ok(resultado);
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }

        [HttpPost("{salaId}/expulsar/{usuarioId}")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> ExpulsarUsuarioDeSala(int salaId, int usuarioId)
        {
            try
            {
                var resultado = await _salaService.ExpulsarUsuarioPorAdminAsync(salaId, usuarioId);
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

        [HttpPut("{salaId}/cambiar-equipo")]
        [Authorize]
        public async Task<IActionResult> CambiarEquipo(int salaId, [FromBody] CambiarEquipoDto request)
        {
            try
            {
                // Extraemos quién es el usuario directamente del Token JWT
                var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (usuarioIdClaim == null) return Unauthorized("Token inválido.");

                int usuarioId = int.Parse(usuarioIdClaim);

                // Llamamos al servicio
                var mensaje = await _salaService.CambiarEquipoAsync(usuarioId, salaId, request.NuevoEquipo);

                return Ok(new { mensaje });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPost("{id}/lanzar-moneda")]
        [Authorize]
        public async Task<IActionResult> LanzarMoneda(int id)
        {
            try
            {
                var usuarioId = ObtenerUsuarioId(); // Identificamos qué capitán apretó el botón
                var mensaje = await _salaService.LanzarMonedaAsync(id, usuarioId);
                return Ok(new { mensaje });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPost("{salaId}/reclutar/{jugadorId}")]
        [Authorize]
        public async Task<IActionResult> ReclutarJugador(int salaId, int jugadorId)
        {
            try
            {
                var capitanId = ObtenerUsuarioId(); // El que aprieta el botón es el capitán
                var mensaje = await _salaService.ReclutarJugadorAsync(salaId, capitanId, jugadorId);
                return Ok(new { mensaje });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPost("{salaId}/forzar-capitan/{nuevoCapitanId}")]
        [Authorize(Roles = "SUPERADMIN,ADMIN")]
        public async Task<IActionResult> ForzarCapitan(int salaId, int nuevoCapitanId)
        {
            try
            {
                var mensaje = await _salaService.ForzarCapitanAsync(salaId, nuevoCapitanId);
                return Ok(new { mensaje });
            }
            catch (Exception ex) { return BadRequest(new { mensaje = ex.Message }); }
        }

        [HttpPost("{id}/cancelar")]
        [Authorize(Roles = "SUPERADMIN")] // ¡Muy importante que solo el admin pueda!
        public async Task<IActionResult> CancelarSalaAdmin(int id)
        {
            try
            {
                // El controlador (mesero) solo le pasa la orden al servicio (cocinero)
                var mensaje = await _salaService.CancelarSalaYReembolsarAdminAsync(id);
                return Ok(new { mensaje });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }
    }
}