using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.DTOs.Salas
{
    public class FinalizarAutoChessDto
    {
        public int SalaId { get; set; }

        // 👇 Nombres corregidos para que coincidan con la lógica 👇
        public int PrimerPuestoId { get; set; }
        public int SegundoPuestoId { get; set; }
        public int TercerPuestoId { get; set; }
    }
}
