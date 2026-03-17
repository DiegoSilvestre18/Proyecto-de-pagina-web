import { useState } from 'react';

// Define the base form structure
export interface baseForm {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: string;
}

export const useRegister = (rol: string) => {
  // Inicializa el estado para formulario
  const [formUsuario, setFormUsuario] = useState<baseForm>({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: rol,
  });

  // Maneja los cambios en el formulario
  const handleFormUsuario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const normalizedValue =
      name === 'telefono' ? value.replace(/\D/g, '').slice(0, 9) : value;
    setFormUsuario({ ...formUsuario, [name]: normalizedValue });
  };

  // Validación del formulario
  const validationForm = () => {
    const { nombre, apellidoPaterno, apellidoMaterno, telefono } = formUsuario;
    const username = (formUsuario.username || '').trim();
    const email = (formUsuario.email || '').trim();
    const password = formUsuario.password || '';
    const confirmPassword = formUsuario.confirmPassword || '';

    const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/;
    const usernameRegex = /^[a-zA-Z0-9._-]{4,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!(nombre || '').trim()) return 'El nombre es obligatorio.';
    if (!onlyLettersRegex.test(nombre.trim())) {
      return 'El nombre solo puede contener letras y espacios.';
    }
    if (nombre.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!(apellidoPaterno || '').trim())
      return 'El apellido paterno es obligatorio.';
    if (!onlyLettersRegex.test(apellidoPaterno.trim())) {
      return 'El apellido paterno solo puede contener letras y espacios.';
    }

    if (!(apellidoMaterno || '').trim())
      return 'El apellido materno es obligatorio.';
    if (!onlyLettersRegex.test(apellidoMaterno.trim())) {
      return 'El apellido materno solo puede contener letras y espacios.';
    }

    if (!(telefono || '').trim())
      return 'El teléfono es obligatorio.';
    if (!/^\d{9}$/.test(telefono)) {
      return 'El teléfono debe contener exactamente 9 dígitos numéricos.';
    }

    if (!(username || '').trim()) return 'El nombre de usuario es obligatorio.';
    if (!usernameRegex.test(username)) {
      return 'El usuario debe tener entre 4 y 20 caracteres y solo usar letras, números, punto, guion o guion bajo.';
    }

    if (!(email || '').trim()) return 'El email es obligatorio.';
    if (!emailRegex.test(email)) return 'Ingresa un email válido.';

    if (!(password || '').trim()) return 'La contraseña es obligatoria.';
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (/\s/.test(password)) {
      return 'La contraseña no debe contener espacios.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe incluir al menos una letra mayúscula.';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe incluir al menos una letra minúscula.';
    }
    if (!/\d/.test(password)) {
      return 'La contraseña debe incluir al menos un número.';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'La contraseña debe incluir al menos un carácter especial.';
    }

    if (!(confirmPassword || '').trim())
      return 'La confirmación de contraseña es obligatoria.';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
    if (!(formUsuario.rol || '').trim()) return 'El rol es obligatorio.';

    return null;
  };

  const buildPayload = (form: baseForm) => {
    const payload = {
      nombre: form.nombre,
      apellidoPaterno: form.apellidoPaterno,
      apellidoMaterno: form.apellidoMaterno,
      telefono: form.telefono,
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
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefono: '',
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
