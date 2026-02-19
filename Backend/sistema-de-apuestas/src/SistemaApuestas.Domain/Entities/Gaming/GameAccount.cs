using System;
using System.Collections.Generic;

namespace SistemaApuestas.Domain.Entities.Gaming
{
	public class GameAccount
	{
		public int GameAccountId { get; set; }
		public int UsuarioId { get; set; }
		public string Juego { get; set; }
		public string IdExterno { get; set; }
		public string? IdVisible { get; set; }
		public string? RangoActual { get; set; }
		public bool EsRangoManual { get; set; } = false;
		public DateTime FechaVinculacion { get; set; } = DateTime.Now;

		// Navegación
		public Identity.Usuario Usuario { get; set; } = null!;
		public ICollection<Betting.ParticipanteSala> Participaciones { get; set; } = [];
	}
}
