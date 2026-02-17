using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Domain.Entities.Financial
{
    public class SolicitudRecarga
    {
        public int recargaId { get; set; }
        public int usuarioId { get; set; }
        public int administradorId { get; set; }
        public decimal monto { get; set; }
        public string plataforma { get; set; }
        public string? cuentaDestino { get; set; }
        public string estado { get; set; } = "PENDIENTE";
        public DateTime fechaEmision { get; set; } = DateTime.Now;
        public DateTime fechaAprobacion { get; set; }
    }
}
