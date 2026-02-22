using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Infrastructure.Persistence;
using SistemaApuestas.Domain.Entities.Gaming; // Importamos tu entidad
using System.Security.Claims;
using System.Text.Json;

namespace SistemaApuestas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameAccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public GameAccountController(ApplicationDbContext context)
        {
            _context = context;
            _httpClient = new HttpClient(); // Motor para llamar a OpenDota y HenrikDev
        }

        [HttpPost("vincular")]
        [Authorize] // 🛡️ Solo usuarios logueados pueden vincular cuentas
        public async Task<IActionResult> VincularCuenta([FromBody] VincularCuentaDto request)
        {
            // 1. Identificar al jugador desde su token
            var usuarioIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(usuarioIdStr) || !int.TryParse(usuarioIdStr, out int usuarioId))
                return Unauthorized("Token inválido.");

            // 2. Verificar que no haya vinculado esta misma cuenta antes
            bool cuentaExiste = await _context.GameAccounts
                .AnyAsync(g => g.IdExterno == request.Identificador && g.Juego == request.Juego.ToUpper());

            if (cuentaExiste) return BadRequest("Esta cuenta de juego ya está registrada en el sistema.");

            string rangoObtenido = "UNRANKED";
            string nombreCuenta = request.Identificador;

            // 3. CONSULTAS A LAS APIS EXTERNAS (El Detective)
            if (request.Juego.ToUpper() == "VALORANT")
            {
                // HenrikDev API: Esperamos "Nombre#Tag"
                var partes = request.Identificador.Split('#');
                if (partes.Length != 2) return BadRequest("El formato de Valorant debe ser Nombre#Tag (ej: Thomas#LAN).");

                string urlValorant = $"https://api.henrikdev.xyz/valorant/v1/account/{partes[0]}/{partes[1]}";
                var response = await _httpClient.GetAsync(urlValorant);

                if (!response.IsSuccessStatusCode) return BadRequest("La cuenta de Valorant no existe o la API no responde.");

                var jsonString = await response.Content.ReadAsStringAsync();
                var datosValorant = JsonDocument.Parse(jsonString);

                // Extraemos el nombre real con su formato original
                var data = datosValorant.RootElement.GetProperty("data");
                string nombre = data.GetProperty("name").GetString() ?? partes[0];
                string tag = data.GetProperty("tag").GetString() ?? partes[1];

                nombreCuenta = $"{nombre}#{tag}";
            }
            else if (request.Juego.ToUpper() == "DOTA")
            {
                // OpenDota API: Esperamos el Steam32 Account ID
                string urlDota = $"https://api.opendota.com/api/players/{request.Identificador}";
                var response = await _httpClient.GetAsync(urlDota);

                if (!response.IsSuccessStatusCode) return BadRequest("La cuenta de Steam no existe en OpenDota.");

                var jsonString = await response.Content.ReadAsStringAsync();
                var datosDota = JsonDocument.Parse(jsonString);

                // Si la respuesta no tiene perfil, es privada
                if (!datosDota.RootElement.TryGetProperty("profile", out var perfil))
                    return BadRequest("La cuenta es privada o no ha jugado Dota 2.");

                nombreCuenta = perfil.GetProperty("personaname").GetString() ?? request.Identificador;

                // Extraer el rango (rank_tier)
                if (datosDota.RootElement.TryGetProperty("rank_tier", out var rankElement) && rankElement.ValueKind != JsonValueKind.Null)
                {
                    rangoObtenido = rankElement.GetInt32().ToString();
                }
            }
            else
            {
                return BadRequest("Juego no soportado. Usa 'VALORANT' o 'DOTA'.");
            }

            // 4. Guardar la cuenta en la Base de Datos
            var nuevaCuenta = new GameAccount
            {
                UsuarioId = usuarioId,
                Juego = request.Juego.ToUpper(),
                IdExterno = request.Identificador, // Ej: "123456789" o "Thomas#LAN"
                IdVisible = nombreCuenta, // Ej: "Dendi" o "Thomas#LAN"
                RangoActual = rangoObtenido,
                EsRangoManual = false, // Lo validó la API automáticamente
                FechaVinculacion = DateTime.UtcNow
            };

            _context.GameAccounts.Add(nuevaCuenta);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Cuenta verificada y vinculada exitosamente.",
                gameAccountId = nuevaCuenta.GameAccountId,
                nickname = nombreCuenta,
                rango = rangoObtenido
            });
        }
    }

    public class VincularCuentaDto
    {
        public string Juego { get; set; } = string.Empty; // "DOTA" o "VALORANT"
        public string Identificador { get; set; } = string.Empty; // Ej: "Thomas#LAN" o "123456789"
    }
}