import type { User, Club, Sala } from '../types';

// TODO: Reemplazar por llamadas al backend (Services)
export const mockUser: User = {
  username: 'dieguinho18',
  mmr: 5000,
  saldoReal: 150.5,
  saldoBono: 25.0,
  avatar:
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=100&h=100',
};

export const mockClubs: Club[] = [
  {
    id: 1,
    name: 'Lima Esports',
    members: 45,
    verified: true,
    avatar:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=50&h=50',
  },
  {
    id: 2,
    name: 'DotaPT Community',
    members: 128,
    verified: true,
    avatar:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=50&h=50',
  },
  {
    id: 3,
    name: 'Valorant LATAM',
    members: 342,
    verified: false,
    avatar:
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=50&h=50',
  },
];

export const mockSalas: Sala[] = [
  {
    id: 1,
    fecha: 'HOY, 15:00 GMT-5',
    nombre: 'Duelo de Mid - Shadow Fiend',
    creador: 'dieguinho18',
    formato: '1v1',
    costo: 15.0,
    jugadores: 1,
    maxJugadores: 2,
  },
  {
    id: 2,
    fecha: 'HOY, 15:30 GMT-5',
    nombre: 'Tryhard All Pick',
    creador: 'Lima Esports',
    formato: '5v5 All Pick',
    costo: 50.0,
    jugadores: 8,
    maxJugadores: 10,
  },
  {
    id: 3,
    fecha: 'HOY, 16:00 GMT-5',
    nombre: 'Práctica Turbo Apuestas',
    creador: 'xX_Slayer_Xx',
    formato: '5v5 Turbo',
    costo: 5.0,
    jugadores: 9,
    maxJugadores: 10,
  },
  {
    id: 4,
    fecha: 'HOY, 17:00 GMT-5',
    nombre: 'Captains Mode High MMR',
    creador: 'DotaPT',
    formato: '5v5 Captains',
    costo: 100.0,
    jugadores: 2,
    maxJugadores: 10,
  },
  {
    id: 5,
    fecha: 'MAÑANA, 11:00 GMT-5',
    nombre: 'Duelo de Supports',
    creador: 'RubickGod',
    formato: '1v1',
    costo: 20.0,
    jugadores: 1,
    maxJugadores: 2,
  },
];

export const filtrosModos = [
  '1v1',
  '5v5 All Pick',
  '5v5 Captains Mode',
  '5v5 Turbo',
  'All Random Deathmatch',
];
