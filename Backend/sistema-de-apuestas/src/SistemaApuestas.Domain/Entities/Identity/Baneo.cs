using System;

namespace SistemaApuestas.Domain.Entities.Identity
{
	public class Baneo
	{
		public int BaneoId { get; set; }
		public int UsuarioId { get; set; }
		public int AdminId { get; set; }
		public string Motivo { get; set; }
		public int Tiempo { get; set; }
		public DateTime FechaBaneo { get; set; } = DateTime.Now;

		// Navegación: Dos FKs apuntando a USUARIO
		public Usuario Usuario { get; set; } = null!;
		public Usuario Admin { get; set; } = null!;
	}
}
