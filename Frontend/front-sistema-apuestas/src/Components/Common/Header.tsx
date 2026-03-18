import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  GraduationCap,
  Gift,
  Wallet,
  Eye,
  EyeOff,
  Plus,
  ChevronDown,
  LogOut,
  Settings,
  CircleUser,
  CircleDollarSign,
  Shield,
} from 'lucide-react';
import { type UserDto } from '../../Context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

interface HeaderProps {
  user: UserDto | null;
  showBalance: boolean;
  onToggleBalance: () => void;
  onOpenMobileMenu: () => void;
  onNavigateRecarga: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  showBalance,
  onToggleBalance,
  onOpenMobileMenu,
  onNavigateRecarga,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const rol = user?.rol?.toUpperCase() ?? '';
  const esControlAdmin = rol === 'SUPERADMIN';
  const esControlHost = rol === 'HOST';
  const mostrarBotonControl = esControlAdmin || esControlHost;
  const rutaControl = esControlAdmin ? '/main-admin' : '/main-host';

  // Cerrar el dropdown si se hace click fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-[#0b0c1b]/90 backdrop-blur-md z-40 shrink-0">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={onOpenMobileMenu}
        >
          <Menu size={24} />
        </button>
        <div className="hidden lg:flex items-center gap-2">
          <span className="font-black text-xl tracking-tighter">ARENA</span>
          <span className="font-black text-xl text-orange-500 tracking-tighter">
            DOTA 2
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <a
          href="https://discord.gg/fXeVtZYs"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-2 text-sm font-bold bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-[#5865F2]/20"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Comunidad
        </a>

        {mostrarBotonControl && (
          <button
            onClick={() => navigate(rutaControl)}
            className="hidden lg:flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-white transition-colors border border-orange-500/30 hover:border-orange-400/50 px-3 py-1.5 rounded-lg bg-orange-500/5 hover:bg-orange-500/10"
          >
            <Shield size={16} />
            {esControlAdmin ? 'Panel Admin' : 'Panel Host'}
          </button>
        )}

        {/* Saldos */}
        <div className="hidden md:flex items-center bg-[#1a1b2e] rounded-lg border border-white/5 p-1">
          <div className="px-3 py-1.5 flex items-center gap-2 border-r border-white/10">
            <Gift size={14} className="text-yellow-500" />
            <span className="text-sm font-bold text-yellow-500">
              {showBalance ? `${user?.saldoBono} PEN` : '***.** PEN'}
            </span>
            {/* 👇 LA NUEVA ESTRELLA: El Saldo de Recarga (Para jugar) 👇 */}
            <span className="text-blue-400 flex items-center gap-2 border-l border-white/10 pl-4">
              🎮 {(user?.saldoRecarga || 0).toFixed(2)} PEN
            </span>
          </div>
          <div className="px-3 py-1.5 flex items-center gap-2">
            <Wallet size={14} className="text-green-500" />
            <span className="text-sm font-bold text-green-500">
              {showBalance ? `${user?.saldoReal.toFixed(2)} PEN` : '***.** PEN'}
            </span>
            <button
              onClick={onToggleBalance}
              className="ml-1 text-gray-500 hover:text-white transition-colors"
            >
              {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
        </div>

        <button
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-orange-600/20 hover:scale-105"
          onClick={onNavigateRecarga}
        >
          Recargar <Plus size={16} />
        </button>

        {/* <button className="text-gray-400 hover:text-white relative transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}

        {/* Perfil */}
        <div
          className="relative flex items-center gap-3 pl-2 lg:pl-4 border-l border-white/5 cursor-pointer group"
          onClick={() => setShowDropdown(!showDropdown)}
          ref={dropdownRef}
        >
          <CircleUser className="w-10 h-10 rounded-lg object-cover border border-white/10 group-hover:border-orange-500/50 transition-colors" />
          <div className="hidden lg:block text-left">
            <p className="text-sm font-bold leading-tight">{user?.username}</p>
            <p className="text-[10px] text-gray-400 font-semibold tracking-widest">
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">
                MMR {user?.mmrDota || 'UNRANKED'}
              </span>
            </p>
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-500 group-hover:text-white hidden lg:block transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          />

          {/* Menú flotante (Dropdown) */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-4 w-48 bg-[#1a1b2e] border border-white/10 rounded-lg shadow-xl shadow-black/50 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-white/5 mb-2 lg:hidden">
                <p className="text-sm font-bold text-white">{user?.username}</p>
              </div>
              <NavLink
                to="/main/settings/cuenta"
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-left"
              >
                <Settings size={16} />
                Configuracion
              </NavLink>
              <NavLink
                to="/main/retiro"
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-green-400 transition-colors text-left"
              >
                <CircleDollarSign size={16} />
                Retirar
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-white/5 transition-colors text-left"
              >
                <LogOut size={16} />
                Desconectarse
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
