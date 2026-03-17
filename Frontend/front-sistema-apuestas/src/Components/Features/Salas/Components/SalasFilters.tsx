import React from 'react';

interface SalasFiltersProps {
  filtroEstado: string;
  onFiltroEstadoChange: (estado: string) => void;
}

const SalasFilters: React.FC<SalasFiltersProps> = ({
  filtroEstado,
  onFiltroEstadoChange,
}) => {
  return (
    <div className="flex gap-2 bg-[#0b0c1b] p-1 rounded-full border border-white/5 overflow-x-auto mb-6">
      <button
        onClick={() => onFiltroEstadoChange('TODAS')}
        className={`px-4 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filtroEstado === 'TODAS' ? 'bg-white/20 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
      >
        Todas
      </button>
      <button
        onClick={() => onFiltroEstadoChange('ESPERANDO')}
        className={`px-4 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filtroEstado === 'ESPERANDO' ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
      >
        En Espera
      </button>
      <button
        onClick={() => onFiltroEstadoChange('EN_CURSO')}
        className={`px-4 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filtroEstado === 'EN_CURSO' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
      >
        En Curso
      </button>
      <button
        onClick={() => onFiltroEstadoChange('FINALIZADA')}
        className={`px-4 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filtroEstado === 'FINALIZADA' ? 'bg-red-500/20 text-red-500 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
      >
        Finalizadas
      </button>
    </div>
  );
};

export default SalasFilters;
