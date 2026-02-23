using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.Interfaces;
using SistemaApuestas.Domain.Entities;
using SistemaApuestas.Domain.Entities.Gaming;
using SistemaApuestas.Infrastructure.Persistence;

namespace SistemaApuestas.Infrastructure.Repositories
{
    public class GameAccountRepository : IGameAccountRepository
    {
        private readonly ApplicationDbContext _context;

        public GameAccountRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> UsuarioYaTieneCuentaAsync(int usuarioId, string juego)
        {
            // Busca si ya tiene una cuenta para ESE juego específico
            return await _context.GameAccounts
                .AnyAsync(ga => ga.UsuarioId == usuarioId && ga.Juego == juego);
        }

        public async Task AgregarAsync(GameAccount gameAccount)
        {
            _context.GameAccounts.Add(gameAccount);
            await _context.SaveChangesAsync();
        }

        public async Task<SistemaApuestas.Domain.Entities.Gaming.GameAccount?> ObtenerPorUsuarioYJuegoAsync(int usuarioId, string juego)
        {
            return await _context.GameAccounts
                .FirstOrDefaultAsync(ga => ga.UsuarioId == usuarioId && ga.Juego == juego);
        }

        public async Task ActualizarAsync(SistemaApuestas.Domain.Entities.Gaming.GameAccount gameAccount)
        {
            _context.GameAccounts.Update(gameAccount);
            await _context.SaveChangesAsync();
        }
    }
}