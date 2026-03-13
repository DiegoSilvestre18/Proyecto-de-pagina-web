import { apiFetch } from '../../../../Global/Api';
import type { Sala } from '../types/types';

// Reemplaza "any" con la interfaz real de tu Sala si ya la tienes en types.ts
export const getSalas = async (): Promise<Sala[]> => {
  try {
    // Asegúrate de que esta sea la ruta exacta de tu backend C#
    const response = await apiFetch('/api/Sala');

    // Si tu API devuelve un objeto { response: [...] }, usa res.response
    // Si devuelve el arreglo directo [...], usa solo res
    if (response && response.response) {
      return response.response;
    }

    return response || [];
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

export const finalizarSalaAdmin = async (
  salaId: number,
  equipoGanador: number,
) => {
  return await apiFetch(`/api/Sala/${salaId}/finalizar`, {
    method: 'POST',
    body: JSON.stringify({ equipoGanador }),
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
