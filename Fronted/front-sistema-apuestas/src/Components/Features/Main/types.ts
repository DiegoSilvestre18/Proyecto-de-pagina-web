export interface User {
  username: string;
  mmr: number;
  saldoReal: number;
  saldoBono: number;
  avatar: string;
}

export interface Club {
  id: number;
  name: string;
  members: number;
  verified: boolean;
  avatar: string;
}

export interface Sala {
  id: number;
  fecha: string;
  nombre: string;
  creador: string;
  formato: string;
  costo: number;
  jugadores: number;
  maxJugadores: number;
}
