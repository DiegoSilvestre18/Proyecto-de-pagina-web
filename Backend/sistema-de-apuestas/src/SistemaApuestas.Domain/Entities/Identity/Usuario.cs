using System;

namespace SistemaApuestas.Domain.Entities.Identity
{
    public class Usuario
    {
        public int UsuarioId { get; set; }
        public int? ClanId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PassHash { get; set; }
        public decimal SaldoReal { get; set; } = 0;
        public decimal SaldoBono { get; set; } = 0;
        public string Rol { get; set; } = "USER";
        public int PartidasJugadas { get; set; } = 0;
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}
