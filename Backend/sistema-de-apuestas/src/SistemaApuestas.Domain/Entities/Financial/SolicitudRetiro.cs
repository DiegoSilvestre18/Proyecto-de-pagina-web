using System;
using System.Collections.Generic;

namespace SistemaApuestas.Domain.Entities.Financial
{
    public class SolicitudRetiro
    {
        public int RetiroId { get; set; }
        public int UsuarioId { get; set; }
        public decimal Monto { get; set; }
        public string CuentaDestino { get; set; }
        public string Estado { get; set; } = "PENDIENTE";
        public int? AdminAtendiendoId { get; set; }
        public string? FotoConstanciaPago { get; set; }
        public DateTime FechaEmision { get; set; } = DateTime.Now;
        public DateTime? FechaPago { get; set; }

        // Navegación
        public Identity.Usuario Usuario { get; set; } = null!;
        public Identity.Usuario? AdminAtendiendo { get; set; }
        public ICollection<Audit.Movimiento> Movimientos { get; set; } = [];
    }
}
