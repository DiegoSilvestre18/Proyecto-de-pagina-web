export interface Sala {
  id: number; // Coincide con SALA_ID
  nombre: string; // Coincide con NOMBRE
  creador: string; // El username del CREADOR_ID
  fecha: string; // Fecha de creación o de inicio formateada (ej. "HOY, 15:00")
  formato: string; // Ej. "5v5 All Pick" (Depende del TIPO_SALA o JUEGO)
  costo: number; // Coincide con COSTO_ENTRADA
  jugadores: number; // Cantidad de jugadores actuales (de la tabla PARTICIPANTE_SALA)
  maxJugadores: number; // El límite (ej. 10 para un 5v5, 2 para un 1v1)

  // Opcionales que te servirán más adelante cuando el backend mande todo:
  juego?: string; // 'VALORANT' o 'DOTA2'
  estado?: string; // 'ESPERANDO', 'EN JUEGO', 'FINALIZADA'
  premio?: number; // PREMIO_A_REPARTIR
}
