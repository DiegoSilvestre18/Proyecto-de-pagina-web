import React from 'react';
import { X, Swords } from 'lucide-react';
import type { CuentaJuego, Sala } from '../types/types';
import LobbyHeader from './LobbyHeader';
import PiscinaJugadores from './PiscinaJugadores';
import EquiposView from './EquiposView';
import LobbyFooter from './LobbyFooter';
import AdminPanel from './AdminPanel';

interface ModalLobbyProps {
  sala: Sala;
  userRol?: string;
  userId?: number;
  username?: string;
  cuentasJuego: CuentaJuego[];
  selectedAccountId: number | '';
  onSelectedAccountChange: (id: number) => void;
  equipoSeleccionado: string;
  onEquipoChange: (equipo: string) => void;
  isJoining: boolean;
  onUnirseSala: () => void;
  onCambiarEquipo: (salaId: number, nuevoEquipo: string) => void;
  onClose: () => void;
  onLanzarMoneda: () => void;
  onPickPlayer: (jugadorId: number) => void;
  onEmpezarPartida: () => void;
  onDeclararGanador: (equipo: number) => void;
  onFinalizarAutoChess: () => void;
  soyCapitanGlobal?: boolean;
  jugadorConTurno?: { username: string } | null;
  podio1: number;
  podio2: number;
  podio3: number;
  onPodio1Change: (val: number) => void;
  onPodio2Change: (val: number) => void;
  onPodio3Change: (val: number) => void;
}

const ModalLobby: React.FC<ModalLobbyProps> = ({
  sala,
  userRol,
  userId,
  username,
  cuentasJuego,
  selectedAccountId,
  onSelectedAccountChange,
  equipoSeleccionado,
  onEquipoChange,
  isJoining,
  onUnirseSala,
  onCambiarEquipo,
  onClose,
  onLanzarMoneda,
  onPickPlayer,
  onEmpezarPartida,
  onDeclararGanador,
  onFinalizarAutoChess,
  soyCapitanGlobal,
  jugadorConTurno,
  podio1,
  podio2,
  podio3,
  onPodio1Change,
  onPodio2Change,
  onPodio3Change,
}) => {
  const miParticipacion = sala.participantes?.find(
    (p: { username: string; equipo: string }) => p.username === username,
  );

  const isPoolView =
    ['ESPERANDO', 'SORTEO', 'DRAFTING'].includes(sala.estado || '') ||
    sala.formato === 'Auto Chess';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-[#0b0c1b] border border-white/10 rounded-2xl max-w-4xl w-full flex flex-col shadow-2xl relative overflow-hidden h-full max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white z-50 transition-colors bg-black/50 rounded-full p-1.5 shadow-lg border border-white/10"
        >
          <X size={20} />
        </button>

        {/* Estado badge floating */}
        <div className="absolute top-4 right-14 z-50 pointer-events-none pr-2">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border backdrop-blur-md shadow-lg transition-all ${
              sala.estado === 'ESPERANDO'
                ? 'bg-green-900/40 text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                : sala.estado === 'EN_CURSO'
                  ? 'bg-blue-900/40 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : sala.estado === 'FINALIZADA'
                    ? 'bg-red-900/40 text-red-500 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                    : 'bg-gray-900/40 text-gray-400 border-gray-500/50'
            }`}
          >
            {sala.estado === 'ESPERANDO' && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            )}
            {sala.estado === 'EN_CURSO' && (
              <Swords size={12} className="text-blue-400" />
            )}
            {sala.estado === 'FINALIZADA' && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            )}
            {sala.estado === 'ESPERANDO'
              ? 'ESPERANDO'
              : sala.estado === 'EN_CURSO'
                ? 'EN CURSO'
                : sala.estado === 'FINALIZADA'
                  ? 'FINALIZADA'
                  : sala.estado}
          </span>
        </div>

        {/* Admin: Iniciar Partida button for Auto Chess ESPERANDO */}
        {sala.estado === 'ESPERANDO' &&
          userRol === 'SUPERADMIN' &&
          sala.formato === 'Auto Chess' && (
            <div className="pt-4 px-6 shrink-0 flex justify-center z-40 relative bg-[#0b0c1b]">
              <button
                onClick={onEmpezarPartida}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black uppercase tracking-widest py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all hover:scale-105 flex items-center gap-2"
              >
                Iniciar Partida Ahora
              </button>
            </div>
          )}

        {/* Header */}
        <LobbyHeader sala={sala} />

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-[#141526] p-6 relative z-10">
          {isPoolView ? (
            <PiscinaJugadores
              sala={sala}
              userRol={userRol}
              userId={userId}
              soyCapitanGlobal={soyCapitanGlobal}
              jugadorConTurno={jugadorConTurno}
              onLanzarMoneda={onLanzarMoneda}
              onPickPlayer={onPickPlayer}
            />
          ) : (
            <EquiposView sala={sala} />
          )}

          {/* Footer */}
          <LobbyFooter
            sala={sala}
            miParticipacion={miParticipacion}
            cuentasJuego={cuentasJuego}
            selectedAccountId={selectedAccountId}
            onSelectedAccountChange={onSelectedAccountChange}
            equipoSeleccionado={equipoSeleccionado}
            onEquipoChange={onEquipoChange}
            isJoining={isJoining}
            onUnirseSala={onUnirseSala}
            onCambiarEquipo={onCambiarEquipo}
          />

          {/* Admin Panel (EN_CURSO only) */}
          {sala.estado === 'EN_CURSO' && userRol === 'SUPERADMIN' && (
            <AdminPanel
              sala={sala}
              podio1={podio1}
              podio2={podio2}
              podio3={podio3}
              onPodio1Change={onPodio1Change}
              onPodio2Change={onPodio2Change}
              onPodio3Change={onPodio3Change}
              onDeclararGanador={onDeclararGanador}
              onFinalizarAutoChess={onFinalizarAutoChess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalLobby;
