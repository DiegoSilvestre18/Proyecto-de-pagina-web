using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Domain.Entities.Betting
{
    public class Sala
    {
        public int salaId { get; set; } //
        public int administradorId { get; set; } //
        public decimal comision { get; set; } //
        public decimal cuotaInicial { get; set; } //
        public string juego { get; set; } //
        public string estado { get; set; } = "ABIERTA"; //
        public int? mmrMin { get; set; } //
        public int? mmrMax { get; set; } //
        public char? equipoGanador { get; set; } //
        public DateTime fechaCreacion { get; set; } = DateTime.Now;//
    }
}
