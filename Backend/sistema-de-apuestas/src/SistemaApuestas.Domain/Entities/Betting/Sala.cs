using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaApuestas.Domain.Entities.Betting
{
    public class Sala
    {
        public int SalaId { get; set; }
        public int CreadorId { get; set; }
        public int? TorneoId { get; set; }
        public string? Nombre { get; set; }
        public string TipoSala { get; set; } = "BASICA";
        public string Juego { get; set; }

        // 👇 NUEVO: Para guardar si es 1v1, 5v5 All Pick o 5v5 Captains Mode
        public string Formato { get; set; } = "1v1";

        public decimal CostoEntrada { get; set; }
        public decimal PremioARepartir { get; set; }
        public decimal GananciaPlataforma { get; set; }

        // El Estado ahora fluirá así: ESPERANDO -> SORTEO -> DRAFTING -> EN_CURSO -> FINALIZADA
        public string Estado { get; set; } = "ESPERANDO";

        public int? MapaElegidoId { get; set; }
        public string? VetoLog { get; set; }
        public string? ResultadoGanador { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public DateTime? FechaQuedoVacia { get; set; }
        public bool Activa { get; set; } = true;

        // =========================================================
        // 👇 NUEVAS PROPIEDADES PARA EL DRAFT DE CAPITANES 👇
        // =========================================================

        public int? Capitan1Id { get; set; } // El usuario con mayor MMR
        public int? Capitan2Id { get; set; } // El segundo con mayor MMR
        public int? GanadorSorteoId { get; set; } // Quién ganó la moneda
        public int? TurnoActualId { get; set; } // De qué capitán es el turno para elegir jugador

        // =========================================================

        // Navegación
        public Identity.Usuario Creador { get; set; } = null!;
        public Torneo? Torneo { get; set; }
        public Gaming.Mapa? MapaElegido { get; set; }
        public ICollection<ParticipanteSala> Participantes { get; set; } = [];
        public ICollection<Audit.Movimiento> Movimientos { get; set; } = [];

        [Column("nombrelobby")]
        public string? NombreLobby { get; set; }

        [Column("passwordlobby")]
        public string? PasswordLobby { get; set; }

        // 👇 Relaciones Opcionales para Entity Framework (Navegación de los Capitanes)
        [ForeignKey("Capitan1Id")]
        public Identity.Usuario? Capitan1 { get; set; }

        [ForeignKey("Capitan2Id")]
        public Identity.Usuario? Capitan2 { get; set; }

        [Column("mmr_minimo")]
        public int MmrMinimo { get; set; } = 0;

        [Column("mmr_maximo")]
        public int MmrMaximo { get; set; } = 10000;
    }
}
