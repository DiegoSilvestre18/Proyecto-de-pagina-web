using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaApuestas.Application.DTOs.Usuario;
using SistemaApuestas.Application.Repositories.Identity;
using System.Security.Claims;

namespace SistemaApuestas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioController(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        private int ObtenerUsuarioId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpGet("me")]
        public async Task<IActionResult> ObtenerMiPerfil()
        {
            var user = await _usuarioRepository.ObtenerPorIdAsync(ObtenerUsuarioId());
            if (user == null) return NotFound(new { mensaje = "Usuario no encontrado." });

            return Ok(new
            {
                user.UsuarioId,
                user.Username,
                user.Nombre,
                ApellidoPaterno = user.ApellidoPaterno,
                ApellidoMaterno = user.ApellidoMaterno,
                user.Telefono,
                user.Email,
                user.SaldoReal,
                user.SaldoBono,
                user.Rol
            });
        }

        [HttpPut("me")]
        public async Task<IActionResult> ActualizarMiPerfil([FromBody] ActualizarPerfilDto request)
        {
            var userId = ObtenerUsuarioId();
            var user = await _usuarioRepository.ObtenerPorIdAsync(userId);

            if (user == null) return NotFound(new { mensaje = "Usuario no encontrado." });

            if (!string.IsNullOrWhiteSpace(request.Username) && !request.Username.Equals(user.Username, StringComparison.OrdinalIgnoreCase))
            {
                if (await _usuarioRepository.ExistePorUsernameAsync(request.Username.Trim()))
                    return BadRequest(new { mensaje = "El username ya está en uso." });

                user.Username = request.Username.Trim();
            }

            if (!string.IsNullOrWhiteSpace(request.Email) && !request.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase))
            {
                var existeEmail = await _usuarioRepository.ObtenerPorEmailAsync(request.Email.Trim());
                if (existeEmail != null && existeEmail.UsuarioId != userId)
                    return BadRequest(new { mensaje = "El email ya está en uso." });

                user.Email = request.Email.Trim();
            }

            if (!string.IsNullOrWhiteSpace(request.Nombre)) user.Nombre = request.Nombre.Trim();
            if (!string.IsNullOrWhiteSpace(request.ApellidoPaterno)) user.ApellidoPaterno = request.ApellidoPaterno.Trim();
            if (!string.IsNullOrWhiteSpace(request.ApellidoMaterno)) user.ApellidoMaterno = request.ApellidoMaterno.Trim();
            if (!string.IsNullOrWhiteSpace(request.Telefono)) user.Telefono = request.Telefono.Trim();

            await _usuarioRepository.ActualizarAsync(user);
            return Ok(new { mensaje = "Perfil actualizado correctamente." });
        }

        [HttpPut("me/password")]
        public async Task<IActionResult> CambiarPassword([FromBody] CambiarPasswordDto request)
        {
            if (string.IsNullOrWhiteSpace(request.PasswordActual) || string.IsNullOrWhiteSpace(request.PasswordNueva))
                return BadRequest(new { mensaje = "Debes enviar la contraseña actual y la nueva." });

            var user = await _usuarioRepository.ObtenerPorIdAsync(ObtenerUsuarioId());
            if (user == null) return NotFound(new { mensaje = "Usuario no encontrado." });

            if (!BCrypt.Net.BCrypt.Verify(request.PasswordActual, user.PassHash))
                return BadRequest(new { mensaje = "La contraseña actual es incorrecta." });

            user.PassHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordNueva);
            await _usuarioRepository.ActualizarAsync(user);

            return Ok(new { mensaje = "Contraseña actualizada correctamente." });
        }
    }
}
