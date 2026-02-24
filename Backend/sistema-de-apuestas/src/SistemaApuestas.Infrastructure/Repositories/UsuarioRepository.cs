using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.Repositories;
using SistemaApuestas.Domain.Entities.Identity;
using SistemaApuestas.Infrastructure.Persistence;

namespace SistemaApuestas.Infrastructure.Repositories
{
    // Esta clase implementa la interfaz de Application y usa el DbContext de Infrastructure
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly ApplicationDbContext _context;

        public UsuarioRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExisteUsuarioOEmailAsync(string username, string email)
        {
            return await _context.Usuarios.AnyAsync(u => u.Username == username || u.Email == email);
        }

        public async Task<Usuario?> ObtenerPorUsernameAsync(string username)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<Usuario?> ObtenerPorIdAsync(int id)
        {
            return await _context.Usuarios.FindAsync(id);
        }

        public async Task AgregarAsync(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
        }
    }
}