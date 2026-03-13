import { apiFetch } from '../../../../Global/Api';
import { type FormData, type PasswordData } from '../Types/Types';

export const ChangeUser = async (formData: FormData) => {
  try {
    // Asegúrate de que esta sea la ruta exacta de tu backend C#
    const response = await apiFetch('/api/Usuario/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    return response;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};

export const ChangePassword = async (formData: PasswordData) => {
  try {
    // Asegúrate de que esta sea la ruta exacta de tu backend C#
    const response = await apiFetch('/api/Usuario/me/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    return response;
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    throw error;
  }
};
