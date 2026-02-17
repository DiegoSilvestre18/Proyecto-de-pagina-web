using System;

namespace SistemaApuestas.Domain.Entities.Gaming
{
	public class Clan
	{
		public int ClanId { get; set; }
		public string Nombre { get; set; }
		public string? Descripcion { get; set; }
		public string? ImageUrl { get; set; }
	}
}
