using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.DTOs.Auth.Regiser
{
    public class RegisterDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Rol { get; set; } = "USER"; // Por defecto, el rol será "USER"
    }
}
