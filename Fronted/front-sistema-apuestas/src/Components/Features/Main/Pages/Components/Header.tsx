import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  GraduationCap,
  Gift,
  Wallet,
  Eye,
  EyeOff,
  Plus,
  Bell,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { type UserDto } from '../../../../../Context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../Context/AuthContext';

interface HeaderProps {
  user: UserDto | null;
  showBalance: boolean;
  onToggleBalance: () => void;
  onOpenMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  showBalance,
  onToggleBalance,
  onOpenMobileMenu,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

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
        <button className="hidden lg:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
          <GraduationCap size={18} /> Cómo Jugar
        </button>

        {/* Saldos */}
        <div className="hidden md:flex items-center bg-[#1a1b2e] rounded-lg border border-white/5 p-1">
          <div className="px-3 py-1.5 flex items-center gap-2 border-r border-white/10">
            <Gift size={14} className="text-yellow-500" />
            <span className="text-sm font-bold text-yellow-500">
              {showBalance ? `${user?.saldoBono} PEN` : '***.** PEN'}
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

        <NavLink
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-orange-600/20 hover:scale-105"
          to="/solicitud-recarga"
        >
          Recargar <Plus size={16} />
        </NavLink>

        <button className="text-gray-400 hover:text-white relative transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Perfil */}
        <div
          className="relative flex items-center gap-3 pl-2 lg:pl-4 border-l border-white/5 cursor-pointer group"
          onClick={() => setShowDropdown(!showDropdown)}
          ref={dropdownRef}
        >
          <img
            src={'link'}
            alt="Avatar"
            className="w-10 h-10 rounded-lg object-cover border border-white/10 group-hover:border-orange-500/50 transition-colors"
          />
          <div className="hidden lg:block text-left">
            <p className="text-sm font-bold leading-tight">{user?.username}</p>
            <p className="text-[10px] text-gray-400 font-semibold tracking-widest">
              MMR <span className="text-white">{'mmr'}</span>
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
                <p className="text-sm font-bold text-white">
                  {'user?.username'}
                </p>
                <p className="text-xs text-gray-400">MMR: {'user?.mmr'}</p>
              </div>
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
