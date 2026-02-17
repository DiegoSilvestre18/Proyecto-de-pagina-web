using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Domain.Entities.Identity
{
    public class Administrador
    {
		public int AdministradorId { get; set; } //
		public string Username { get; set; } //
		public string Email { get; set; } //
		public string PassHash { get; set; } //
    }
}
