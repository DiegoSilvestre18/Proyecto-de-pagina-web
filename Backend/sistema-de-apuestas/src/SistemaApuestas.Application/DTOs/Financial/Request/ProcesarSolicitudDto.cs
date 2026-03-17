using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.DTOs.Financial.Request
{
    // Para que el admin aprueba o rechace la solicitud del usuario
    public class ProcesarSolicitudDto
    {
        public int SolicitudId { get; set; }
        public bool Aprobar { get; set; } // True = Aprobar, False = Rechazar
        public string? NroOperacion { get; set; } // El admin ingresa el código de Yape/Plin aquí
        public string? CuentaDestino { get; set; } // Para que el admin coloca a donde se deposito
    }
}