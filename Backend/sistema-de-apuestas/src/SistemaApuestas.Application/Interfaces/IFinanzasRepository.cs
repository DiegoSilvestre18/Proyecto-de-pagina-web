using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Financial;
using SistemaApuestas.Domain.Entities.Identity; // Ajusta si tu Usuario está en otra ruta

namespace SistemaApuestas.Application.Interfaces
{
    public interface IFinanzasRepository
    {
        Task<Usuario?> ObtenerUsuarioPorIdAsync(int usuarioId);
        Task<decimal> SumarRetirosPendientesAsync(int usuarioId);
        Task<SolicitudRetiro?> ObtenerRetiroConUsuarioAsync(int retiroId);

        Task AgregarSolicitudRecargaAsync(SolicitudRecarga recarga);
        Task AgregarMovimientoAsync(Movimiento movimiento);
        Task AgregarSolicitudRetiroAsync(SolicitudRetiro retiro);

        Task GuardarCambiosAsync(); // Para los Updates
    }
}