using SistemaApuestas.Application.DTOs.Finanzas;

namespace SistemaApuestas.Application.Interfaces.Finanzas
{
    public interface IFinanzasService
    {
        Task<string> RecargarSaldoFisicoAsync(int adminId, RecargaAdminDto request);
        Task<string> SolicitarRetiroAsync(int usuarioId, RetiroSolicitudDto request);
        Task<string> TomarRetiroAsync(int adminId, int retiroId);
        Task<string> CompletarRetiroAsync(int adminId, int retiroId);
    }
}