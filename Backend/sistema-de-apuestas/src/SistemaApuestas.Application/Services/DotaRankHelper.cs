using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.Services
{
    public static class DotaRankHelper
    {
        public static (string NombreRango, int MmrEstimado) TraducirRankTier(int rankTier)
        {
            if (rankTier == 0) return ("Unranked", 0);

            // Immortal es un caso especial (80)
            if (rankTier >= 80) return ("Immortal", 5620);

            // Separamos los dígitos (ej: 41 -> medalla = 4, estrella = 1)
            int medalla = rankTier / 10;
            int estrella = rankTier % 10;

            string nombreMedalla = medalla switch
            {
                1 => "Herald",
                2 => "Guardian",
                3 => "Crusader",
                4 => "Archon",
                5 => "Legend",
                6 => "Ancient",
                7 => "Divine",
                _ => "Unranked"
            };

            // Si por alguna razón la API devuelve una medalla inválida
            if (nombreMedalla == "Unranked") return ("Unranked", 0);

            // Armamos el nombre final (Ej: "Archon 1")
            string nombreRangoCompleto = $"{nombreMedalla} {estrella}";

            // Calculamos el MMR Base de la medalla según tu tabla
            int mmrBase = medalla switch
            {
                1 => 0,     // Herald
                2 => 770,   // Guardian
                3 => 1540,  // Crusader
                4 => 2310,  // Archon
                5 => 3080,  // Legend
                6 => 3850,  // Ancient
                7 => 4620,  // Divine
                _ => 0
            };

            // Cada estrella suma aproximadamente 154 de MMR
            // Restamos 1 porque la estrella 1 arranca en el MMR base
            int mmrEstrella = (estrella - 1) * 154;

            // Evitamos que la estrella sea 0 o negativa por error de API
            if (mmrEstrella < 0) mmrEstrella = 0;

            int mmrTotalEstimado = mmrBase + mmrEstrella;

            return (nombreRangoCompleto, mmrTotalEstimado);
        }
    }
}
