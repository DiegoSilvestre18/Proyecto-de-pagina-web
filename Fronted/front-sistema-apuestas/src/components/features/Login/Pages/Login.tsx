import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../../common/FormInput';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

      <form
        className="space-y-4"
        onSubmit={(e: React.FormEvent) => e.preventDefault()}
      >
        <FormInput
          icon={Mail}
          type="email"
          label="Correo Electrónico"
          placeholder="tu@email.com"
          name="email"
          value={form.email}
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
            <input type="checkbox" className="accent-orange-500" /> Recordarme
          </label>
          <a href="#" className="text-xs text-orange-500 hover:text-orange-400">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded shadow-lg shadow-orange-600/20 uppercase tracking-widest transition-all hover:scale-[1.02]">
          Iniciar Sesión
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-8">
        ¿No tienes una cuenta?{' '}
        <button
          onClick={() => navigate('/register')}
          className="text-white hover:text-orange-500 font-bold ml-1 transition-colors"
        >
          Regístrate aquí
        </button>
      </p>
    </div>
  );
};

export default Login;
