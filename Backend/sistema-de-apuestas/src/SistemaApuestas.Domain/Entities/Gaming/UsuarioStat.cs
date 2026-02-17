using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Domain.Entities.Gaming
{
    public class UsuarioStat
    {
        public int usuarioStatId { get; set; }
        public int usuarioId { get; set; }
        public string? juego { get; set; }
        public int eloMmr { get; set; } = 0;
        public int wins { get; set; } = 0;
        public int loses { get; set; } = 0;
        public string? rangoMedalla { get; set; }
    }
}
