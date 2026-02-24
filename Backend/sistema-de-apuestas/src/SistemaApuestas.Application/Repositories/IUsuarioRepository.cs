using SistemaApuestas.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.Repositories
{
    public interface IUsuarioRepository
    {
        Task<bool> ExisteUsuarioOEmailAsync(string username, string email);
        Task<Usuario?> ObtenerPorUsernameAsync(string username);
        Task<Usuario?> ObtenerPorIdAsync(int id);
        Task AgregarAsync(Usuario usuario);
    }
}
