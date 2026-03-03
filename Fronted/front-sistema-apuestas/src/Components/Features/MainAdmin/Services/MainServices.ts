import { apiFetch } from '../../../../Global/Api';
import { type procesarSolicitudType } from '../Types/Types';

export const getSolicitudesPendientes = async () => {
  try {
    const response = await apiFetch(
      '/api/Finanzas/admin/solicitudes-pendientes',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMisSolicitudes = async () => {
  try {
    const response = await apiFetch('/api/Finanzas/admin/mis-solicitudes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const tomarSolicitud = async ({
  solicitudId,
  tipo,
}: {
  solicitudId: number;
  tipo: string;
}) => {
  try {
    const formData = {
      solicitudId,
      tipo,
    };
    const response = await apiFetch('/api/Finanzas/admin/solicitudes/tomar', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const procesarSolicitud = async (formData: procesarSolicitudType) => {
  try {
    const response = await apiFetch('/api/Finanzas/admin/recargas/procesar', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return response;
  } catch (error) {
    throw error;
  }
};
