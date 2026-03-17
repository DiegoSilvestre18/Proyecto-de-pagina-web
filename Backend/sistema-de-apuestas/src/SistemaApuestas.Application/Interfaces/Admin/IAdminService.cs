using SistemaApuestas.Application.DTOs.Admin;

namespace SistemaApuestas.Application.Interfaces.Admin
{
    public interface IAdminService
    {
        Task<IReadOnlyList<AdminUserSearchDto>> BuscarUsuariosAsync(string query);
        Task<string> ForzarMmrAsync(int usuarioId, string juego, string nuevoMmr);
        Task<string> BanearUsuarioAsync(int usuarioId, int adminId);
    }
}
