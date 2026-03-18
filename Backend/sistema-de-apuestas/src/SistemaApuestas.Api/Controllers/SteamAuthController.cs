using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SistemaApuestas.Application.Interfaces.GameAccount;
using SistemaApuestas.Application.DTOs.GameAccount;

namespace SistemaApuestas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SteamAuthController : ControllerBase
    {
        private readonly IGameAccountService _gameAccountService;
        private readonly IConfiguration _config;

        private string FrontendIntegracionesUrl(string query)
        {
            var baseUrl = _config["Frontend:BaseUrl"] ?? "https://localhost:7137";
            return $"{baseUrl.TrimEnd('/')}/main/settings/integraciones?{query}";
        }

        public SteamAuthController(IGameAccountService gameAccountService, IConfiguration config)
        {
            _gameAccountService = gameAccountService;
            _config = config;
        }

        // React llama con: window.location.href = `${API_URL}/api/steamauth/vincular-dota?token=${jwt}`
        // NO usa [Authorize] porque el navegador no puede enviar headers en una redirección
        [HttpGet("vincular-dota")]
        public IActionResult VincularDota([FromQuery] string token)
        {
            int usuarioId;
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                }, out _);

                var idClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(idClaim, out usuarioId))
                    return Redirect(FrontendIntegracionesUrl("error=token_invalido"));
            }
            catch
            {
                return Redirect(FrontendIntegracionesUrl("error=token_invalido"));
            }

            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("SteamCallback"),
                Items = { { "usuarioId", usuarioId.ToString() } }
            };

            return Challenge(properties, "Steam");
        }

        // Callback de Steam — NO lleva [Authorize] porque viene del middleware OpenID
        [HttpGet("callback")]
        public async Task<IActionResult> SteamCallback()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!result.Succeeded)
                return Redirect(FrontendIntegracionesUrl("error=autenticacion_fallida"));

            result.Properties!.Items.TryGetValue("usuarioId", out string? usuarioIdStr);
            if (!int.TryParse(usuarioIdStr, out int usuarioId))
                return Redirect(FrontendIntegracionesUrl("error=usuario_invalido"));

            var claim = result.Principal!.FindFirst(ClaimTypes.NameIdentifier);
            string steam64Url = claim!.Value;
            string steam64IdString = steam64Url.Split('/').Last();

            long steam64Id = long.Parse(steam64IdString);
            long steam32Id = steam64Id - 76561197960265728;

            var dto = new VincularCuentaDto
            {
                Juego = "DOTA",
                Identificador = steam32Id.ToString()
            };

            try
            {
                await _gameAccountService.VincularCuentaAsync(usuarioId, dto);
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Redirect(FrontendIntegracionesUrl("vinculacion=exito"));
            }
            catch (Exception ex)
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Redirect(FrontendIntegracionesUrl($"error={Uri.EscapeDataString(ex.Message)}"));
            }
        }
    }
}