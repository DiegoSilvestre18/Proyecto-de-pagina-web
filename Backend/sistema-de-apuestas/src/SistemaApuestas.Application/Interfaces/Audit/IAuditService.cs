using SistemaApuestas.Application.DTOs.Audit;

namespace SistemaApuestas.Application.Interfaces.Audit
{
    public interface IAuditService
    {
        // Escritura (Generalmente llamados por otros servicios, no directamente por controladores)
        Task RegistrarMovimientoAsync(MovimientoDto request);
        //Task RegistrarLogAsync(int usuarioId, string accion, object detalle);

        // Lectura (Para el historial del jugador o panel del admin)
        Task<IEnumerable<MovimientoDto>> ObtenerHistorialMovimientosAsync(int usuarioId);
        //Task<IEnumerable<LogResponseDto> ObtenerLogsUsuarioAsync(int usuarioId);
    }
}
