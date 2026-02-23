namespace SistemaApuestas.Application.Interfaces
{
    public interface IGameAccountRepository
    {
        Task<bool> UsuarioYaTieneCuentaAsync(int usuarioId, string juego);

        Task AgregarAsync(SistemaApuestas.Domain.Entities.Gaming.GameAccount gameAccount);

        // Los dos nuevos que agregamos hoy para buscar y actualizar:
        Task<SistemaApuestas.Domain.Entities.Gaming.GameAccount?> ObtenerPorUsuarioYJuegoAsync(int usuarioId, string juego);

        Task ActualizarAsync(SistemaApuestas.Domain.Entities.Gaming.GameAccount gameAccount);
    }
}