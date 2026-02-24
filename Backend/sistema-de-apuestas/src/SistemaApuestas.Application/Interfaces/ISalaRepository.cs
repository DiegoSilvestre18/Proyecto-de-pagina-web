using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Betting;
using SistemaApuestas.Domain.Entities.Gaming;
using SistemaApuestas.Domain.Entities.Identity;

namespace SistemaApuestas.Application.Interfaces
{
    public interface ISalaRepository
    {
        Task<Sala?> ObtenerSalaPorIdAsync(int salaId);
        Task<Sala?> ObtenerSalaConParticipantesAsync(int salaId);
        Task<Usuario?> ObtenerUsuarioPorIdAsync(int usuarioId);

        Task<SistemaApuestas.Domain.Entities.Gaming.GameAccount?> ObtenerGameAccountAsync(int gameAccountId, int usuarioId);
        Task<bool> ExisteInscripcionAsync(int salaId, int usuarioId);
        Task<Movimiento?> ObtenerReciboInscripcionAsync(int usuarioId, int salaId);

        Task AgregarSalaAsync(Sala sala);
        Task AgregarParticipanteAsync(ParticipanteSala participante);
        Task AgregarMovimientoAsync(Movimiento movimiento);
        Task GuardarCambiosAsync();
    }
}