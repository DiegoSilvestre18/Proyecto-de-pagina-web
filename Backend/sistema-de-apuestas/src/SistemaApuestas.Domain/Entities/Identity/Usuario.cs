using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Domain.Entities.Identity
{
    public class Usuario
    {        
        public int usuarioId { get; set; } //
        public string username { get; set; } //
        public string email{ get; set; } //
        public decimal saldo { get; set; } = 0 //
        public string passwordHash { get; set; } //

        // Relaciones para navegación profesional
    }
}
