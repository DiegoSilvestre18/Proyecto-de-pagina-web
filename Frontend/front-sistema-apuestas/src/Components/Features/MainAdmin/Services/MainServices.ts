import { apiFetch } from '../../../../Global/Api';
import { type procesarSolicitudType, type formBonoType } from '../Types/Types';

export const getSolicitudesPendientes = async () => {
  return await apiFetch('/api/Finanzas/admin/solicitudes-pendientes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getMisSolicitudes = async () => {
  return await apiFetch('/api/Finanzas/admin/mis-solicitudes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const tomarSolicitud = async ({
  solicitudId,
  tipo,
}: {
  solicitudId: number;
  tipo: string;
}) => {
  const formData = { solicitudId, tipo };
  return await apiFetch('/api/Finanzas/admin/solicitudes/tomar', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
};

export const procesarSolicitud = async (
  formData: procesarSolicitudType,
  type: string,
) => {
  return await apiFetch(`/api/Finanzas/admin/${type}s/procesar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
};

export const tomarSala = async (salaId: number) => {
  return await apiFetch(`/api/Sala/admin/tomar/${salaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
};
export const procesarSala = async (
  salaId: number,
  aprobar: boolean,
  costo: number,
  nombreLobby?: string,
  passwordLobby?: string,
) => {
  return await apiFetch('/api/Sala/admin/procesar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    // 👇 ¡Aquí es donde ocurre la magia! Agregamos los dos campos al body
    body: JSON.stringify({
      salaId,
      aprobar,
      costo,
      nombreLobby,
      passwordLobby,
    }),
  });
};

export const otorgarBono = async (formData: formBonoType) => {
  return await apiFetch('/api/Finanzas/admin/bonos/otorgar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
};

export const buscarUsuariosAdmin = async (query: string = '') => {
  // Usamos tu apiFetch que ya funciona perfecto en este archivo
  return await apiFetch(`/api/admin/usuarios/buscar?q=${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// --- AGREGAR AL FINAL DE MainServices.ts ---

// 1. Servicio para cambiar MMR
export const forzarMmrAdmin = async (
  usuarioId: number,
  juego: string,
  nuevoMmr: string,
) => {
  return await apiFetch(`/api/admin/usuarios/${usuarioId}/forzar-mmr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ juego, nuevoMmr }),
  });
};

// 2. Servicio para Banear
export const banearUsuarioAdmin = async (usuarioId: number) => {
  return await apiFetch(`/api/admin/usuarios/${usuarioId}/banear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
};

// 3. Servicio para Dar Bono (Reemplaza la URL por la que haya creado tu amigo)
export const darBonoAdmin = async (username: string, monto: number) => {
  // EJEMPLO: Si tu amigo lo puso en FinanzasController
  return await apiFetch(`/api/Finanzas/bono`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, monto }),
  });
};
