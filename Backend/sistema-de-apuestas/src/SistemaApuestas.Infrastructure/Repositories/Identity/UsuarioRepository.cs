using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Application.Repositories.Identity;
using SistemaApuestas.Domain.Entities.Identity;
using SistemaApuestas.Infrastructure.Persistence;

namespace SistemaApuestas.Infrastructure.Repositories.Identity
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly ApplicationDbContext _context;

        public UsuarioRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> ObtenerPorIdAsync(int id)
        {
            return await _context.Usuarios
                                 .FindAsync(id);
        }

        public async Task<Usuario?> ObtenerPorUsernameAsync(string username)
        {
            return await _context.Usuarios
                                 .FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<Usuario?> ObtenerPorEmailAsync(string email)
        {
            return await _context.Usuarios
                                 .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<Usuario>> GetUsersByClanAsync(int clanId)
        {
            return await _context.Usuarios
                                 .Where(u => u.ClanId == clanId)
                                 .AsNoTracking() // AsNoTracking mejora el rendimiento en consultas de solo lectura
                                 .ToListAsync();
        }

        public async Task<bool> ExistePorUsernameAsync(string username)
        {
            return await _context.Usuarios
                                 .AnyAsync(u => u.Username == username);
        }

        public async Task<bool> ExisteUsuarioOEmailAsync(string username, string email)
        {
            return await _context.Usuarios
                                 .AnyAsync(u => u.Username == username || u.Email == email);
        }

        public async Task AgregarAsync(Usuario usuario)
        {
            await _context.Usuarios.AddAsync(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Usuario usuario)
        {
            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
        }

        // Operación específica para evitar problemas de concurrencia en apuestas
        public async Task ActualizarSaldosAsync(int usuarioId, decimal variacionSaldoReal, decimal variacionSaldoBono)
        {
            var usuario = await _context.Usuarios.FindAsync(usuarioId);

            if (usuario != null)
            {
                usuario.SaldoReal += variacionSaldoReal;
                usuario.SaldoBono += variacionSaldoBono;

                // Entity Framework Core detectará el cambio y hará el UPDATE
                await _context.SaveChangesAsync();
            }
        }

        public async Task IncrementarPartidasJugadasAsync(int usuarioId)
        {
            var usuario = await _context.Usuarios.FindAsync(usuarioId);

            if (usuario != null)
            {
                usuario.PartidasJugadas += 1;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> EstaBaneadoAsync(int usuarioId)
        {
            // Aquí sí podemos usar _context porque estamos en la Infraestructura
            return await _context.Baneos.AnyAsync(b => b.UsuarioId == usuarioId);
        }

        public async Task<IEnumerable<Usuario>> BuscarPorUsernameOEmailAsync(string query, int limite = 20)
        {
            var usuarios = _context.Usuarios.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                var termino = query.Trim().ToLower();
                usuarios = usuarios.Where(u => u.Username.ToLower().Contains(termino) || u.Email.ToLower().Contains(termino));
            }

            return await usuarios
                .OrderByDescending(u => u.UsuarioId)
                .Take(limite)
                .ToListAsync();
        }

        public async Task AgregarBaneoAsync(Baneo baneo)
        {
            await _context.Baneos.AddAsync(baneo);
            await _context.SaveChangesAsync();
        }
    }
}