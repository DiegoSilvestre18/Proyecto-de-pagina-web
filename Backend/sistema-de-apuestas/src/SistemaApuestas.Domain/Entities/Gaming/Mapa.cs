using System;

namespace SistemaApuestas.Domain.Entities.Gaming
{
    public class Mapa
    {
        public int MapaId { get; set; }
        public string Nombre { get; set; }
        public string? ImagenUrl { get; set; }
        public bool Activo { get; set; } = true;
    }
}
