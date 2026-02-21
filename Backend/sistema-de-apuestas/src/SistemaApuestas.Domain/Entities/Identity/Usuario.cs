using System;
using System.Collections.Generic;

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

        // Navegación
        public Gaming.Clan? Clan { get; set; }
        public ICollection<Gaming.GameAccount> GameAccounts { get; set; } = [];
        public ICollection<Gaming.UsuarioStat> UsuarioStats { get; set; } = [];
        public ICollection<Betting.Sala> SalasCreadas { get; set; } = [];
        public ICollection<Betting.ParticipanteSala> Participaciones { get; set; } = [];
        public ICollection<Financial.SolicitudRecarga> SolicitudesRecarga { get; set; } = [];
        public ICollection<Financial.SolicitudRetiro> SolicitudesRetiro { get; set; } = [];
        public ICollection<Audit.Movimiento> Movimientos { get; set; } = [];
        public ICollection<Baneo> BaneosRecibidos { get; set; } = [];
        public ICollection<Baneo> BaneosAplicados { get; set; } = [];
        public ICollection<Audit.LogAccion> LogAcciones { get; set; } = [];
    }
}
