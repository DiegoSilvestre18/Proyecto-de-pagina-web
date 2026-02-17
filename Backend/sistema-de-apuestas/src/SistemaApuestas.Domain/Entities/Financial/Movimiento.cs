using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Domain.Entities.Financial
{
    public class Movimiento
    {
        public int MovimientoId { get; set; }
        public int UsuarioId { get; set; }
        public int? RecargaId { get; set; }
        public int? RetiroId { get; set; }
        public int? SalaId { get; set; }
        public string Tipo { get; set; }
        public decimal Monto { get; set; }
        public string Concepto { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;
    }
}
