import React from 'react';
import { X } from 'lucide-react';
import type { CuentaJuego, Sala } from '../types/types';
import LobbyHeader from './LobbyHeader';
import PiscinaJugadores from './PiscinaJugadores';
import EquiposView from './EquiposView';
import LobbyFooter from './LobbyFooter';

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
}) => {
  const miParticipacion = sala.participantes?.find(
    (p: { username: string; equipo: string }) => p.username === username,
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-[#0b0c1b] border border-white/10 rounded-2xl max-w-4xl w-full flex flex-col shadow-2xl relative overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white z-10 transition-colors bg-black/50 rounded-full p-1"
        >
          <X size={24} />
        </button>

        {/* Cabecera Épica */}
        <LobbyHeader sala={sala} />

        {/* Zona Principal (Condicional: Espera vs Partida) */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#141526]">
          {['ESPERANDO', 'SORTEO', 'DRAFTING'].includes(sala.estado || '') ? (
            <PiscinaJugadores sala={sala} userRol={userRol} userId={userId} />
          ) : (
            <EquiposView sala={sala} />
          )}
        </div>

        {/* FOOTER INTELIGENTE DEL MODAL */}
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
      </div>
    </div>
  );
};

export default ModalLobby;
