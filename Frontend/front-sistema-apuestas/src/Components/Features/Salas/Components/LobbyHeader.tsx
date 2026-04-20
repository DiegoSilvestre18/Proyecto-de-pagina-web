import React from 'react';
import { Coins, Users } from 'lucide-react';
import { isAutoChess } from '../constants/formatos';
import type { Sala } from '../types/types';

interface LobbyHeaderProps {
  sala: Sala;
  puedeVerLobby?: boolean;
}

const LobbyHeader: React.FC<LobbyHeaderProps> = ({ sala, puedeVerLobby = false }) => {
  const maxJugadores = isAutoChess(sala.formato) ? 8 : sala.maxJugadores || 10;


  // 👇 Magia para la lista (A PRUEBA DE FALLOS Y MATEMÁTICA CORRECTA) 👇
  const premioReal = sala.premioARepartir ?? 0;
  const costoReal = sala.costo ?? 0;

  // Si es formato 5v5, el pozo se divide entre los 5 ganadores. Si es 1v1, no se divide.
  const es5v5 = sala.formato?.toUpperCase().includes('5V5');
  const divisor = es5v5 ? 5 : 1;

  const gananciaCalculada = premioReal > 0
    ? (premioReal / divisor)
    : (costoReal === 6 ? 10 : (costoReal === 11 ? 20 : costoReal * 2));

  let textoPremio = ""; // <--- ¡AQUÍ ESTÁ EL CAMBIO!

  if (isAutoChess(sala.formato)) {
    if (costoReal === 3) textoPremio = "🥇 1ro: S/ 12 | 🥈 2do: S/ 5 | 🥉 3ro: S/ 3";
    else if (costoReal === 5) textoPremio = "🥇 1ro: S/ 20 | 🥈 2do: S/ 10 | 🥉 3ro: S/ 6";
    else if (costoReal === 10) textoPremio = "🥇 1ro: S/ 40 | 🥈 2do: S/ 18 | 🥉 3ro: S/ 14";
    else if (costoReal === 15) textoPremio = "🥇 1ro: S/ 60 | 🥈 2do: S/ 24 | 🥉 3ro: S/ 20";
    else {
      // En Auto Chess el premioReal sí es el Pozo Total a repartir en el Top 3
      const pozoAutoChess = premioReal > 0 ? premioReal : costoReal * 2;
      textoPremio = `🏆 POZO S/ ${pozoAutoChess.toFixed(2)}`;
    }
  } else {
    // Para 5v5 normal o 1v1, muestra la ganancia individual
    textoPremio = `🏆 GANAS S/ ${gananciaCalculada.toFixed(2)} c/u`;
  }

  return (
    <div className="relative p-6 sm:p-8 border-b border-white/5 shrink-0 bg-[#0b0c1b] z-30">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20 opacity-50"></div>
      <div className="relative z-10 text-center">
        <span className="inline-block px-3 py-1 mb-3 text-xs font-black tracking-widest text-orange-400 bg-orange-500/10 rounded-full border border-orange-500/20 uppercase shadow-sm">
          {sala.juego} - {sala.formato}
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">
          Partida de <span className="text-orange-500">{sala.creador}</span>
        </h2>
        <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 mt-4 text-sm font-bold text-gray-400">

          {/* 1. Bloque de la Cuota (Ya lo tienes) */}
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg border border-white/5">
            <Coins size={18} className="text-yellow-500" /> Cuota:{' '}
            <span className="text-white">
              S/ {sala.costo?.toFixed(2) || '0.00'}
            </span>
          </div>

          {/* 👇 2. NUEVO BLOQUE DEL PREMIO (PÉGALO AQUÍ) 👇 */}
          <div className="flex items-center gap-2 bg-yellow-500/10 px-5 py-2 rounded-lg border border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)] transform transition-transform hover:scale-105">
            {textoPremio}
          </div>
          {/* 👆 FIN DEL BLOQUE DEL PREMIO 👆 */}

          {/* 3. Bloque de los Jugadores (Ya lo tienes) */}
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg border border-white/5">
            <Users size={18} className="text-blue-500" /> Jugadores:{' '}
            <span className="text-gray-300">
              {sala.participantes?.length || sala.jugadores || 0} /{' '}
              {maxJugadores}
            </span>
          </div>

        </div>

        {puedeVerLobby && sala.nombreLobby && sala.passwordLobby && (
          <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-3 bg-red-950/40 border border-red-500/30 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-widest uppercase text-red-300 font-black">
                Lobby:
              </span>
              <span className="text-sm font-mono text-white bg-black/50 px-3 py-1 rounded border border-red-500/20 select-all">
                {sala.nombreLobby}
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-red-500/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-widest uppercase text-red-300 font-black">
                Pass:
              </span>
              <span className="text-sm font-mono text-white bg-black/50 px-3 py-1 rounded border border-red-500/20 select-all">
                {sala.passwordLobby}
              </span>
            </div>
          </div>
        )}

        {sala.estado === 'ESPERANDO' && (
          <p className="mt-4 text-xs text-yellow-300/80 font-semibold tracking-wide bg-yellow-500/10 inline-block px-4 py-1.5 rounded-full border border-yellow-500/20">
            Si la sala no se llena en 8 minutos, puedes retirarte y solicitar reembolso.
          </p>
        )}
      </div>
    </div>
  );
};

export default LobbyHeader;
