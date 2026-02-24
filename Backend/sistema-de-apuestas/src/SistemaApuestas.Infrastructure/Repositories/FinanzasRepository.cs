using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.Interfaces;
using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Financial;
using SistemaApuestas.Domain.Entities.Identity;
using SistemaApuestas.Infrastructure.Persistence;

namespace SistemaApuestas.Infrastructure.Repositories
{
    public class FinanzasRepository : IFinanzasRepository
    {
        private readonly ApplicationDbContext _context;

        public FinanzasRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> ObtenerUsuarioPorIdAsync(int usuarioId)
        {
            return await _context.Usuarios.FindAsync(usuarioId);
        }

        public async Task<decimal> SumarRetirosPendientesAsync(int usuarioId)
        {
            return await _context.SolicitudesRetiro
                .Where(r => r.UsuarioId == usuarioId && (r.Estado == "PENDIENTE" || r.Estado == "EN_PROCESO"))
                .SumAsync(r => r.Monto);
        }

        public async Task<SolicitudRetiro?> ObtenerRetiroConUsuarioAsync(int retiroId)
        {
            return await _context.SolicitudesRetiro
                .Include(r => r.Usuario)
                .FirstOrDefaultAsync(r => r.RetiroId == retiroId);
        }

        public async Task AgregarSolicitudRecargaAsync(SolicitudRecarga recarga)
        {
            _context.SolicitudesRecarga.Add(recarga);
        }

        public async Task AgregarMovimientoAsync(Movimiento movimiento)
        {
            _context.Movimientos.Add(movimiento);
        }

        public async Task AgregarSolicitudRetiroAsync(SolicitudRetiro retiro)
        {
            _context.SolicitudesRetiro.Add(retiro);
        }

        public async Task GuardarCambiosAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}