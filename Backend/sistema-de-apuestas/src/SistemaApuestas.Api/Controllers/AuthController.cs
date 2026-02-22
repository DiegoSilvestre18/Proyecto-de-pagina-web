using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SistemaApuestas.Domain.Entities.Identity; // Importa tu entidad Usuario
using SistemaApuestas.Infrastructure.Persistence;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace SistemaApuestas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            // 1. Validar que no exista el username o correo
            if (await _context.Usuarios.AnyAsync(u => u.Username == request.Username || u.Email == request.Email))
                return BadRequest("El usuario o correo ya está en uso.");

            // 2. Crear el usuario encriptando la contraseña
            var nuevoUsuario = new Usuario
            {
                Username = request.Username,
                Email = request.Email,
                PassHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Rol = "USER", // Rol por defecto
                SaldoReal = 0,
                SaldoBono = 0,
                PartidasJugadas = 0,
                FechaRegistro = DateTime.UtcNow
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario registrado exitosamente. Ya puedes iniciar sesión." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            // 1. Buscar al usuario
            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Username == request.Username);

            // 2. Verificar que exista y que la contraseña coincida con el Hash
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PassHash))
                return Unauthorized("Usuario o contraseña incorrectos.");

            // 3. Generar el Token
            var token = GenerarJwt(user);
            return Ok(new { token, rol = user.Rol, username = user.Username });
        }

        [HttpGet("perfil")]
        [Authorize] // Este candado exige que envíen un Token válido
        public async Task<IActionResult> VerPerfil()
        {
            // 1. El servidor lee el token automáticamente y saca el ID del jugador
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
                return Unauthorized("Token inválido.");

            // 2. Buscamos al jugador en la base de datos usando ese ID
            var user = await _context.Usuarios.FindAsync(userId);
            if (user == null) return NotFound("Usuario no encontrado.");

            // 3. Devolvemos su información (¡Ocultando la contraseña por seguridad!)
            return Ok(new
            {
                usuarioId = user.UsuarioId,
                username = user.Username,
                email = user.Email,
                saldoReal = user.SaldoReal,
                saldoBono = user.SaldoBono,
                rol = user.Rol
            });
        }

        private string GenerarJwt(Usuario user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UsuarioId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Rol ?? "USER")
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(4), // El token dura 4 horas
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // --- CLASES AUXILIARES PARA RECIBIR DATOS (DTOs) ---
    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}