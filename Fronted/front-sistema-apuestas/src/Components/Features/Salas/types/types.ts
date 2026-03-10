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
  juego?: string; // 'VALORANT' o 'DOTA'
  estado?: string; // 'ESPERANDO', 'EN JUEGO', 'FINALIZADA'
  premio?: number;
  capitan1Id?: number; // ID del jugador que es capitán del equipo 1
  capitan2Id?: number; // ID del jugador que es capitán del equipo 2
  turnoId?: number; // ID del capitán al que le toca elegir
  ganadorSorteoId?: number; // ID del capitán que ganó el lanzamiento de moneda

  nombreLobby?: string;
  passwordLobby?: string; // PREMIO_A_REPARTIR

  participantes?: {
    username: string;
    steamName: string;
    equipo: string;
    nombreLobby?: string;
    passwordLobby?: string;
    id?: number;
    usuarioId?: number; // ID del participante en la tabla PARTICIPANTE_SALA
  }[];
}

export interface CuentaJuego {
  id: number;
  idVisible: string;
  juego: string;
}
