import React from 'react';
import { Trophy, Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import type { Game } from './types';

interface LayoutContext {
  selectedGame: Game;
}

const Home: React.FC = () => {
  const { selectedGame } = useOutletContext<LayoutContext>();

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
      <div className="flex items-center gap-8">
        <button className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full border border-orange-500 flex items-center justify-center group-hover:bg-orange-500 transition-all">
            <Trophy size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-wider uppercase border-b border-transparent group-hover:border-white transition-all">
            Ver Salas Activas{' '}
            <span className="text-gray-500 lowercase ml-1">o</span>
          </span>
        </button>
        <button className="flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded shadow-lg shadow-orange-600/20 uppercase tracking-widest transition-all hover:scale-105">
          <Plus size={18} /> Crear Sala
        </button>
      </div>
    </div>
  );
};

export default Home;
