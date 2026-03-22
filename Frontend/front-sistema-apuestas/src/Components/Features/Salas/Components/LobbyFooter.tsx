import React from 'react';
import { ESTADOS_SALA } from '../constants/estados';
import { isAutoChess } from '../constants/formatos';
import type { CuentaJuego, Sala } from '../types/types';

interface Participacion {
  username: string;
  equipo: string;
  fechaInscripcion?: string;
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
  selectedRole?: string;
  onRoleChange?: (role: string) => void;
  isJoining: boolean;
  onUnirseSala: () => void;
  onCambiarEquipo: (salaId: number, nuevoEquipo: string) => void;
  onRetirarseSala: () => void;
}

const ROLES_DOTA = [
  { id: 'Carry', label: 'Carry' },
  { id: 'Mid', label: 'Mid' },
  { id: 'Offlaner', label: 'Offlaner' },
  { id: 'Apoyo Secundario', label: 'Apoyo Secundario' },
  { id: 'Apoyo Primario', label: 'Apoyo Primario' },
];

const LobbyFooter: React.FC<LobbyFooterProps> = ({
  sala,
  userRol: _userRol,
  miParticipacion,
  cuentasJuego,
  selectedAccountId,
  onSelectedAccountChange,
  selectedRole,
  onRoleChange,
  isJoining,
  onUnirseSala,
  onCambiarEquipo,
  onRetirarseSala,
}) => {
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!miParticipacion?.fechaInscripcion) return;

    const timer = setInterval(() => {
      const joinDate = new Date(miParticipacion.fechaInscripcion!).getTime();
      const now = new Date().getTime();
      const diffInMs = now - joinDate;
      const eightMinutesInMs = 8 * 60 * 1000;
      const remaining = Math.max(0, eightMinutesInMs - diffInMs);
      
      setTimeLeft(Math.floor(remaining / 1000));
      
      if (remaining === 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [miParticipacion?.fechaInscripcion]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isAutoChessFormat = isAutoChess(sala.formato);
  const estaLlena = (sala.jugadores || 0) >= (sala.maxJugadores || 0);
  const puedeInscribirse = sala.estado === ESTADOS_SALA.ESPERANDO && !estaLlena;

  const canRefund = timeLeft === 0;

  // Solo mostrar selector si es Dota 2 y es 5v5
  const mostrarSelectorRoles = 
    sala.juego?.toUpperCase() === 'DOTA2' && 
    sala.maxJugadores === 10 && 
    !isAutoChessFormat;

  const getConteoRol = (roleId: string) => {
    return (sala.participantes || []).filter(p => p.rolJuego === roleId).length;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {miParticipacion ? (
        <div className="flex flex-col w-full gap-4">
          {miParticipacion.nombreLobby && (
            <div className="w-full px-4 py-3 bg-[#141526] border border-purple-500/40 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 shadow-[0_0_15px_rgba(168,85,247,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-600 to-blue-500"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold tracking-widest uppercase">
                  LOBBY:
                </span>
                <span className="text-purple-300 font-mono font-bold text-sm bg-black/50 px-3 py-1 rounded border border-purple-500/20 select-all">
                  {miParticipacion.nombreLobby}
                </span>
              </div>
              <div className="hidden sm:block w-px h-5 bg-white/10"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold tracking-widest uppercase">
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
            ) : miParticipacion.equipo !== 'EQUIPO1' &&
              miParticipacion.equipo !== 'EQUIPO2' ? (
              <div className="w-full flex flex-col items-center gap-3">
                <div className="flex w-full justify-center items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2.5 rounded-lg text-sm font-bold">
                  Inscrito. Esperando sorteo de equipos.
                </div>
                {sala.estado === ESTADOS_SALA.ESPERANDO && (
                  <div className="w-full flex flex-col gap-2">
                    <button
                      onClick={onRetirarseSala}
                      disabled={!canRefund}
                      className={`w-full px-4 py-2 border font-bold rounded-lg text-sm transition-colors ${
                        canRefund 
                          ? 'bg-red-600/20 hover:bg-red-600/30 border-red-500/40 text-red-300' 
                          : 'bg-gray-800/40 border-white/5 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canRefund ? 'Retirarme y reembolsar' : `Podrás reembolsar en ${formatTime(timeLeft || 0)}`}
                    </button>
                    {!canRefund && (
                      <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
                        Mínimo 8 minutos para evitar abusos
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full flex flex-col gap-3">
                <div className="text-green-400 font-bold flex items-center justify-center gap-2 bg-green-500/10 px-4 py-2.5 rounded-lg border border-green-500/20 w-full text-sm">
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
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1b2e] hover:bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-gray-300 transition-colors w-full"
                >
                  Cambiar a{' '}
                  {miParticipacion.equipo === 'EQUIPO1' ? 'Dire' : 'Radiant'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : puedeInscribirse ? (
        <div className="flex flex-col gap-5 w-full">
          {mostrarSelectorRoles && (
            <div className="w-full animate-in slide-in-from-bottom-2 duration-500">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">
                1. Selecciona tu Rol (Máx. 2 por rol)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES_DOTA.map((rol) => {
                  const conteo = getConteoRol(rol.id);
                  const estaLleno = conteo >= 2;
                  const seleccionado = selectedRole === rol.id;

                  return (
                    <button
                      key={rol.id}
                      disabled={estaLleno}
                      onClick={() => onRoleChange?.(rol.id)}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                        seleccionado
                          ? 'bg-orange-500/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                          : estaLleno
                          ? 'bg-black/20 border-white/5 opacity-40 cursor-not-allowed'
                          : 'bg-[#1a1b2e] border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className={`text-xs font-black uppercase tracking-tight ${seleccionado ? 'text-orange-400' : 'text-gray-300'} leading-none text-center`}>
                        {rol.label}
                      </span>
                      <span className={`text-[10px] mt-1 font-bold ${estaLleno ? 'text-red-500' : 'text-green-500/70'}`}>
                        {conteo}/2 ocupados
                      </span>
                      {seleccionado && (
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-[#0b0c1b]"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                2. Cuenta de Juego
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) =>
                  onSelectedAccountChange(Number(e.target.value))
                }
                className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none"
              >
                {cuentasJuego.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.idVisible}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={onUnirseSala}
              disabled={isJoining || (mostrarSelectorRoles && !selectedRole)}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm uppercase tracking-widest mt-2"
            >
              {isJoining
                ? 'Procesando...'
                : mostrarSelectorRoles && !selectedRole 
                ? 'Elige un Rol Primero'
                : `Pagar S/ ${sala.costo.toFixed(2)} e Inscribirme`}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full text-center py-4 text-gray-500 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-black/20 rounded-lg border border-white/5">
          Las inscripciones están cerradas
        </div>
      )}
    </div>
  );
};

export default LobbyFooter;
