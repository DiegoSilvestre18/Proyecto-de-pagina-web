using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.DTOs.Financial.Response
{
    // Lo que le llega al admin cuando toma una solicitud
    public class SolicitudPendienteAdminDto
    {
        public int SolicitudId { get; set; }
        public string Tipo { get; set; } = string.Empty; // "RECARGA" o "RETIRO"
        public decimal Monto { get; set; }
        public string Moneda { get; set; } = string.Empty;
        public string Metodo { get; set; } = string.Empty;
        public string CuentaDestino { get; set; } = string.Empty; // En retiro: a dónde enviar el dinero
        public DateTime FechaEmision { get; set; }

        // Datos del jugador (Obtenidos con JOIN en la base de datos)
        public int UsuarioId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
