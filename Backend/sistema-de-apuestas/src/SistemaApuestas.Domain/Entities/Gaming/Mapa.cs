using System;
using System.Collections.Generic;

namespace SistemaApuestas.Domain.Entities.Gaming
{
    public class Mapa
    {
        public int MapaId { get; set; }
        public string Nombre { get; set; }
        public string? ImagenUrl { get; set; }
        public bool Activo { get; set; } = true;

        // Navegación
        public ICollection<Betting.Sala> Salas { get; set; } = [];
    }
}
