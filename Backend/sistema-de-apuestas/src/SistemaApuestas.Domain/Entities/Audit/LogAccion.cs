using System;

namespace SistemaApuestas.Domain.Entities.Audit
{
    public class LogAccion
    {
        public int LogId { get; set; }
        public int UsuarioId { get; set; }
        public string? Accion { get; set; }
        public string? Detalle { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;
    }
}
