using System;

namespace SistemaApuestas.Domain.Entities.Betting
{
    public class ParticipanteSala
    {
        public int ParticipacionId { get; set; }
        public int SalaId { get; set; }
        public int UsuarioId { get; set; }
        public int GameAccountId { get; set; }
        public string Equipo { get; set; }
        public bool EsCapitan { get; set; } = false;
        public int? SlotIndex { get; set; }
        public decimal PagoConBono { get; set; } = 0;
        public decimal PagoConReal { get; set; } = 0;
    }
}
