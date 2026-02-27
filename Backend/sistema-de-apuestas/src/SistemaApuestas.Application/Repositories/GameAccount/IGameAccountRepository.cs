namespace SistemaApuestas.Application.Repositories.GameAccount
{
    public interface IGameAccountRepository
    {
        Task<bool> UsuarioYaTieneCuentaAsync(int usuarioId, string juego);

        Task AgregarAsync(Domain.Entities.Gaming.GameAccount gameAccount);

        // Los dos nuevos que agregamos hoy para buscar y actualizar:
        Task<Domain.Entities.Gaming.GameAccount?> ObtenerPorUsuarioYJuegoAsync(int usuarioId, string juego);

        Task ActualizarAsync(Domain.Entities.Gaming.GameAccount gameAccount);
    }
}