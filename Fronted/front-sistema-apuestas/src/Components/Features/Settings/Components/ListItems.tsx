import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../../Context/AuthContext';

interface ListItemsProps {
  info: string;
  toggleSection: () => void;
  sections: boolean;
}

export const ListItems: React.FC<ListItemsProps> = ({
  info,
  toggleSection,
  sections,
}) => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      {/* SECCIÓN 1: Información de la cuenta */}
      <div className="border-b border-white/5 pb-2">
        <button
          onClick={toggleSection}
          className="w-full flex justify-between items-center py-4 text-left group"
        >
          <h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">
            {info}
          </h3>
          {sections ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </button>

        {sections && (
          <div className="space-y-6 pb-6 animate-in slide-in-from-top-2">
            {/* Apodo */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white mb-1">Username</p>
                <p className="text-sm text-gray-400">{user?.username}</p>
              </div>
              <button className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors">
                Editar
              </button>
            </div>

            <div className="h-px w-full bg-white/5"></div>

            {/* Correo */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white mb-1">Nombre</p>
                <p className="text-sm text-gray-400">{user?.nombre}</p>
              </div>
              <button className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors">
                Editar
              </button>
            </div>

            <div className="h-px w-full bg-white/5"></div>

            {/* Idioma */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white mb-1">Apellido Paterno</p>
                <p className="text-sm text-gray-400">{user?.apellidoPaterno}</p>
              </div>
              <button className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors">
                Editar
              </button>
            </div>

            <div className="h-px w-full bg-white/5"></div>

            {/* Zona horaria */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white mb-1">Apellido Materno</p>
                <p className="text-sm text-gray-400">{user?.apellidoMaterno}</p>
              </div>
              <button className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors">
                Editar
              </button>
            </div>

            <div className="h-px w-full bg-white/5"></div>

            {/* Zona horaria */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white mb-1">Contraseña</p>
                <p className="text-sm text-gray-400">••••••••</p>
              </div>
              <button className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors">
                Editar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
