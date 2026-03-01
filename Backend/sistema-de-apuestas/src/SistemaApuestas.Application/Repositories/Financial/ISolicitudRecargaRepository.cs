using SistemaApuestas.Application.DTOs.Financial.Request;
using SistemaApuestas.Application.DTOs.Financial.Response;
using SistemaApuestas.Domain.Entities.Financial;

namespace SistemaApuestas.Application.Repositories.Financial
{
    public interface ISolicitudRecargaRepository
    {
        Task AgregarAsync(SolicitudRecarga recarga);
        Task<SolicitudRecarga?> ObtenerPorIdAsync(int id);
        Task ActualizarAsync(SolicitudRecarga recarga);
        Task<IEnumerable<SolicitudPendienteAdminDto>> ObtenerPendientesConUsuarioAsync();

        /// Intenta asignar atómicamente una solicitud a un admin.
        /// Retorna true si la solicitud fue tomada, false si otro admin ya la tomó.
        Task<bool> TomarSolicitudAsync(int solicitudId, int adminId);

        /// Libera una solicitud que un admin tenía tomada (la devuelve a PENDIENTE).
        Task<bool> LiberarSolicitudAsync(int solicitudId, int adminId);
    }
}
