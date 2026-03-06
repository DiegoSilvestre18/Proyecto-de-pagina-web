import { apiFetch } from '../../../../Global/Api';
import { type procesarSolicitudType } from '../Types/Types';

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
) => {
  return await apiFetch('/api/Sala/admin/procesar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salaId, aprobar, costo }), // <-- Enviamos el costo
  });
};
