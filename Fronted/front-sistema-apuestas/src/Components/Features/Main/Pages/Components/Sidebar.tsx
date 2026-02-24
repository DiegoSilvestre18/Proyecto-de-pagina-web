import React from 'react';
import {
  Search,
  Play,
  Crosshair,
  Trophy,
  Gamepad2,
  Users,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  isMobileMenuOpen: boolean;
  onChangeView: (view: string) => void;
  onCloseMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  isMobileMenuOpen,
  onChangeView,
  onCloseMobileMenu,
}) => {
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f1021] border-r border-white/5 flex flex-col transition-transform duration-300 ${
        isMobileMenuOpen
          ? 'translate-x-0'
          : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onChangeView('dashboard')}
        >
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center group-hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20">
            <span className="font-bold text-xs italic text-white">A</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter leading-none text-white">
            ARENA
          </h1>
        </div>
        <button className="lg:hidden text-gray-400" onClick={onCloseMobileMenu}>
          <X size={20} />
        </button>
      </div>

      {/* Búsqueda */}
      <div className="px-4 mb-6">
        <div className="bg-[#1a1b2e] rounded-lg flex items-center px-3 py-2 border border-white/5 focus-within:border-orange-500/50 transition-colors">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Búsqueda..."
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <button
          onClick={() => onChangeView('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            activeView === 'dashboard'
              ? 'bg-orange-600/10 text-orange-500'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Play size={18} /> Inicio
        </button>
        <button
          onClick={() => onChangeView('salas')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            activeView === 'salas'
              ? 'bg-orange-600/10 text-orange-500'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Crosshair size={18} /> Salas de Apuestas
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm font-semibold">
          <Trophy size={18} /> Torneos
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm font-semibold">
          <Gamepad2 size={18} /> Mi Rango
        </button>

        <div className="pt-6 pb-2">
          <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase px-3">
            Comunidad
          </p>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm font-semibold">
          <Users size={18} /> Clubes y Clanes
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
