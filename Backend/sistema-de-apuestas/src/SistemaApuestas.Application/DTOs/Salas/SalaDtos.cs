namespace SistemaApuestas.Application.DTOs.Salas
{
    public class CrearSalaDto
    {
        public string Juego { get; set; }
        public string Formato { get; set; } // "5v5 Captains Mode"

        // 👇 LOS NUEVOS CAMPOS CLAVE 👇
        public string TipoSala { get; set; } // "BASICA", "PREMIUM", "PERSONALIZADA"
        public string TipoPremio { get; set; } // "REAL" o "BONO" (Para la personalizada)

        // Estos solo se usarán si es PERSONALIZADA
        public decimal CostoEntrada { get; set; }
        public decimal PremioARepartir { get; set; }
    }

    public class InscripcionSalaDto
    {
        public int SalaId { get; set; }
        public int GameAccountId { get; set; }
        public string Equipo { get; set; }

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
    }

    public class SugerenciaGanadorResponseDto
    {
        public int SalaId { get; set; }
        public int SugerenciaGanadorId { get; set; }
        public string Confianza { get; set; } = string.Empty;
        public string Motivo { get; set; } = string.Empty;
    }

}