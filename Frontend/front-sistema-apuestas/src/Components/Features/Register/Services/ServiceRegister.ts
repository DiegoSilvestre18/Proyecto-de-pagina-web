import { apiFetch } from '../../../../Global/Api';
import type { baseForm } from '../../../../Hooks/useRegister';

export const postUser = async (payload: Omit<baseForm, 'confirmPassword'>) => {
  await apiFetch('/api/Auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
