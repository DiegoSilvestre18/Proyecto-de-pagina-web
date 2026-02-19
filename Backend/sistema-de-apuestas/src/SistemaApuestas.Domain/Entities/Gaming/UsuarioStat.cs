using System;
using System.Collections.Generic;

namespace SistemaApuestas.Domain.Entities.Gaming
{
    public class UsuarioStat
    {
        public int UserStatId { get; set; }
        public int UsuarioId { get; set; }
        public string? Juego { get; set; }
        public int EloMmr { get; set; } = 0;
        public int Wins { get; set; } = 0;
        public int Loses { get; set; } = 0;
        public string? RangoMedalla { get; set; }

        // Navegación
        public Identity.Usuario Usuario { get; set; } = null!;
        public ICollection<HistorialMmrAdmin> HistorialCambios { get; set; } = [];
    }
}
