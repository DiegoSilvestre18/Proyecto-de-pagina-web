// ¡Mira! Ya no hay using a Infrastructure ni a Entity Framework
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SistemaApuestas.Application.DTOs.Auth;
using SistemaApuestas.Application.Interfaces;
using SistemaApuestas.Application.Interfaces.Auth;
using SistemaApuestas.Domain.Entities.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SistemaApuestas.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository; // Usamos la interfaz
        private readonly IConfiguration _config;

        // Constructor que recibe la interfaz
        public AuthService(IUsuarioRepository usuarioRepository, IConfiguration config)
        {
            _usuarioRepository = usuarioRepository;
            _config = config;
        }

        public async Task<string> RegisterAsync(RegisterDto request)
        {
            // La capa de aplicación llama a la interfaz, no sabe si es SQL o NoSQL
            if (await _usuarioRepository.ExisteUsuarioOEmailAsync(request.Username, request.Email))
            {
                throw new Exception("El usuario o correo ya está en uso.");
            }

            var nuevoUsuario = new Usuario
            {
                Username = request.Username,
                Email = request.Email,
                PassHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Rol = "USER",
                // ... (los demás campos en 0)
            };

            await _usuarioRepository.AgregarAsync(nuevoUsuario);

            return "Usuario registrado exitosamente.";
        }

        public async Task<string> LoginAsync(LoginDto request)
        {
            var user = await _usuarioRepository.ObtenerPorUsernameAsync(request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PassHash))
            {
                throw new Exception("Usuario o contraseña incorrectos.");
            }

            return GenerarJwt(user);
        }

        private string GenerarJwt(Usuario user)
        {
            // OJO: Esto asume que tienes estas variables configuradas en tu appsettings.json
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
                expires: DateTime.Now.AddHours(4),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}