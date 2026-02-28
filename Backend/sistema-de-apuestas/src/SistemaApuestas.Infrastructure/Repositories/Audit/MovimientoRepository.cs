using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.Repositories.Audit;
using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Infrastructure.Persistence;


namespace SistemaApuestas.Infrastructure.Repositories.Audit
{
    public class MovimientoRepository : IMovimientoRepository
    {
        private readonly ApplicationDbContext _context;

        public MovimientoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(Movimiento movimiento)
        {
            // Agrega el nuevo registro a la memoria del DbContext
            await _context.Set<Movimiento>().AddAsync(movimiento);

            // Ejecuta el INSERT INTO MOVIMIENTOS ... en la base de datos
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Movimiento>> ObtenerPorUsuarioAsync(int usuarioId)
        {
            return await _context.Set<Movimiento>()
                                 .Where(m => m.UsuarioId == usuarioId)
                                 .OrderByDescending(m => m.Fecha) // Ordenados del más reciente al más antiguo
                                 .AsNoTracking() // CRÍTICO: Le dice a EF Core que no rastree estos objetos porque no los vamos a modificar. Ahorra mucha memoria RAM.
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Movimiento>> ObtenerUltimosMovimientosAsync(int cantidad)
        {
            return await _context.Set<Movimiento>()
                                 .OrderByDescending(m => m.Fecha)
                                 .Take(cantidad) // Traduce a un LIMIT {cantidad} en SQL
                                 .AsNoTracking()
                                 .ToListAsync();
        }
    }
