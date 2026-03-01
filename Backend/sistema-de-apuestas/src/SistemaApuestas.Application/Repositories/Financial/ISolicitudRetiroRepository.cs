using SistemaApuestas.Application.DTOs.Financial.Request;
using SistemaApuestas.Application.DTOs.Financial.Response;
using SistemaApuestas.Domain.Entities.Financial;


namespace SistemaApuestas.Application.Repositories.Financial
{
    public interface ISolicitudRetiroRepository
    {
        Task AgregarAsync(SolicitudRetiro retiro);
        Task<SolicitudRetiro?> ObtenerPorIdAsync(int id);
        Task ActualizarAsync(SolicitudRetiro retiro);
        Task<IEnumerable<SolicitudPendienteAdminDto>> ObtenerPendientesConUsuarioAsync();

        /// Intenta asignar atómicamente una solicitud a un admin.
        /// Retorna true si la solicitud fue tomada, false si otro admin ya la tomó.
        Task<bool> TomarSolicitudAsync(int solicitudId, int adminId);

        /// Libera una solicitud que un admin tenía tomada (la devuelve a PENDIENTE).
        Task<bool> LiberarSolicitudAsync(int solicitudId, int adminId);

        /// Verifica si el usuario ya tiene un retiro PENDIENTE o EN_PROCESO.
        Task<bool> TieneRetiroActivoAsync(int usuarioId);
    }
}
