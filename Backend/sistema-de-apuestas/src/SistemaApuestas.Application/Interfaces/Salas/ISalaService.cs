using SistemaApuestas.Application.DTOs.Salas;

namespace SistemaApuestas.Application.Interfaces.Salas
{
    public interface ISalaService
    {
        Task<int> CrearSalaAsync(int creadorId, CrearSalaDto request);
        Task<UnirseSalaResponseDto> UnirseASalaAsync(int jugadorId, InscripcionSalaDto request);
        Task<string> CancelarSalaAsync(int salaId);
        Task<SugerenciaGanadorResponseDto> SugerirGanadorAsync(int salaId);
        Task<string> FinalizarSalaAsync(FinalizarSalaDto request);
    }
}