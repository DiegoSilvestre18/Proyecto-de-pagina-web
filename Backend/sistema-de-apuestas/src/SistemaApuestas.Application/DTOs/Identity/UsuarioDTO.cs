using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.DTOs.Identity
{
    public class UsuarioDTO
    {
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Telefono { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public decimal Saldo { get; set; } // El saldo inicial es 0
        public decimal SaldoBono { get; set; } // El saldo bloqueado inicial es 0
        public int PartidasJugadas { get; set; }
        public string Rol { get; set; } = "USER"; // Por defecto, el rol será "USER"
    }
}
