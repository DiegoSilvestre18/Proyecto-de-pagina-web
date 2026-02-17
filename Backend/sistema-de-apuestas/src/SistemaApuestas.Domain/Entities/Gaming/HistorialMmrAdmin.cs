using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Domain.Entities.Gaming
{
    public class HistorialMmrAdmin
    {
		public int HistorialId { get; set; }
		public int AdministradorId { get; set; }
		public int UserStatId { get; set; }
		public int MmrAnterior { get; set; }
		public int MmrNuevo { get; set; }
		public string Motivo { get; set; }
		public DateTime FechaCambio { get; set; } = DateTime.Now;
    }
}
