import { apiFetch } from '../../../../Global/Api';
import { ESTADOS_SALA } from '../constants/estados';
import { FORMATOS_VALIDOS, isFormatoValido } from '../constants/formatos';
import type { Sala } from '../types/types';

const normalizarEstado = (estado?: string) => {
  if (estado === 'EN JUEGO') return ESTADOS_SALA.EN_CURSO;
  return estado || ESTADOS_SALA.ESPERANDO;
};

const normalizarSala = (sala: Sala): Sala => {
  const formato = isFormatoValido(sala.formato)
    ? sala.formato
    : FORMATOS_VALIDOS.ALL_PICK_5V5;

  const maxJugadoresDefecto = formato === FORMATOS_VALIDOS.AUTO_CHESS ? 8 : 10;
  const maxJugadores = sala.maxJugadores || maxJugadoresDefecto;
  const jugadores = sala.jugadores ?? sala.participantes?.length ?? 0;
  const estadoNormalizado = normalizarEstado(sala.estado);

  return {
    ...sala,
    formato,
    maxJugadores,
    jugadores,
    estado: estadoNormalizado,
  };
};

// Reemplaza "any" con la interfaz real de tu Sala si ya la tienes en types.ts
export const getSalas = async (): Promise<Sala[]> => {
  try {
    // Asegúrate de que esta sea la ruta exacta de tu backend C#
    const response = await apiFetch('/api/Sala');

    // Si tu API devuelve un objeto { response: [...] }, usa res.response
    // Si devuelve el arreglo directo [...], usa solo res
    const rawSalas = response?.response || response || [];
    return Array.isArray(rawSalas) ? rawSalas.map(normalizarSala) : [];
  } catch (error) {
    console.error('Error al obtener las salas:', error);
    throw error;
  }
};

// En tu ServiceSalas.ts

// Esta interfaz define lo que le vamos a enviar a C#
export interface CrearSalaRequest {
  juego: string;
  formato: string;
  costoEntrada: number;
  tipoSala: string;
  tipoPremio: string;
  premioARepartir: number;
  mmrMinimo: number;
  mmrMaximo: number;
  nombreLobby?: string;
  passwordLobby?: string;
}

export const solicitarSala = async (data: CrearSalaRequest) => {
  try {
    // 👇 AQUI ESTÁ EL CAMBIO: agregamos /crear al final 👇
    const response = await apiFetch('/api/Sala/crear', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error al solicitar la sala:', error);
    throw error;
  }
};

// La estructura que C# espera recibir (InscripcionSalaDto)
export interface UnirseSalaRequest {
  salaId: number;
  gameAccountId?: number;
  equipo: string;
}

export const unirseASala = async (data: UnirseSalaRequest) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await apiFetch('/api/Sala/unirse', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const retirarseDeSala = async (salaId: number) => {
  return await apiFetch(`/api/Sala/${salaId}/retirarse`, {
    method: 'POST',
  });
};

export const expulsarUsuarioSala = async (
  salaId: number,
  usuarioId: number,
) => {
  return await apiFetch(`/api/Sala/${salaId}/expulsar/${usuarioId}`, {
    method: 'POST',
  });
};

export const getMisCuentasJuego = async () => {
  return await apiFetch('/api/GameAccount/mis-cuentas');
};

export const cambiarEquipoSala = async (
  salaId: number,
  nuevoEquipo: string,
) => {
  return await apiFetch(`/api/Sala/${salaId}/cambiar-equipo`, {
    method: 'PUT', // Usamos PUT porque así lo definió tu amigo en el controlador
    body: JSON.stringify({ nuevoEquipo }), // Mandamos el DTO
  });
};

export const lanzarMonedaSala = async (salaId: number) => {
  return await apiFetch(`/api/Sala/${salaId}/lanzar-moneda`, {
    method: 'POST',
  });
};

export const reclutarJugadorDraft = async (
  salaId: number,
  jugadorId: number,
) => {
  return await apiFetch(`/api/Sala/${salaId}/reclutar/${jugadorId}`, {
    method: 'POST',
  });
};

export const empezarPartidaAdmin = async (salaId: number) => {
  return await apiFetch(`/api/Sala/${salaId}/empezar`, {
    method: 'POST',
  });
};

// ✅ LO CORRECTO:
export const finalizarSalaAdmin = async (
  salaId: number,
  equipoGanador: number,
) => {
  // 1. Quitamos el ${salaId} de la URL
  return await apiFetch('/api/Sala/finalizar', {
    method: 'POST',
    // 2. Mandamos el salaId y el ganadorId dentro del body para que coincida con tu FinalizarSalaDto en C#
    body: JSON.stringify({
      salaId: salaId,
      ganadorId: equipoGanador,
    }),
  });
};

export const finalizarAutoChessAdmin = async (
  salaId: number,
  podio1: number,
  podio2: number,
  podio3: number,
) => {
  return await apiFetch(`/api/Sala/${salaId}/finalizar-autochess`, {
    method: 'POST',
    body: JSON.stringify({ podio1, podio2, podio3 }),
  });
};

export const forzarCapitanAdmin = async (
  salaId: number,
  nuevoCapitanId: number,
) => {
  return await apiFetch(
    `/api/Sala/${salaId}/forzar-capitan/${nuevoCapitanId}`,
    {
      method: 'POST',
    },
  );
};
