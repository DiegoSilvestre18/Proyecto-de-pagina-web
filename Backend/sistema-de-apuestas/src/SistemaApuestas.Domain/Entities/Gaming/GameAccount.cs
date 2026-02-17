using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Domain.Entities.Gaming
{
    public class GameAccount
    {
		public int GameAccountId { get; set; }
		public int UsuarioId { get; set; }
		public string Juego { get; set; }
		public string? ProfileUrl { get; set; }
		public string? IdExterno { get; set; }
		public string? IdExterno2 { get; set; }
    }
}
