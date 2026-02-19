using System;
using System.Collections.Generic;

namespace SistemaApuestas.Domain.Entities.Financial
{
    public class SolicitudRecarga
    {
        public int RecargaId { get; set; }
        public int UsuarioId { get; set; }
        public decimal Monto { get; set; }
        public string? Metodo { get; set; }
        public string? CodigoOperacion { get; set; }
        public string? FotoVoucherUrl { get; set; }
        public string Estado { get; set; } = "PENDIENTE";
        public int? AdminAtendiendoId { get; set; }
        public DateTime FechaEmision { get; set; } = DateTime.Now;
        public DateTime? FechaCierre { get; set; }

        // Navegación
        public Identity.Usuario Usuario { get; set; } = null!;
        public Identity.Usuario? AdminAtendiendo { get; set; }
        public ICollection<Audit.Movimiento> Movimientos { get; set; } = [];
    }
}
