import { apiFetch } from '../../../../Global/Api';

export const postLogin = async (formData: {
  username: string;
  password: string;
}) => {
  try {
    const response = await apiFetch('/api/Auth/login', {
      method: 'POST',
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
