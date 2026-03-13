import React from 'react';
import { Crosshair, Plus } from 'lucide-react';

interface SalasHeaderProps {
  userRol?: string;
  onOpenModal: () => void;
}

const SalasHeader: React.FC<SalasHeaderProps> = ({ userRol, onOpenModal }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/5 pb-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-orange-600/20 rounded flex items-center justify-center">
            <Crosshair size={18} className="text-orange-500" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Salas de Apuestas
          </h2>
        </div>
        <p className="text-gray-400 text-sm max-w-2xl">
          Descubre salas activas para apostar tus créditos. Únete a un duelo 1v1
          o arma tu equipo para partidas 5v5.
        </p>
      </div>

      {/* Botón dinámico según el rol */}
      {userRol === 'SUPERADMIN' || userRol === 'HOST' ? (
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 bg-[#1a1b2e] border border-white/10 hover:border-orange-500 hover:bg-[#22233b] text-white px-6 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap"
        >
          <Plus size={16} className="text-orange-500" /> CREAR SALA
        </button>
      ) : (
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 bg-[#1a1b2e] border border-white/10 hover:border-orange-500 hover:bg-[#22233b] text-white px-6 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap"
        >
          <Plus size={16} className="text-orange-500" /> SOLICITAR SALA
        </button>
      )}
    </div>
  );
};

export default SalasHeader;
