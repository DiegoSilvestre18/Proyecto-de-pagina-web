using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.DTOs.Salas
{
    public class ProcesarSalaDto
    {
        public int SalaId { get; set; }
        public bool Aprobar { get; set; }

        public decimal Costo { get; set; }

        public string? Equipo { get; set; }

        public string? NombreLobby { get; set; } // <-- Debe estar aquí para recibir el texto
        public string? PasswordLobby { get; set; } // <-- Debe estar aquí

    }
}
