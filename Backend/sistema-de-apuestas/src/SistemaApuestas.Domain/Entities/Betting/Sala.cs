using System;

namespace SistemaApuestas.Domain.Entities.Betting
{
    public class Sala
    {
        public int SalaId { get; set; }
        public int CreadorId { get; set; }
        public int? TorneoId { get; set; }
        public string? Nombre { get; set; }
        public string TipoSala { get; set; } = "BASICA";
        public string Juego { get; set; }
        public decimal CostoEntrada { get; set; }
        public decimal PremioARepartir { get; set; }
        public decimal GananciaPlataforma { get; set; }
        public string Estado { get; set; } = "ESPERANDO";
        public int? MapaElegidoId { get; set; }
        public string? VetoLog { get; set; }
        public string? ResultadoGanador { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}
