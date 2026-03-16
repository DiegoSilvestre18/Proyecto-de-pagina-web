import React from 'react';
import { Coins, Users } from 'lucide-react';
import { isAutoChess } from '../constants/formatos';
import type { Sala } from '../types/types';

interface LobbyHeaderProps {
  sala: Sala;
}

const LobbyHeader: React.FC<LobbyHeaderProps> = ({ sala }) => {
  const maxJugadores = isAutoChess(sala.formato) ? 8 : sala.maxJugadores || 10;

  return (
    <div className="relative p-6 border-b border-white/5 shrink-0 bg-[#0b0c1b] z-30">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20 opacity-50"></div>
      <div className="relative z-10 text-center">
        <span className="inline-block px-3 py-1 mb-2 text-xs font-black tracking-widest text-orange-400 bg-orange-500/10 rounded-full border border-orange-500/20 uppercase">
          {sala.juego} - {sala.formato}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">
          Partida de <span className="text-orange-500">{sala.creador}</span>
        </h2>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm font-bold text-gray-400">
          <div className="flex items-center gap-2">
            <Coins size={16} className="text-yellow-500" /> Cuota:{' '}
            <span className="text-white">
              S/ {sala.costo?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-500" /> Jugadores:{' '}
            <span className="text-gray-400">
              {sala.participantes?.length || sala.jugadores || 0} /{' '}
              {maxJugadores}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyHeader;
