import React from 'react';
import { Filter } from 'lucide-react';

interface SalasFiltersProps {
  filtrosModos: string[];
}

const SalasFilters: React.FC<SalasFiltersProps> = ({ filtrosModos }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {filtrosModos.map((modo, index) => (
        <button
          key={index}
          className="px-4 py-1.5 bg-[#141526] hover:bg-white/10 border border-white/5 rounded-full text-xs font-semibold text-gray-300 hover:text-white transition-colors"
        >
          {modo}
        </button>
      ))}
      <div className="w-px h-6 bg-white/10 mx-2"></div>
      <button className="flex items-center gap-2 px-4 py-1.5 bg-transparent hover:bg-white/5 border border-transparent rounded-full text-xs font-semibold text-gray-300 hover:text-white transition-colors">
        <Filter size={14} /> FILTROS
      </button>
    </div>
  );
};

export default SalasFilters;
