using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Domain.Entities.Financial
{
    public class SolicitudRetiro
    {
        public int retiroId { get; set; }
        public int usuarioId { get; set; }
        public int adminId { get; set; }
        public decimal monto { get; set; }
        public string plataforma { get; set; }
        public string? cuentaDestino { get; set; }
        public string? urlImagen { get; set; }
        public string estado { get; set; } = "PENDIENTE";
        public DateTime fechaSolicitud { get; set; } = DateTime.Now;
        public DateTime fechaRetiro { get; set; }
    }
}
