using SistemaApuestas.Application.DTOs.GameAccount;

namespace SistemaApuestas.Application.Interfaces.GameAccount
{
    public interface IGameAccountService
    {
        Task<string> VincularCuentaAsync(int usuarioId, VincularCuentaDto request);

        // ¡Aquí pegamos la línea mágica que el controlador estaba buscando!
        Task<string> SincronizarRangoAsync(int usuarioId, SincronizarCuentaDto request);
    }
}