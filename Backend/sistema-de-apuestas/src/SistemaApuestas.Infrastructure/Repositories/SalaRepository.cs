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

        public async Task<Sala?> ObtenerSalaPorIdAsync(int salaId) =>
            await _context.Salas.FindAsync(salaId);

        public async Task<Sala?> ObtenerSalaConParticipantesAsync(int salaId) =>
            await _context.Salas
                .Include(s => s.Participantes)
                .ThenInclude(p => p.GameAccount) // Útil para la sugerencia del ganador
                .FirstOrDefaultAsync(s => s.SalaId == salaId);

        public async Task<Usuario?> ObtenerUsuarioPorIdAsync(int usuarioId) =>
            await _context.Usuarios.FindAsync(usuarioId);

         
        public async Task<SistemaApuestas.Domain.Entities.Gaming.GameAccount?> ObtenerGameAccountAsync(int gameAccountId, int usuarioId)
        {
            return await _context.GameAccounts.FirstOrDefaultAsync(ga => ga.GameAccountId == gameAccountId && ga.UsuarioId == usuarioId);
        }

        public async Task<bool> ExisteInscripcionAsync(int salaId, int usuarioId) =>
            await _context.ParticipanteSalas.AnyAsync(p => p.SalaId == salaId && p.UsuarioId == usuarioId);

        public async Task<Movimiento?> ObtenerReciboInscripcionAsync(int usuarioId, int salaId) =>
            await _context.Movimientos.FirstOrDefaultAsync(m => m.UsuarioId == usuarioId && m.Concepto == $"Inscripción a Sala {salaId}" && m.Tipo == "EGRESO");

        public async Task AgregarSalaAsync(Sala sala) => _context.Salas.Add(sala);

        public async Task AgregarParticipanteAsync(ParticipanteSala participante) => _context.ParticipanteSalas.Add(participante);

        public async Task AgregarMovimientoAsync(Movimiento movimiento) => _context.Movimientos.Add(movimiento);

        public async Task GuardarCambiosAsync() => await _context.SaveChangesAsync();
    }
}