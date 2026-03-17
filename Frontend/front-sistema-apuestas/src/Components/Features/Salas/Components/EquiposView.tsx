import React from 'react';
import { Swords, Users, UserPlus } from 'lucide-react';
import type { Sala } from '../types/types';

interface EquiposViewProps {
  sala: Sala;
}

const EquiposView: React.FC<EquiposViewProps> = ({ sala }) => {
  const jugadoresEquipo1 =
    sala.participantes?.filter((p) => p.equipo === 'EQUIPO1') || [];
  const jugadoresEquipo2 =
    sala.participantes?.filter((p) => p.equipo === 'EQUIPO2') || [];

  return (
    <div className="flex flex-col md:flex-row gap-8 relative animate-in fade-in duration-300">
      {/* Icono VS en el medio (Solo visible en Desktop) */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#0b0c1b] border border-white/10 rounded-full items-center justify-center z-10 shadow-lg shadow-black">
        <Swords size={20} className="text-orange-500" />
      </div>

      {/* EQUIPO 1 (Radiant / Azul) */}
      <div className="flex-1 space-y-2">
        <h3 className="text-center font-black text-blue-400 tracking-widest uppercase mb-4 text-sm border-b border-blue-500/20 pb-2">
          Radiant / Atacantes
        </h3>
        {[0, 1, 2, 3, 4].map((index) => {
          const jugador = jugadoresEquipo1[index];
          return (
            <div
              key={`eq1-${index}`}
              className={`flex items-center gap-3 p-3 rounded-lg border ${jugador ? 'bg-blue-900/20 border-blue-500/30' : 'bg-[#0b0c1b] border-white/5 border-dashed'}`}
            >
              <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                {jugador ? (
                  <Users size={16} />
                ) : (
                  <UserPlus size={16} className="opacity-30" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p
                  className={`text-sm font-bold truncate ${jugador ? 'text-white' : 'text-gray-600'}`}
                >
                  {jugador ? jugador.steamName : 'Esperando jugador...'}
                </p>
                {jugador && (
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                    Usuario: {jugador.username}
                  </p>
                )}
                {jugador?.mmr && (
                  <p className="text-[10px] text-orange-400 truncate mt-0.5 font-semibold">
                    MMR: {jugador.mmr}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ICONO DE ESPADAS (Móvil) */}
      <div className="flex items-center justify-center px-2 md:hidden">
        <div className="w-10 h-10 rounded-full bg-[#1a1b2e] border border-white/5 flex items-center justify-center shadow-lg z-10">
          <Swords size={20} className="text-orange-500" />
        </div>
      </div>

      {/* EQUIPO 2 (Dire / Rojo) */}
      <div className="flex-1 space-y-2">
        <h3 className="text-center font-black text-red-400 tracking-widest uppercase mb-4 text-sm border-b border-red-500/20 pb-2">
          Dire / Defensores
        </h3>
        {[0, 1, 2, 3, 4].map((index) => {
          const jugador = jugadoresEquipo2[index];
          return (
            <div
              key={`eq2-${index}`}
              className={`flex items-center gap-3 p-3 rounded-lg border ${jugador ? 'bg-red-900/20 border-red-500/30' : 'bg-[#0b0c1b] border-white/5 border-dashed'}`}
            >
              <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                {jugador ? (
                  <Users size={16} />
                ) : (
                  <UserPlus size={16} className="opacity-30" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p
                  className={`text-sm font-bold truncate ${jugador ? 'text-white' : 'text-gray-600'}`}
                >
                  {jugador ? jugador.steamName : 'Esperando jugador...'}
                </p>
                {jugador && (
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                    Usuario: {jugador.username}
                  </p>
                )}
                {jugador?.mmr && (
                  <p className="text-[10px] text-orange-400 truncate mt-0.5 font-semibold">
                    MMR: {jugador.mmr}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquiposView;
