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

        Task<string> TomarSalaAsync(int salaId, int adminId);

        Task<string> ProcesarSalaAsync(int salaId, bool aprobar, decimal costo, int adminId, string? nombreLobby, string? passwordLobby);
        Task<IEnumerable<object>> ObtenerTodasLasSalasAsync();

        Task<string> CambiarEquipoAsync(int usuarioId, int salaId, string nuevoEquipo);

        Task<string> LanzarMonedaAsync(int salaId, int usuarioId);

        Task<string> ReclutarJugadorAsync(int salaId, int capitanId, int jugadorReclutadoId);
    }
}