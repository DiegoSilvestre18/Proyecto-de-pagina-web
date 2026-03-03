import { apiFetch } from '../../../../Global/Api';
import { type RecargaForm } from '../types/types';

export const postSolicitarRecarga = async (formData: RecargaForm) => {
  try {
    const response = apiFetch('/api/Finanzas/recargas/solicitar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return response;
  } catch (error) {
    console.error('Error al solicitar recarga:', error);
    throw error;
  }
};
