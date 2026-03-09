import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Search,
  Play,
  Crosshair,
  Trophy,
  Gamepad2,
  Users,
  Wallet,
  Settings,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
    isActive
      ? 'bg-orange-600/10 text-orange-500'
      : 'text-gray-400 hover:bg-white/5 hover:text-white'
  }`;

const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  onCloseMobileMenu,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { pathname } = useLocation();
  const settingsActive = pathname.startsWith('/main/settings');
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 ${isCollapsed ? 'w-[72px]' : 'w-64'} bg-[#0f1021] border-r border-white/5 flex flex-col transition-all duration-300 ${
        isMobileMenuOpen
          ? 'translate-x-0'
          : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Logo */}
      <div
        className={`${isCollapsed ? 'px-4 py-6' : 'p-6'} flex items-center justify-between`}
      >
        <NavLink
          to="/main"
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
          onClick={onCloseMobileMenu}
        >
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center group-hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20 shrink-0">
            <span className="font-bold text-xs italic text-white">A</span>
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-black tracking-tighter leading-none text-white">
              ARENA
            </h1>
          )}
        </NavLink>
        <button className="lg:hidden text-gray-400" onClick={onCloseMobileMenu}>
          <X size={20} />
        </button>
      </div>

      {/* Botón colapsar */}
      <div className="px-4 mb-2 hidden lg:block">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm"
          title={isCollapsed ? 'Expandir sidebar' : 'Minimizar sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
          {!isCollapsed && <span className="font-semibold">Minimizar</span>}
        </button>
      </div>

      {/* Búsqueda */}
      {!isCollapsed && (
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
      )}

      {/* Navegación */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <NavLink
          to="/main"
          end
          className={navLinkClass}
          onClick={onCloseMobileMenu}
          title="Inicio"
        >
          <Play size={18} className="shrink-0" /> {!isCollapsed && 'Inicio'}
        </NavLink>
        <NavLink
          to="/main/salas"
          className={navLinkClass}
          onClick={onCloseMobileMenu}
          title="Salas de Apuestas"
        >
          <Crosshair size={18} className="shrink-0" />{' '}
          {!isCollapsed && 'Salas de Apuestas'}
        </NavLink>
        <NavLink
          to="/main/recarga"
          className={navLinkClass}
          onClick={onCloseMobileMenu}
          title="Solicitar Recarga"
        >
          <Wallet size={18} className="shrink-0" />{' '}
          {!isCollapsed && 'Solicitar Recarga'}
        </NavLink>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm font-semibold"
          title="Torneos"
        >
          <Trophy size={18} className="shrink-0" /> {!isCollapsed && 'Torneos'}
        </button>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm font-semibold"
          title="Mi Rango"
        >
          <Gamepad2 size={18} className="shrink-0" />{' '}
          {!isCollapsed && 'Mi Rango'}
        </button>

        {!isCollapsed && (
          <div className="pt-6 pb-2">
            <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase px-3">
              Comunidad
            </p>
          </div>
        )}
        {isCollapsed && <div className="pt-4 border-t border-white/5 mt-4" />}
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm font-semibold"
          title="Clubes y Clanes"
        >
          <Users size={18} className="shrink-0" />{' '}
          {!isCollapsed && 'Clubes y Clanes'}
        </button>

        {!isCollapsed && (
          <div className="pt-6 pb-2">
            <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase px-3">
              Cuenta
            </p>
          </div>
        )}
        {isCollapsed && <div className="pt-4 border-t border-white/5 mt-4" />}
        <NavLink
          to="/main/settings/cuenta"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            settingsActive
              ? 'bg-orange-600/10 text-orange-500'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
          onClick={onCloseMobileMenu}
          title="Configuración"
        >
          <Settings size={18} className="shrink-0" />{' '}
          {!isCollapsed && 'Configuración'}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
