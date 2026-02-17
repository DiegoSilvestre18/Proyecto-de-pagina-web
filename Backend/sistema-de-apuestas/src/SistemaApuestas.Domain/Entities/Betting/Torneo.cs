using System;

namespace SistemaApuestas.Domain.Entities.Betting
{
    public class Torneo
    {
        public int TorneoId { get; set; }
        public string Nombre { get; set; }
        public decimal PremioPozo { get; set; }
        public decimal CostoInscripcion { get; set; }
        public string Estado { get; set; } = "REGISTRO";
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
    }
}
