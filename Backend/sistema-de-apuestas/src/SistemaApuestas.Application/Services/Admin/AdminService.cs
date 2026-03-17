using SistemaApuestas.Application.DTOs.Admin;
using SistemaApuestas.Application.Interfaces.Admin;
using SistemaApuestas.Application.Repositories.GameAccount;
using SistemaApuestas.Application.Repositories.Identity;
using SistemaApuestas.Domain.Entities.Identity;

namespace SistemaApuestas.Application.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IGameAccountRepository _gameAccountRepository;

        public AdminService(IUsuarioRepository usuarioRepository, IGameAccountRepository gameAccountRepository)
        {
            _usuarioRepository = usuarioRepository;
            _gameAccountRepository = gameAccountRepository;
        }

        public async Task<IReadOnlyList<AdminUserSearchDto>> BuscarUsuariosAsync(string query)
        {
            var usuarios = await _usuarioRepository.BuscarPorUsernameOEmailAsync(query, 20);
            var resultado = new List<AdminUserSearchDto>();

            foreach (var usuario in usuarios)
            {
                var cuentas = await _gameAccountRepository.ObtenerCuentasPorUsuarioAsync(usuario.UsuarioId);
                var cuentaDota = cuentas.FirstOrDefault(c => c.Juego == "DOTA" || c.Juego == "DOTA2");
                var cuentaValorant = cuentas.FirstOrDefault(c => c.Juego == "VALORANT");

                resultado.Add(new AdminUserSearchDto
                {
                    Id = usuario.UsuarioId,
                    Username = usuario.Username,
                    Email = usuario.Email,
                    Estado = "ACTIVO",
                    RangoDota = cuentaDota?.RangoActual ?? "N/A",
                    RangoValorant = cuentaValorant?.RangoActual ?? "N/A"
                });
            }

            return resultado;
        }

        public async Task<string> ForzarMmrAsync(int usuarioId, string juego, string nuevoMmr)
        {
            var juegoNormalizado = (juego ?? string.Empty).Trim().ToUpper();
            if (string.IsNullOrWhiteSpace(juegoNormalizado) || string.IsNullOrWhiteSpace(nuevoMmr))
            {
                throw new Exception("Juego y nuevo MMR son obligatorios.");
            }

            var cuenta = await _gameAccountRepository.ObtenerPorUsuarioYJuegoAsync(usuarioId, juegoNormalizado);
            if (cuenta == null && juegoNormalizado == "DOTA")
            {
                cuenta = await _gameAccountRepository.ObtenerPorUsuarioYJuegoAsync(usuarioId, "DOTA2");
            }

            if (cuenta == null)
            {
                throw new Exception($"El usuario no tiene una cuenta vinculada de {juegoNormalizado}.");
            }

            cuenta.RangoActual = nuevoMmr.Trim();
            cuenta.EsRangoManual = true;
            await _gameAccountRepository.ActualizarAsync(cuenta);

            return $"MMR forzado a {cuenta.RangoActual}.";
        }

        public async Task<string> BanearUsuarioAsync(int usuarioId, int adminId)
        {
            var usuario = await _usuarioRepository.ObtenerPorIdAsync(usuarioId);
            if (usuario == null)
            {
                throw new Exception("Usuario no encontrado.");
            }

            var nuevoBaneo = new Baneo
            {
                UsuarioId = usuarioId,
                AdminId = adminId,
                Motivo = "Baneado desde el Panel de Administración",
                Tiempo = 9999,
                FechaBaneo = DateTime.UtcNow
            };

            await _usuarioRepository.AgregarBaneoAsync(nuevoBaneo);
            return $"El usuario {usuario.Username} ha sido baneado permanentemente.";
        }
    }
}
