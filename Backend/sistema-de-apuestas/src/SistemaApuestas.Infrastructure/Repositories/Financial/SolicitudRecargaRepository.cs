using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.DTOs.Financial.Response;
using SistemaApuestas.Application.Repositories.Financial;
using SistemaApuestas.Domain.Entities.Financial;
using SistemaApuestas.Infrastructure.Persistence;

namespace SistemaApuestas.Infrastructure.Repositories.Financial
{
    public class SolicitudRecargaRepository : ISolicitudRecargaRepository
    {
        private readonly ApplicationDbContext _context;

        public SolicitudRecargaRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(SolicitudRecarga recarga)
        {
            _context.SolicitudesRecarga.Add(recarga);
            await _context.SaveChangesAsync();
        }

        public async Task<SolicitudRecarga?> ObtenerPorIdAsync(int id)
        {
            return await _context.SolicitudesRecarga.FindAsync(id);
        }

        public async Task ActualizarAsync(SolicitudRecarga recarga)
        {
            _context.SolicitudesRecarga.Update(recarga);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<SolicitudPendienteAdminDto>> ObtenerPendientesConUsuarioAsync()
        {
            return await _context.SolicitudesRecarga
                .Where(r => r.Estado == "PENDIENTE" && r.AdminAtendiendoId == null)
                .Join(
                    _context.Usuarios,
                    r => r.UsuarioId,
                    u => u.UsuarioId,
                    (r, u) => new SolicitudPendienteAdminDto
                    {
                        SolicitudId = r.RecargaId,
                        Tipo = "RECARGA",
                        Monto = r.Monto,
                        Moneda = r.Moneda ?? "PEN",
                        Metodo = r.Metodo ?? "",
                        CuentaDestino = "",
                        FechaEmision = r.FechaEmision,
                        UsuarioId = u.UsuarioId,
                        Username = u.Username,
                        Telefono = u.Telefono,
                        Email = u.Email
                    })
                .OrderBy(r => r.FechaEmision)
                .ToListAsync();
        }

        public async Task<bool> TomarSolicitudAsync(int solicitudId, int adminId)
        {
            // UPDATE atómico: solo cambia si admin_atendiendo_id sigue siendo NULL
            var filasAfectadas = await _context.SolicitudesRecarga
                .Where(r => r.RecargaId == solicitudId
                         && r.AdminAtendiendoId == null
                         && r.Estado == "PENDIENTE")
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(r => r.AdminAtendiendoId, adminId)
                    .SetProperty(r => r.Estado, "EN_PROCESO"));

            return filasAfectadas > 0;
        }

        public async Task<bool> LiberarSolicitudAsync(int solicitudId, int adminId)
        {
            // Solo el admin que la tomó puede liberarla
            var filasAfectadas = await _context.SolicitudesRecarga
                .Where(r => r.RecargaId == solicitudId
                         && r.AdminAtendiendoId == adminId
                         && r.Estado == "EN_PROCESO")
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(r => r.AdminAtendiendoId, (int?)null)
                    .SetProperty(r => r.Estado, "PENDIENTE"));

            return filasAfectadas > 0;
        }
    }
}
