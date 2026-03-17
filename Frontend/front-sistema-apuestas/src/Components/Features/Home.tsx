import React from 'react';
import { Trophy, Plus, Users } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import type { Game } from './types';

interface LayoutContext {
  selectedGame: Game;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { selectedGame } = useOutletContext<LayoutContext>();
  const { user, gameAccounts } = useAuth();
  const hasLinkedAccount = gameAccounts.length > 0;

  return (
    <div className="animate-in fade-in slide-in-from-left-8 duration-700">
      <h2 className="text-3xl font-bold text-orange-500 tracking-wider mb-0 italic">
        {selectedGame.tagline}
      </h2>
      <h1 className="text-7xl font-black mb-6 leading-none tracking-tight">
        {selectedGame.title}
      </h1>
      <p className="text-lg text-gray-300 max-w-lg mb-10 leading-relaxed font-light">
        {selectedGame.description}
      </p>
      {!user ? (
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded shadow-lg shadow-orange-600/20 uppercase tracking-widest transition-all hover:scale-105"
          >
            <Plus size={18} /> Crear Cuenta
          </button>
          <a
            href="https://discord.gg/hVNmHUqy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold rounded uppercase tracking-widest transition-all"
          >
            <Users size={18} /> Unirse a Discord
          </a>
        </div>
      ) : hasLinkedAccount ? (
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate('/main/salas')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full border border-orange-500 flex items-center justify-center group-hover:bg-orange-500 transition-all">
              <Trophy size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-wider uppercase border-b border-transparent group-hover:border-white transition-all">
              Ver salas activas
            </span>
          </button>
          <a
            href="https://discord.gg/hVNmHUqy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold rounded uppercase tracking-widest transition-all"
          >
            <Users size={18} /> Comunidad Discord
          </a>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate('/main/settings/integraciones')}
            className="flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded shadow-lg shadow-orange-600/20 uppercase tracking-widest transition-all hover:scale-105"
          >
            <Plus size={18} /> Vincular Cuenta de Juego
          </button>
          <a
            href="https://discord.gg/hVNmHUqy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold rounded uppercase tracking-widest transition-all"
          >
            <Users size={18} /> Soporte en Discord
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;
