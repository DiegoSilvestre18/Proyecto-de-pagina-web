import React from 'react';
import { useAuth } from '../../../../Context/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="animate-in fade-in duration-500 pb-20 px-4 lg:px-12 pt-8 max-w-[1600px] mx-auto">
      <h2 className="text-3xl font-black tracking-tight text-white mb-6">
        Configuración
      </h2>

      <div className="bg-[#141526] border border-white/5 rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-4">Perfil</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Usuario
              </label>
              <p className="text-white font-semibold">{user?.username}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Correo</label>
              <p className="text-white font-semibold">{user?.email}</p>
            </div>
          </div>
        </div>

        <hr className="border-white/5" />

        <div>
          <h3 className="text-lg font-bold mb-4">Saldos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a1b2e] rounded-lg p-4 border border-white/5">
              <p className="text-sm text-gray-400 mb-1">Saldo Real</p>
              <p className="text-2xl font-black text-green-500">
                {user?.saldoReal.toFixed(2)} PEN
              </p>
            </div>
            <div className="bg-[#1a1b2e] rounded-lg p-4 border border-white/5">
              <p className="text-sm text-gray-400 mb-1">Saldo Bono</p>
              <p className="text-2xl font-black text-yellow-500">
                {user?.saldoBono} PEN
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
