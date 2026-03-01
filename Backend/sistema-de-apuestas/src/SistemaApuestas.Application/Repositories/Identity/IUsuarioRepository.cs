using SistemaApuestas.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.Repositories.Identity
{
    public interface IUsuarioRepository
    {
        // Lectura (Read)
        Task<Usuario?> ObtenerPorIdAsync(int id);
        Task<Usuario?> ObtenerPorUsernameAsync(string username);
        Task<Usuario?> ObtenerPorEmailAsync(string email);
        Task<IEnumerable<Usuario>> GetUsersByClanAsync(int clanId);

        // Validaciones (Útiles para el registro)
        Task<bool> ExistePorUsernameAsync(string username);
        Task<bool> ExisteUsuarioOEmailAsync(string username, string email);

        // Escritura (Write)
        Task AgregarAsync(Usuario usuario);
        Task ActualizarAsync(Usuario usuario);

        // Lógica de Negocio (Operaciones atómicas para apuestas)
        Task ActualizarSaldosAsync(int usuarioId, decimal variacionSaldoReal, decimal variacionSaldoBono);
        Task IncrementarPartidasJugadasAsync(int usuarioId);
    }
}
