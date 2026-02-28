using SistemaApuestas.Domain.Entities.Audit;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.Repositories.Audit
{
    public interface IMovimientoRepository
    {
        // ESCRITURA: El único método que altera la base de datos
        Task AgregarAsync(Movimiento movimiento);

        // LECTURA: Para el historial del jugador
        Task<IEnumerable<Movimiento>> ObtenerPorUsuarioAsync(int usuarioId);

        // LECTURA: Para un panel de control del Administrador (ej. ver los últimos 50 movimientos globales)
        Task<IEnumerable<Movimiento>> ObtenerUltimosMovimientosAsync(int cantidad);
    }
}
