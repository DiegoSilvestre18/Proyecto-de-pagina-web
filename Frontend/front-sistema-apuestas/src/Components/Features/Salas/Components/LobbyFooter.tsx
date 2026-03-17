import React from 'react';
import { ESTADOS_SALA } from '../constants/estados';
import { isAutoChess } from '../constants/formatos';
import type { CuentaJuego, Sala } from '../types/types';

interface Participacion {
  username: string;
  equipo: string;
  nombreLobby?: string;
  passwordLobby?: string;
}

interface LobbyFooterProps {
  sala: Sala;
  userRol?: string;
  miParticipacion: Participacion | undefined;
  cuentasJuego: CuentaJuego[];
  selectedAccountId: number | '';
  onSelectedAccountChange: (id: number) => void;
  equipoSeleccionado: string;
  onEquipoChange: (equipo: string) => void;
  isJoining: boolean;
  onUnirseSala: () => void;
  onCambiarEquipo: (salaId: number, nuevoEquipo: string) => void;
}

const LobbyFooter: React.FC<LobbyFooterProps> = ({
  sala,
  userRol,
  miParticipacion,
  cuentasJuego,
  selectedAccountId,
  onSelectedAccountChange,
  equipoSeleccionado,
  onEquipoChange,
  isJoining,
  onUnirseSala,
  onCambiarEquipo,
}) => {
  const isAutoChessFormat = isAutoChess(sala.formato);
  const estaLlena = (sala.jugadores || 0) >= (sala.maxJugadores || 0);
  const puedeInscribirse = sala.estado === ESTADOS_SALA.ESPERANDO && !estaLlena;

  return (
    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4 bg-[#0b0c1b]/50 -mx-6 p-6">
      {miParticipacion ? (
        <div className="flex flex-col w-full gap-4">
          {miParticipacion.nombreLobby && (
            <div className="mx-auto w-fit px-6 py-2.5 bg-[#141526] border border-purple-500/40 rounded-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-[0_0_15px_rgba(168,85,247,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-600 to-blue-500"></div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                  LOBBY:
                </span>
                <span className="text-purple-300 font-mono font-bold text-sm bg-black/50 px-3 py-1 rounded border border-purple-500/20 select-all">
                  {miParticipacion.nombreLobby}
                </span>
              </div>
              <div className="hidden sm:block w-px h-5 bg-white/10"></div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                  PASS:
                </span>
                <span className="text-purple-300 font-mono font-bold text-sm bg-black/50 px-3 py-1 rounded border border-purple-500/20 select-all">
                  {miParticipacion.passwordLobby}
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3">
            {isAutoChessFormat ? (
              <div className="flex w-full justify-center items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2.5 rounded-lg text-sm font-bold">
                Inscrito en la partida (FFA)
              </div>
            ) : (
              <>
                <div className="text-green-400 font-bold flex items-center gap-2 bg-green-500/10 px-4 py-2.5 rounded-lg border border-green-500/20 w-full sm:w-auto justify-center text-sm">
                  Inscrito en el{' '}
                  {miParticipacion.equipo === 'EQUIPO1' ? 'Radiant' : 'Dire'}
                </div>
                <button
                  onClick={() =>
                    onCambiarEquipo(
                      sala.id,
                      miParticipacion.equipo === 'EQUIPO1'
                        ? 'EQUIPO2'
                        : 'EQUIPO1',
                    )
                  }
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1a1b2e] hover:bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-gray-300 transition-colors w-full sm:w-auto"
                >
                  Cambiar a{' '}
                  {miParticipacion.equipo === 'EQUIPO1' ? 'Dire' : 'Radiant'}
                </button>
              </>
            )}
          </div>
        </div>
      ) : puedeInscribirse ? (
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                Selecciona tu cuenta
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) =>
                  onSelectedAccountChange(Number(e.target.value))
                }
                className="w-full sm:w-48 bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none"
              >
                {cuentasJuego.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.idVisible}
                  </option>
                ))}
              </select>
            </div>
            {!isAutoChessFormat && (
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                  Elige tu Bando
                </label>
                <select
                  value={equipoSeleccionado}
                  onChange={(e) => onEquipoChange(e.target.value)}
                  className="w-full sm:w-48 bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none"
                >
                  <option value="EQUIPO1">Radiant / Atacantes</option>
                  <option value="EQUIPO2">Dire / Defensores</option>
                </select>
              </div>
            )}
          </div>
          <button
            onClick={onUnirseSala}
            disabled={isJoining}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isJoining
              ? 'Procesando...'
              : `PAGAR S/ ${sala.costo.toFixed(2)} Y UNIRSE`}
          </button>
        </div>
      ) : (
        <div className="w-full text-center py-2 text-gray-500 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2">
          Las inscripciones estan cerradas
        </div>
      )}
    </div>
  );
};

export default LobbyFooter;
