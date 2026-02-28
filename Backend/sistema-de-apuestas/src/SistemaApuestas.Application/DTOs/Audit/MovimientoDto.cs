using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.DTOs.Audit
{
    public class MovimientoDto
    {
        public int UsuarioId { get; set; }
        public int? RecargaId { get; set; }
        public int? RetiroId { get; set; }
        public int? SalaId { get; set; }
        public string Tipo { get; set; } // "INGRESO" o "EGRESO"
        public decimal MontoReal { get; set; }
        public decimal MontoBono { get; set; }
        public string Concepto { get; set; }
        public DateTime Fecha { get; set; }
    }
}
