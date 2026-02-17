using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Domain.Entities.Identity
{
    public class Baneo
    {
		public int BaneoId { get; set; }
		public int UsuarioId { get; set; }
		public int AdministradorId { get; set; }
		public string Motivo { get; set; }
		public TimeOnly Tiempo { get; set; }
		public DateTime FechaBaneo { get; set; } = DateTime.Now;
    }
}
