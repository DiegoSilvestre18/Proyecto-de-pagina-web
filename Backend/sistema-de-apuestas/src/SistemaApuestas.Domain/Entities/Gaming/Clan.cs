using System;
using System.Collections.Generic;

namespace SistemaApuestas.Domain.Entities.Gaming
{
	public class Clan
	{
		public int ClanId { get; set; }
		public string Nombre { get; set; }
		public string? Descripcion { get; set; }
		public string? ImageUrl { get; set; }

		// Navegación: Un clan tiene muchos usuarios
		public ICollection<Identity.Usuario> Usuarios { get; set; } = [];
	}
}
