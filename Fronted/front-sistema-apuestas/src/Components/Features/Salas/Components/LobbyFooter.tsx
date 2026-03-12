import React from 'react';
import type { CuentaJuego, Sala } from '../types/types';

interface Participacion {
  username: string;
  equipo: string;
  nombreLobby?: string;
  passwordLobby?: string;
}

interface LobbyFooterProps {
  sala: Sala;
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
  return (
    <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0b0c1b]/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
      {!miParticipacion ? (
        /* --- ESTADO 1: NO ESTÁ EN LA SALA (Muestra pago y selectores) --- */
        <>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Menú Desplegable de Cuentas */}
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
                    🎮 {cuenta.idVisible}
                  </option>
                ))}
              </select>
            </div>

            {/* Menú Desplegable de Bando */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                Elige tu Bando
              </label>
              <select
                value={equipoSeleccionado}
                onChange={(e) => onEquipoChange(e.target.value)}
                className="w-full sm:w-48 bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none"
              >
                <option value="EQUIPO1">🔵 Radiant / Atacantes</option>
                <option value="EQUIPO2">🔴 Dire / Defensores</option>
              </select>
            </div>
          </div>

          {/* Botón Pagar */}
          <button
            onClick={onUnirseSala}
            disabled={isJoining}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isJoining
              ? 'Procesando...'
              : `PAGAR S/ ${sala.costo.toFixed(2)} Y UNIRSE`}
          </button>
        </>
      ) : (
        /* --- ESTADO 2: YA ESTÁ EN LA SALA (Muestra Credenciales y Opciones) --- */
        <div className="flex flex-col w-full gap-4">
          {/* CUADRO DE CREDENCIALES */}
          {miParticipacion.nombreLobby && (
            <div className="mx-auto w-fit px-6 py-2.5 bg-[#141526] border border-purple-500/40 rounded-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-[0_0_15px_rgba(168,85,247,0.1)] relative overflow-hidden">
              {/* Barrita de luz superior */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-600 to-blue-500"></div>

              {/* Nombre Lobby */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                  LOBBY:
                </span>
                <span className="text-purple-300 font-mono font-bold text-sm bg-black/50 px-3 py-1 rounded border border-purple-500/20 select-all">
                  {miParticipacion.nombreLobby}
                </span>
              </div>

              {/* Divisor vertical (se oculta en celulares) */}
              <div className="hidden sm:block w-px h-5 bg-white/10"></div>

              {/* Contraseña */}
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

          {/* Alerta de Inscrito y Botón de Cambiar Bando */}
          <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3">
            <div className="text-green-400 font-bold flex items-center gap-2 bg-green-500/10 px-4 py-2.5 rounded-lg border border-green-500/20 w-full sm:w-auto justify-center text-sm">
              <span>✅</span> Inscrito en el{' '}
              {miParticipacion.equipo === 'EQUIPO1' ? 'Radiant' : 'Dire'}
            </div>

            <button
              onClick={() =>
                onCambiarEquipo(
                  sala.id,
                  miParticipacion.equipo === 'EQUIPO1' ? 'EQUIPO2' : 'EQUIPO1',
                )
              }
              className="w-full sm:w-auto px-5 py-2.5 bg-[#1a1b2e] hover:bg-[#2a2b46] border border-white/10 hover:border-white/30 rounded-lg text-white font-bold transition-all flex items-center justify-center gap-2 text-sm"
            >
              🔄 Cambiar a{' '}
              {miParticipacion.equipo === 'EQUIPO1' ? 'Dire 🔴' : 'Radiant 🔵'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LobbyFooter;
