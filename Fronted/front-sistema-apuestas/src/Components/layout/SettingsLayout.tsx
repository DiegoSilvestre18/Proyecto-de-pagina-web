import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const SettingsLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cuenta');
  const tabs = [
    { id: 'cuenta', label: 'Cuenta', url: '/main/settings/cuenta' },
    {
      id: 'verificacion',
      label: 'Verificación',
      url: '/main/settings/verificacion',
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      url: '/main/settings/notificaciones',
    },
    { id: 'juego', label: 'Ajustes de juego', url: '/main/settings/juego' },
    {
      id: 'suscripciones',
      label: 'Suscripciones',
      url: '/main/settings/suscripciones',
    },
    {
      id: 'integraciones',
      label: 'Integraciones',
      url: '/main/settings/integraciones',
    },
    { id: 'privacidad', label: 'Privacidad', url: '/main/settings/privacidad' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-full animate-in fade-in duration-500">
      {/* Navegación Interna (Inner Sidebar estilo Faceit) */}
      <div className="w-full md:w-72 md:border-r border-white/5 p-4 md:p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-shrink-0">
        {/* Mini Perfil */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center text-xl font-black shadow-lg">
            <h1>D</h1>
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-tight">
              <h2>Diego</h2>
            </div>
            <button className="text-xs text-gray-400 flex items-center gap-1 mt-1 hover:text-white transition-colors">
              Editar perfil <Edit2 size={10} />
            </button>
          </div>
        </div>

        {/* Lista de Pestañas */}
        <nav className="flex flex-col gap-1">
          {tabs.map((tab) => (
            <NavLink
              to={tab.url}
              key={tab.id}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white border-l-4 border-orange-600'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-4 border-transparent'
              }`}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex-1 p-4 md:p-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
