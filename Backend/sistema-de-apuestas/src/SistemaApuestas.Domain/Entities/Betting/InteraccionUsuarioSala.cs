using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Domain.Entities.Betting
{
    internal class InteraccionUsuarioSala
    {
		public int UsuarioId { get; set; }
		public int SalaId { get; set; }
		public double? MontoPago { get; set; }
		public string? Rol { get; set; }
		public char? Equipo { get; set; }
    }
}
