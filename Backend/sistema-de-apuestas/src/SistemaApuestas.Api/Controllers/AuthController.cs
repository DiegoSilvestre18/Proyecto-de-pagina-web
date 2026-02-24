using Microsoft.AspNetCore.Mvc;
using SistemaApuestas.Application.DTOs.Auth.LogIn;
using SistemaApuestas.Application.DTOs.Auth.Regiser;
using SistemaApuestas.Application.Interfaces.Auth;

namespace SistemaApuestas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            try
            {
                var mensaje = await _authService.RegisterAsync(request);
                return Ok(new { mensaje });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                return Ok(new { response });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { mensaje = ex.Message });
            }
        }
    }
}