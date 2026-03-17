import React from 'react';
import { Crown, Shield, Users, UserPlus } from 'lucide-react';
import type { Sala } from '../types/types';
import { forzarCapitanAdmin } from '../Services/ServiceSalas';
import { expulsarUsuarioSala } from '../Services/ServiceSalas';

interface PiscinaJugadoresProps {
  sala: Sala;
  userRol?: string;
  userId?: number;
  soyCapitanGlobal?: boolean;
  jugadorConTurno?: { username: string } | null;
  onLanzarMoneda?: () => void;
  onPickPlayer?: (jugadorId: number) => void;
  onActualizarSala?: () => void;
}

const PiscinaJugadores: React.FC<PiscinaJugadoresProps> = ({
  sala,
  userRol,
  userId,
  soyCapitanGlobal,
  jugadorConTurno,
  onLanzarMoneda,
  onPickPlayer,
  onActualizarSala,
}) => {
  const isAutoChess = sala.formato === 'Auto Chess';
  const esMiTurno = sala.turnoId === userId;
  const totalSlots = isAutoChess ? 8 : sala.maxJugadores || 10;

  return (
    <div className="flex flex-col gap-6 relative animate-in fade-in duration-300">
      {/* BANNER DE SORTEO */}
      {sala.estado === 'SORTEO' && (
        <div className="bg-gradient-to-r from-orange-900/40 via-[#1a1b2e] to-purple-900/40 border border-orange-500/30 rounded-xl p-6 text-center relative overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.1)]">
          <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2 flex items-center justify-center gap-3">
            ¡Hora del Sorteo!
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            La moneda decidira que capitan tiene el primer turno para reclutar.
          </p>
          {soyCapitanGlobal ? (
            <button
              onClick={onLanzarMoneda}
              className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-black uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all transform hover:scale-105"
            >
              Lanzar Moneda
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-xs animate-pulse">
              <Crown size={16} /> Esperando a los capitanes...
            </div>
          )}
        </div>
      )}

      {/* BANNER DE TURNO DE DRAFT */}
      {sala.estado === 'DRAFTING' && (
        <div className="bg-gradient-to-r from-blue-900/40 via-[#1a1b2e] to-green-900/40 border border-green-500/30 rounded-xl p-4 text-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
          <h3 className="text-xl font-black text-white uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
            Turno de Seleccion
          </h3>
          <p className="text-green-400 font-bold text-sm">
            Le toca elegir a:{' '}
            <span className="text-white text-lg ml-1">
              {jugadorConTurno?.username || 'Cargando...'}
            </span>
          </p>
        </div>
      )}

      {/* PANEL ADMIN */}
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
                Puedes supervisar el draft, forzar lideres y ver el MMR de cada
                jugador.
              </p>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-center font-black text-white tracking-widest uppercase text-sm border-b border-white/10 pb-3 mt-2">
        Piscina de Jugadores
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: totalSlots }).map((_, index) => {
          const jugador = sala.participantes?.[index];
          const idDelJugador = jugador?.id || jugador?.usuarioId;
          const isCapitan1 =
            sala.capitan1Id != null &&
            idDelJugador != null &&
            sala.capitan1Id === idDelJugador;
          const isCapitan2 =
            sala.capitan2Id != null &&
            idDelJugador != null &&
            sala.capitan2Id === idDelJugador;
          const isCapitan = isCapitan1 || isCapitan2;
          const soyCapitan =
            userId != null &&
            (userId === sala.capitan1Id || userId === sala.capitan2Id);
          const isEsperando =
            jugador &&
            (!jugador.equipo || jugador.equipo === 'ESPERANDO_DRAFT');

          return (
            <div
              key={`pool-${index}`}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${
                !jugador
                  ? 'bg-[#0b0c1b] border-white/5 border-dashed'
                  : isAutoChess
                    ? 'bg-green-900/20 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)] animate-in zoom-in-95'
                    : isCapitan
                      ? 'bg-yellow-500/10 border-yellow-500/50'
                      : isEsperando
                        ? 'bg-[#1a1b2e] border-white/10'
                        : jugador.equipo === 'EQUIPO1'
                          ? 'bg-blue-500/5 border-blue-500/30'
                          : 'bg-red-500/5 border-red-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center relative ${jugador && isAutoChess ? 'bg-green-500/20' : 'bg-white/5'}`}
                >
                  {jugador ? (
                    <Users
                      size={18}
                      className={
                        isAutoChess
                          ? 'text-green-400'
                          : isCapitan
                            ? 'text-yellow-500'
                            : isEsperando
                              ? 'text-gray-500'
                              : jugador.equipo === 'EQUIPO1'
                                ? 'text-blue-500'
                                : 'text-red-500'
                      }
                    />
                  ) : (
                    <UserPlus size={18} className="text-gray-600 opacity-50" />
                  )}
                  {jugador && isCapitan && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full p-1 shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-bounce">
                      <Crown size={12} fill="currentColor" />
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p
                    className={`text-sm font-bold truncate transition-colors ${jugador ? (isCapitan ? 'text-yellow-400' : isAutoChess ? 'text-green-400' : 'text-white') : 'text-gray-600'}`}
                  >
                    {jugador ? jugador.username : 'Esperando jugador...'}
                  </p>
                  {jugador && (
                    <p className="text-[10px] text-gray-400 truncate mt-0.5 uppercase tracking-tighter">
                      {isAutoChess
                        ? 'Listo en Sala'
                        : isCapitan
                          ? 'Capitan de Equipo'
                          : !isEsperando
                            ? `Elegido por ${jugador.equipo}`
                            : 'Disponible para Draft'}
                    </p>
                  )}
                  {jugador?.mmr && (
                    <p className="text-[10px] text-orange-400 truncate mt-0.5 font-semibold">
                      MMR: {jugador.mmr}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {soyCapitan &&
                  esMiTurno &&
                  isEsperando &&
                  !isCapitan &&
                  !isAutoChess &&
                  onPickPlayer && (
                    <button
                      onClick={() => onPickPlayer(idDelJugador as number)}
                      className="text-[10px] bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded transition-all font-black uppercase shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                    >
                      Reclutar
                    </button>
                  )}
                {userRol === 'SUPERADMIN' && jugador && (
                  <>
                    {!isCapitan && !isAutoChess && (
                      <button
                        className="px-3 py-1 text-xs font-bold text-gray-400 border border-gray-600 rounded hover:text-yellow-400 hover:border-yellow-400 transition-colors"
                        onClick={async () => {
                          if (!jugador || !jugador.usuarioId) return;

                          try {
                            await forzarCapitanAdmin(
                              sala.id,
                              jugador.usuarioId,
                            );

                            alert('Líder cambiado con éxito');
                            if (onActualizarSala) {
                              onActualizarSala();
                            }
                          } catch (error) {
                            console.error(error);
                            alert('Error al forzar líder');
                          }
                        }}
                      >
                        FORZAR LIDER
                      </button>
                    )}

                    <button
                      className="px-3 py-1 text-xs font-bold text-red-300 border border-red-500/60 rounded hover:text-red-200 hover:border-red-400 transition-colors"
                      onClick={async () => {
                        if (!jugador || !jugador.usuarioId) return;

                        const confirmar = window.confirm(
                          `¿Retirar a ${jugador.username} de la sala y reembolsar su inscripción?`,
                        );
                        if (!confirmar) return;

                        try {
                          const respuesta = await expulsarUsuarioSala(
                            sala.id,
                            jugador.usuarioId,
                          );
                          alert(
                            respuesta?.mensaje ||
                              'Jugador retirado y reembolso aplicado.',
                          );
                          if (onActualizarSala) {
                            onActualizarSala();
                          }
                        } catch (error) {
                          console.error(error);
                          alert('Error al retirar al jugador de la sala');
                        }
                      }}
                    >
                      RETIRAR JUGADOR
                    </button>
                  </>
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
