using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.DTOs.Auth.LogIn
{
    // Información del usuario que se envía al cliente después de un login exitoso
    public class UsuarioDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
        public decimal SaldoReal { get; set; }
        public decimal SaldoBono { get; set; }
    }
}
