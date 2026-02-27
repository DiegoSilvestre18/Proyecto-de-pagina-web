using SistemaApuestas.Application.DTOs.Financial.Request;
using SistemaApuestas.Application.DTOs.Financial.Response;

namespace SistemaApuestas.Application.Interfaces.Financial
{
    public interface IFinancialService
    {
        // Acciones del Usuario (el ID se pasa por separado porque viene del Token)
        Task<SolicitudResponseDto> SolicitarRetiroAsync(int usuarioId, SolicitudRetiroDto request);
        Task<SolicitudResponseDto> SolicitarRecargaAsync(int usuarioId, SolicitudRecargaDto request);

        // Acciones del Admin
        Task<IEnumerable<SolicitudPendienteAdminDto>> ObtenerSolicitudesPendientesAsync();
        Task<SolicitudResponseDto> TomarSolicitudAsync(int adminId, int solicitudId, string tipo);
        Task<SolicitudResponseDto> LiberarSolicitudAsync(int adminId, int solicitudId, string tipo);
        Task<SolicitudResponseDto> ProcesarRetiroAsync(int adminId, ProcesarSolicitudDto request);
        Task<SolicitudResponseDto> ProcesarRecargaAsync(int adminId, ProcesarSolicitudDto request);
    }
}
