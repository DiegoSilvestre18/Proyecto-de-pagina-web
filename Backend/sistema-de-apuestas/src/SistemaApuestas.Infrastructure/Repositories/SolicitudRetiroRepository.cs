using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.DTOs.Financial.Response;
using SistemaApuestas.Application.Repositories.Financial;
using SistemaApuestas.Domain.Entities.Financial;
using SistemaApuestas.Infrastructure.Persistence;

namespace SistemaApuestas.Infrastructure.Repositories
{
    public class SolicitudRetiroRepository : ISolicitudRetiroRepository
    {
        private readonly ApplicationDbContext _context;

        public SolicitudRetiroRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(SolicitudRetiro retiro)
        {
            _context.SolicitudesRetiro.Add(retiro);
            await _context.SaveChangesAsync();
        }

        public async Task<SolicitudRetiro?> ObtenerPorIdAsync(int id)
        {
            return await _context.SolicitudesRetiro.FindAsync(id);
        }

        public async Task ActualizarAsync(SolicitudRetiro retiro)
        {
            _context.SolicitudesRetiro.Update(retiro);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<SolicitudPendienteAdminDto>> ObtenerPendientesConUsuarioAsync()
        {
            return await _context.SolicitudesRetiro
                .Where(r => r.Estado == "PENDIENTE" && r.AdminAtendiendoId == null)
                .Join(
                    _context.Usuarios,
                    r => r.UsuarioId,
                    u => u.UsuarioId,
                    (r, u) => new SolicitudPendienteAdminDto
                    {
                        SolicitudId = r.RetiroId,
                        Tipo = "RETIRO",
                        Monto = r.Monto,
                        Moneda = r.Moneda ?? "PEN",
                        Metodo = r.Metodo,
                        FechaEmision = r.FechaEmision,
                        UsuarioId = u.UsuarioId,
                        Username = u.Username,
                        Email = u.Email
                    })
                .OrderBy(r => r.FechaEmision)
                .ToListAsync();
        }

        public async Task<bool> TomarSolicitudAsync(int solicitudId, int adminId)
        {
            var filasAfectadas = await _context.SolicitudesRetiro
                .Where(r => r.RetiroId == solicitudId
                         && r.AdminAtendiendoId == null
                         && r.Estado == "PENDIENTE")
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(r => r.AdminAtendiendoId, adminId)
                    .SetProperty(r => r.Estado, "EN_PROCESO"));

            return filasAfectadas > 0;
        }

        public async Task<bool> LiberarSolicitudAsync(int solicitudId, int adminId)
        {
            var filasAfectadas = await _context.SolicitudesRetiro
                .Where(r => r.RetiroId == solicitudId
                         && r.AdminAtendiendoId == adminId
                         && r.Estado == "EN_PROCESO")
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(r => r.AdminAtendiendoId, (int?)null)
                    .SetProperty(r => r.Estado, "PENDIENTE"));

            return filasAfectadas > 0;
        }
    }
}
