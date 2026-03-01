import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext';
import { postLogin } from '../Services/PostLogin';
import FormInput from '../../../Common/FormInput';

interface formLogin {
  username: string;
  password: string;
  rememberMe?: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  // Obtener la función login del contexto
  const { login, user } = useAuth();

  // Estados para el formulario, carga y errores (ANTES de cualquier return condicional)
  const [form, setForm] = useState<formLogin>({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Si ya está autenticado, redirigir a /main
  if (user) {
    return <Navigate to="/main" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir recarga de la página
    setErrorMsg(null);
    setIsLoading(true);

    try {
      // Llamar al servicio (backend)
      const data = await postLogin({
        username: form.username,
        password: form.password,
      });

      // La API devuelve { response: { token, expiracion, usuario } }
      const { token, expiracion, usuario } = data.response;

      // Actualizar el estado global usando el contexto
      login(token, expiracion, usuario, form.rememberMe || false);

      // Navegar explícitamente a /main tras el login exitoso
      navigate('/main');
      console.log(data);
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      setErrorMsg('Credenciales incorrectas o error en el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-md w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2 tracking-tight">
          Bienvenido de vuelta
        </h2>
        <p className="text-gray-400 text-sm">
          Inicia sesión en tu cuenta global para gestionar tu billetera, unirte
          a salas y apostar en cualquier juego.
        </p>
      </div>
      {/* Mostrar mensaje de error si existe */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-500 rounded text-sm text-center">
          {errorMsg}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleOnSubmit}>
        <FormInput
          icon={Mail}
          type="text"
          label="Nombre de usuario"
          placeholder="Tu nombre de usuario"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        <FormInput
          icon={Lock}
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              className="accent-orange-500"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
            />{' '}
            Recordarme
          </label>
          <a href="#" className="text-xs text-orange-500 hover:text-orange-400">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button
          className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded shadow-lg shadow-orange-600/20 uppercase tracking-widest transition-all hover:scale-[1.02]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-8">
        ¿No tienes una cuenta?{' '}
        <button
          onClick={() => navigate('/register')}
          className="text-white hover:text-orange-500 font-bold ml-1 transition-colors"
          type="button"
        >
          Regístrate aquí
        </button>
      </p>
    </div>
  );
};

export default Login;
