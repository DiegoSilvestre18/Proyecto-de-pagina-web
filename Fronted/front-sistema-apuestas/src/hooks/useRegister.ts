import { useState } from 'react';

// Define the base form structure
export interface baseForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: string;
}

export const useRegister = (rol: string) => {
  // Inicializa el estado para formulario
  const [formUsuario, setFormUsuario] = useState<baseForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: rol,
  });

  // Maneja los cambios en el formulario
  const handleFormUsuario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormUsuario({ ...formUsuario, [name]: value });
  };

  // Validación del formulario
  const validationForm = () => {
    // Obtengo los valores del formulario para validarlos
    const { username, email, password, confirmPassword } = formUsuario;
    // Esto retorna la variable o vacio. Si username no existe o es nulo, se asigna vacio.
    if (!(username || '').trim()) return 'El nombre es obligatorio.';
    if (!(email || '').trim()) return 'El email es obligatorio.';
    if (!(password || '').trim()) return 'La contraseña es obligatoria.';
    if (!(confirmPassword || '').trim())
      return 'La confirmación de contraseña es obligatoria.';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
    return null;
  };

  const buildPayload = (form: baseForm) => {
    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      rol: form.rol,
    };
    console.log('nuevo usuario', payload);
    return payload;
  };

  // Para hacer submit
  const handleSubmit = () => {
    const error = validationForm();
    if (error) return { error: error, payload: null };
    const payload = buildPayload(formUsuario);

    return { error: null, payload: payload };
  };

  const resetForm = () => {
    setFormUsuario({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      rol: rol,
    });
  };

  return {
    formUsuario,
    handleFormUsuario,
    handleSubmit,
    resetForm,
  };
};
