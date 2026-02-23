using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.DTOs.Auth
{
    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
