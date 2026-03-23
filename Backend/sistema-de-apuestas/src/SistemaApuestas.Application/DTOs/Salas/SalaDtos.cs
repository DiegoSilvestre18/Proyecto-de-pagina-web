namespace SistemaApuestas.Application.DTOs.Salas
{
    public class CrearSalaDto
    {
        public string Juego { get; set; } = string.Empty;
        public decimal CostoEntrada { get; set; }
        public decimal PremioARepartir { get; set; }
        public decimal GananciaPlataforma { get; set; }

        public string Formato { get; set; } = "1v1";

        public string? TipoSala { get; set; }

        public string? NombreLobby { get; set; }
        public string? PasswordLobby { get; set; }

        public int MmrMinimo { get; set; }
        public int MmrMaximo { get; set; }

    }

    public class InscripcionSalaDto
    {
        public int SalaId { get; set; }
        public int GameAccountId { get; set; }
        public string Equipo { get; set; }
        public string? RolJuego { get; set; }

    }

    public class FinalizarSalaDto
    {
        public int SalaId { get; set; }
        public int GanadorId { get; set; }
    }

    // --- Nuevos DTOs para devolver datos estructurados ---
    public class UnirseSalaResponseDto
    {
        public string Mensaje { get; set; } = string.Empty;
        public decimal SaldoRealRestante { get; set; }
        public decimal SaldoBonoRestante { get; set; }
        public decimal SaldoRecargaRestante { get; set; }
    }

    public class SugerenciaGanadorResponseDto
    {
        public int SalaId { get; set; }
        public int SugerenciaGanadorId { get; set; }
        public string Confianza { get; set; } = string.Empty;
        public string Motivo { get; set; } = string.Empty;
    }
}