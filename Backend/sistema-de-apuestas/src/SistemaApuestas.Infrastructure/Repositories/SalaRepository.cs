using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.Interfaces;
using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Betting;
using SistemaApuestas.Domain.Entities.Gaming;
using SistemaApuestas.Domain.Entities.Identity;
using SistemaApuestas.Infrastructure.Persistence;

namespace SistemaApuestas.Infrastructure.Repositories
{
    public class SalaRepository : ISalaRepository
    {
        private readonly ApplicationDbContext _context;

        public SalaRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Sala> ObtenerSalaPorIdAsync(int salaId)
        {
            return await _context.Salas
                .Include(s => s.Participantes) // 👈 ¡ESTO ES VITAL PARA QUE PUEDA CONTARLOS!
                .FirstOrDefaultAsync(s => s.SalaId == salaId && s.Activa);
        }

        public async Task<IEnumerable<Sala>> ObtenerTodasAsync()
        {
            return await _context.Salas
                .Where(s => s.Activa)
                .Include(s => s.Creador)              // Trae el nombre del creador
                .Include(s => s.Participantes)
                    .ThenInclude(p => p.Usuario)      // Trae los datos del jugador
                .Include(s => s.Participantes)
                    .ThenInclude(p => p.GameAccount)  // Trae los datos de Steam
                .ToListAsync();
        }

        public async Task<Sala?> ObtenerSalaConParticipantesAsync(int salaId) =>
            await _context.Salas
                .Include(s => s.Participantes)
                .ThenInclude(p => p.GameAccount) // Útil para la sugerencia del ganador
                .FirstOrDefaultAsync(s => s.SalaId == salaId && s.Activa);

        public async Task<Usuario?> ObtenerUsuarioPorIdAsync(int usuarioId) =>
            await _context.Usuarios.FindAsync(usuarioId);

         
        public async Task<SistemaApuestas.Domain.Entities.Gaming.GameAccount?> ObtenerGameAccountAsync(int gameAccountId, int usuarioId)
        {
            return await _context.GameAccounts.FirstOrDefaultAsync(ga => ga.GameAccountId == gameAccountId && ga.UsuarioId == usuarioId);
        }

        public async Task<Sala?> ObtenerSalaActivaPorCuentaJuegoAsync(int gameAccountId, int salaIdActual)
        {
            return await _context.ParticipanteSalas
                .Where(p => p.GameAccountId == gameAccountId && p.SalaId != salaIdActual)
                .Select(p => p.Sala)
                .Where(s => s.Activa && s.Estado != "FINALIZADA" && s.Estado != "CANCELADA" && s.Estado != "RECHAZADA")
                .OrderByDescending(s => s.FechaCreacion)
                .FirstOrDefaultAsync();
        }

        public async Task<List<ParticipanteSala>> ObtenerParticipantesConCuentasAsync(int salaId)
        {
            return await _context.ParticipanteSalas // o el nombre de tu DbSet, ej: _context.ParticipanteSalas
                .Include(p => p.GameAccount)        // Traemos la cuenta de juego unida al participante
                .Where(p => p.SalaId == salaId)
                .ToListAsync();
        }



        public async Task<bool> ExisteInscripcionAsync(int salaId, int usuarioId) =>
            await _context.ParticipanteSalas.AnyAsync(p => p.SalaId == salaId && p.UsuarioId == usuarioId);

        public async Task<Movimiento?> ObtenerReciboInscripcionAsync(int usuarioId, int salaId) =>
            await _context.Movimientos.FirstOrDefaultAsync(m => m.UsuarioId == usuarioId && m.Concepto == $"Inscripción a Sala {salaId}" && m.Tipo == "EGRESO");

        public async Task<ParticipanteSala?> ObtenerParticipanteAsync(int salaId, int usuarioId)
        {
            return await _context.ParticipanteSalas
                .FirstOrDefaultAsync(p => p.SalaId == salaId && p.UsuarioId == usuarioId);
        }

        public async Task EliminarParticipanteAsync(ParticipanteSala participante)
        {
            _context.ParticipanteSalas.Remove(participante);
            await Task.CompletedTask;
        }

        public async Task<Movimiento?> ObtenerMovimientoInscripcionAsync(int usuarioId, int salaId)
        {
            return await _context.Movimientos
                .Where(m =>
                    m.UsuarioId == usuarioId &&
                    m.Tipo == "EGRESO" &&
                    (
                        m.SalaId == salaId ||
                        m.Concepto.Contains($"Sala {salaId}")
                    )
                )
                .OrderByDescending(m => m.Fecha)
                .FirstOrDefaultAsync();
        }

        public async Task AgregarSalaAsync(Sala sala) => _context.Salas.Add(sala);

        public async Task AgregarParticipanteAsync(ParticipanteSala participante) => _context.ParticipanteSalas.Add(participante);

        public async Task AgregarMovimientoAsync(Movimiento movimiento) => _context.Movimientos.Add(movimiento);

        public async Task GuardarCambiosAsync() => await _context.SaveChangesAsync();

        
    }
}
