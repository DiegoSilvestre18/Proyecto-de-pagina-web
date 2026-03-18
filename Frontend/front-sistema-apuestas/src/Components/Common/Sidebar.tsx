import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Search,
  Play,
  Crosshair,
  Wallet,
  Settings,
  X,
  Shield, // 👇 1. Agregamos el ícono del escudo
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import Logo from '../../assets/Logo.png';

// 👇 2. Importa tu useAuth (asegúrate de que la ruta sea correcta hacia tu AuthContext)
import { useAuth } from '../../Context/AuthContext';

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
  // 👇 3. Extraemos el usuario para saber su rol
  const { user } = useAuth();

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
          <img
              src="/logoArena.png" // Apuntamos directamente a public/logo_arenagamer.png
              alt="Arena Gamer GG"
              // Ajustamos h-10 w-auto para que el logo se vea legible con su texto
              // Quitamos 'rounded' y 'object-cover' que no sirven para un logo con texto
              className="h-10 w-auto object-contain shrink-0"
            />
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
        {/* 👇 4. SECCIÓN EXCLUSIVA PARA EL ADMIN 👇 */}
        {user?.rol === 'SUPERADMIN' && !isCollapsed && (
          <>
            <div className="pt-6 pb-2">
              <p className="text-[10px] font-bold text-orange-500 tracking-widest uppercase px-3">
                Administración
              </p>
            </div>
            <NavLink
              to="/main-admin" /* <--- Ajusta esta ruta si tu panel de admin tiene otra URL */
              className={navLinkClass}
              onClick={onCloseMobileMenu}
            >
              <Shield size={18} /> Panel de Control
            </NavLink>
          </>
        )}
        {user?.rol === 'SUPERADMIN' && isCollapsed && (
          <>
            <NavLink
              to="/main-admin" /* <--- Ajusta esta ruta si tu panel de admin tiene otra URL */
              className={navLinkClass}
              onClick={onCloseMobileMenu}
            >
              <Shield size={18} />
            </NavLink>
          </>
        )}
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
          title="Salas Competitivas"
        >
          <Crosshair size={18} className="shrink-0" />{' '}
          {!isCollapsed && 'Salas Competitivas'}
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
