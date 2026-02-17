using System;

namespace SistemaApuestas.Domain.Entities.Audit
{
    public class Movimiento
    {
        public int MovimientoId { get; set; }
        public int UsuarioId { get; set; }
        public int? RecargaId { get; set; }
        public int? RetiroId { get; set; }
        public int? SalaId { get; set; }
        public string Tipo { get; set; }
        public decimal MontoReal { get; set; } = 0;
        public decimal MontoBono { get; set; } = 0;
        public string Concepto { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;
    }
}
