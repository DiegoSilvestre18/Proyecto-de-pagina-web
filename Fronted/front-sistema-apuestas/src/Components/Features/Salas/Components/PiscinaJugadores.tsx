import React from 'react';
import { Crown, Shield, Users, UserPlus } from 'lucide-react';
import type { Sala } from '../types/types';

interface PiscinaJugadoresProps {
  sala: Sala;
  userRol?: string;
  userId?: number;
}

const PiscinaJugadores: React.FC<PiscinaJugadoresProps> = ({
  sala,
  userRol,
  userId,
}) => {
  return (
    <div className="flex flex-col gap-6 relative animate-in fade-in duration-300">
      {/* PANEL VIP DEL ADMIN (EL OJO SUPREMO) */}
      {userRol === 'SUPERADMIN' && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Shield className="text-orange-500" size={24} />
            </div>
            <div>
              <h4 className="text-orange-500 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                Ojo Supremo{' '}
                <span className="text-[10px] bg-orange-500 text-black px-2 py-0.5 rounded-sm">
                  ADMIN
                </span>
              </h4>
              <p className="text-xs text-orange-400/80 mt-0.5">
                Modo Espectador. Esperando a que se llene la sala. Puedes forzar
                líderes manualmente.
              </p>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-center font-black text-white tracking-widest uppercase text-sm border-b border-white/10 pb-3 mt-2">
        Piscina de Jugadores
      </h3>

      {/* GRID ÚNICA DE 10 ESPACIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
          const jugador = sala.participantes?.[index];

          // Lógica de Capitanes Corregida
          const idDelJugador = jugador?.id || jugador?.id;

          const isCapitan1 =
            sala.capitan1Id != null &&
            idDelJugador != null &&
            sala.capitan1Id === idDelJugador;
          const isCapitan2 =
            sala.capitan2Id != null &&
            idDelJugador != null &&
            sala.capitan2Id === idDelJugador;
          const isCapitan = isCapitan1 || isCapitan2;

          // ¿El usuario que está viendo el modal es un capitán?
          const soyCapitan =
            userId != null &&
            (userId === sala.capitan1Id || userId === sala.capitan2Id);

          // ¿Le toca elegir a este capitán? (Por ahora lo dejamos en true para probar)
          // const esMiTurno = sala.turnoId === userId;
          const esMiTurno = true;

          return (
            <div
              key={`pool-${index}`}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                jugador
                  ? isCapitan
                    ? 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                    : jugador.equipo && jugador.equipo !== 'ESPERANDO_DRAFT' // Si ya tiene equipo, lo marcamos
                      ? jugador.equipo === 'EQUIPO1'
                        ? 'bg-blue-500/5 border-blue-500/20 opacity-60'
                        : 'bg-red-500/5 border-red-500/20 opacity-60'
                      : 'bg-[#1a1b2e] border-white/10'
                  : 'bg-[#0b0c1b] border-white/5 border-dashed'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar / Ícono */}
                <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-gray-400 relative">
                  {jugador ? (
                    <Users
                      size={18}
                      className={
                        isCapitan
                          ? 'text-yellow-500'
                          : jugador.equipo === 'EQUIPO1'
                            ? 'text-blue-500'
                            : jugador.equipo === 'EQUIPO2'
                              ? 'text-red-500'
                              : ''
                      }
                    />
                  ) : (
                    <UserPlus size={18} className="opacity-30" />
                  )}

                  {/* 👑 Corona de Líder */}
                  {jugador && isCapitan && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full p-1 shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-bounce">
                      <Crown size={12} fill="currentColor" />
                    </div>
                  )}
                </div>

                {/* Datos del Jugador */}
                <div className="flex-1 overflow-hidden">
                  <p
                    className={`text-sm font-bold truncate ${
                      jugador
                        ? isCapitan
                          ? 'text-yellow-400'
                          : 'text-white'
                        : 'text-gray-600'
                    }`}
                  >
                    {jugador
                      ? jugador.username // Muestra el username real
                      : 'Esperando jugador...'}
                  </p>
                  {jugador && (
                    <p className="text-[10px] text-gray-400 truncate mt-0.5 uppercase tracking-tighter">
                      {isCapitan
                        ? 'Capitán de Equipo'
                        : jugador.equipo && jugador.equipo !== 'ESPERANDO_DRAFT'
                          ? `Elegido por ${jugador.equipo}`
                          : 'Disponible para Draft'}
                    </p>
                  )}
                </div>
              </div>

              {/* ACCIONES DE DRAFT */}
              <div className="flex gap-2">
                {/* 1. Botón para el CAPITÁN: Reclutar jugador */}
                {soyCapitan &&
                  esMiTurno &&
                  jugador &&
                  jugador.equipo === 'ESPERANDO_DRAFT' && // Solo si está libre
                  !isCapitan && (
                    <button
                      onClick={() =>
                        alert(`Reclutando a ${jugador.username}...`)
                      } // handlePickPlayer(idDelJugador)
                      className="text-[10px] bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded transition-all font-black uppercase shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                    >
                      Reclutar
                    </button>
                  )}

                {/* 2. Botón para el ADMIN: Forzar Líder */}
                {userRol === 'SUPERADMIN' && jugador && !isCapitan && (
                  <button className="text-[10px] bg-[#0b0c1b] hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-500 border border-white/10 hover:border-yellow-500/30 px-3 py-1.5 rounded transition-colors font-bold uppercase tracking-wider">
                    Forzar Líder
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PiscinaJugadores;
