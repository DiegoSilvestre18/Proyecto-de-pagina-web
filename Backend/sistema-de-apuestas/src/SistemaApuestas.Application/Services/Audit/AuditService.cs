using SistemaApuestas.Application.Interfaces.Audit;
using SistemaApuestas.Application.Repositories.Audit;
using SistemaApuestas.Application.DTOs.Audit;
using SistemaApuestas.Domain.Entities.Audit;
using System.Text.Json;

namespace SistemaApuestas.Application.Services.Audit
{
    public class AuditService : IAuditService
    {
        private readonly IMovimientoRepository _movimientoRepo;
        //private readonly ILogAccionesRepository _logRepo;

        public AuditService(
            IMovimientoRepository movimientoRepo)
        {
            _movimientoRepo = movimientoRepo;
        }

        public async Task RegistrarMovimientoAsync(MovimientoDto request)
        {
            var movimiento = new Movimiento
            {
                UsuarioId = request.UsuarioId,
                RecargaId = request.RecargaId,
                RetiroId = request.RetiroId,
                SalaId = request.SalaId,
                Tipo = request.Tipo.ToUpper(), // "INGRESO" o "EGRESO"
                MontoReal = request.MontoReal,
                MontoBono = request.MontoBono,
                Concepto = request.Concepto,
                Fecha = DateTime.UtcNow
            };

            await _movimientoRepo.AgregarAsync(movimiento);
        }

        //public async Task RegistrarLogAsync(int usuarioId, string accion, object detalle)
        //{
        //    // Convertimos el objeto C# a un string JSON para guardarlo en la columna JSONB
        //    string jsonDetalle = JsonSerializer.Serialize(detalle);

        //    var log = new LogAccion
        //    {
        //        UsuarioId = usuarioId,
        //        Accion = accion,
        //        Detalle = jsonDetalle,
        //        Fecha = DateTime.UtcNow
        //    };

        //    await _logRepo.AgregarAsync(log);
        //}

        public async Task<IEnumerable<MovimientoDto>> ObtenerHistorialMovimientosAsync(int usuarioId)
        {
            var movimientos = await _movimientoRepo.ObtenerPorUsuarioAsync(usuarioId);

            // Mapeo manual a DTO (o puedes usar AutoMapper)
            return movimientos.Select(m => new MovimientoDto
            {
                Tipo = m.Tipo,
                MontoReal = m.MontoReal,
                MontoBono = m.MontoBono,
                Concepto = m.Concepto
            });
        }

        //public async Task<IEnumerable<LogResponseDto>> ObtenerLogsUsuarioAsync(int usuarioId)
        //{
        //    var logs = await _logRepo.ObtenerPorUsuarioAsync(usuarioId);

        //    return logs.Select(l => new LogResponseDto
        //    {
        //        LogId = l.LogId,
        //        Accion = l.Accion,
        //        Detalle = l.Detalle,
        //        Fecha = l.Fecha
        //    }).OrderByDescending(l => l.Fecha);
        //}

        // Método privado para decirle al Front-End de dónde vino este movimiento
        private string GenerarReferencia(Movimiento m)
        {
            if (m.RecargaId.HasValue) return $"Recarga #{m.RecargaId}";
            if (m.RetiroId.HasValue) return $"Retiro #{m.RetiroId}";
            if (m.SalaId.HasValue) return $"Partida en Sala #{m.SalaId}";
            return "Operación Manual / Bono";
        }
    }
}
