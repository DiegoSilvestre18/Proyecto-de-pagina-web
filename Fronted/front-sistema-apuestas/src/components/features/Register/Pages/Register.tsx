import React from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../../../Hooks/useRegister';
import { postUser } from '../Services/ServiceRegister';
import FormInput from '../../../Common/FormInput';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { formUsuario, handleFormUsuario, handleSubmit } = useRegister('USER');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error, payload } = handleSubmit();
    if (error || !payload) {
      alert(error);
      return;
    }
    console.log('payload a enviar', payload);
    await postUser(payload);
    navigate('/');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-md w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2 tracking-tight">
          Crea tu cuenta global
        </h2>
        <p className="text-gray-400 text-sm">
          Una sola cuenta para recargar créditos, apostar y competir en todos
          tus juegos favoritos.
        </p>
      </div>

      <form className="space-y-2" onSubmit={onSubmit}>
        <FormInput
          icon={User}
          type="text"
          label="Nombre de Usuario"
          placeholder="Tu nick name"
          name="username"
          value={formUsuario.username}
          onChange={handleFormUsuario}
        />
        <FormInput
          icon={Mail}
          type="email"
          label="Correo Electrónico"
          placeholder="tu@email.com"
          name="email"
          value={formUsuario.email}
          onChange={handleFormUsuario}
        />
        <FormInput
          icon={Lock}
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          name="password"
          value={formUsuario.password}
          onChange={handleFormUsuario}
        />
        <FormInput
          icon={Lock}
          type="password"
          label="Confirmar Contraseña"
          placeholder="••••••••"
          name="confirmPassword"
          value={formUsuario.confirmPassword}
          onChange={handleFormUsuario}
        />

        <div className="flex items-start gap-2 text-xs text-gray-400 mt-4 mb-6">
          <input
            type="checkbox"
            className="accent-orange-500 mt-1 cursor-pointer"
            required
          />
          <span>
            Acepto los{' '}
            <a href="#" className="text-orange-500 hover:underline">
              Términos de Servicio
            </a>{' '}
            y la{' '}
            <a href="#" className="text-orange-500 hover:underline">
              Política de Privacidad
            </a>
            .
          </span>
        </div>

        <button
          className="w-full py-4 bg-white text-black hover:bg-gray-200 font-bold rounded shadow-lg uppercase tracking-widest transition-all hover:scale-[1.02]"
          type="submit"
        >
          Crear Cuenta
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-8">
        ¿Ya tienes una cuenta?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-white hover:text-orange-500 font-bold ml-1 transition-colors"
        >
          Inicia sesión
        </button>
      </p>
    </div>
  );
};

export default Register;
