import React from 'react';
import { Crown } from 'lucide-react';
import type { Sala } from '../types/types';

interface AdminPanelProps {
  sala: Sala;
  podio1: number;
  podio2: number;
  podio3: number;
  onPodio1Change: (val: number) => void;
  onPodio2Change: (val: number) => void;
  onPodio3Change: (val: number) => void;
  onDeclararGanador: (equipo: number) => void;
  onFinalizarAutoChess: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  sala,
  podio1,
  podio2,
  podio3,
  onPodio1Change,
  onPodio2Change,
  onPodio3Change,
  onDeclararGanador,
  onFinalizarAutoChess,
}) => {
  return (
    <div className="p-4 sm:p-5 bg-black/60 border-t border-orange-500/30 text-center relative z-20 -mx-6 -mb-6">
      {sala.formato !== 'Auto Chess' ? (
        <>
          <h3 className="text-orange-400 font-black mb-3 uppercase text-sm tracking-widest">
            Control de Administrador (5v5)
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Elige que equipo gano la partida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onDeclararGanador(1)}
              className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
            >
              Gano Equipo 1 (Azul)
            </button>
            <button
              onClick={() => onDeclararGanador(2)}
              className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
            >
              Gano Equipo 2 (Rojo)
            </button>
          </div>
        </>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <h3 className="text-green-400 font-black mb-3 uppercase text-sm tracking-widest flex items-center justify-center gap-2">
            <Crown size={16} /> Podio de Auto Chess
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Selecciona a los 3 ganadores para repartir el pozo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-left max-w-3xl mx-auto">
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-2 rounded-lg">
              <label className="block text-[10px] font-bold text-yellow-500 mb-1">
                1ER PUESTO
              </label>
              <select
                className="w-full bg-[#141526] text-white text-xs p-2 rounded outline-none border border-white/5"
                value={podio1}
                onChange={(e) => onPodio1Change(Number(e.target.value))}
              >
                <option value="0">Elegir jugador...</option>
                {sala.participantes?.map((p) => (
                  <option key={`p1-${p.usuarioId}`} value={p.usuarioId}>
                    {p.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-gray-400/10 border border-gray-400/30 p-2 rounded-lg">
              <label className="block text-[10px] font-bold text-gray-300 mb-1">
                2DO PUESTO
              </label>
              <select
                className="w-full bg-[#141526] text-white text-xs p-2 rounded outline-none border border-white/5"
                value={podio2}
                onChange={(e) => onPodio2Change(Number(e.target.value))}
              >
                <option value="0">Elegir jugador...</option>
                {sala.participantes?.map((p) => (
                  <option key={`p2-${p.usuarioId}`} value={p.usuarioId}>
                    {p.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-orange-600/10 border border-orange-600/30 p-2 rounded-lg">
              <label className="block text-[10px] font-bold text-orange-400 mb-1">
                3ER PUESTO
              </label>
              <select
                className="w-full bg-[#141526] text-white text-xs p-2 rounded outline-none border border-white/5"
                value={podio3}
                onChange={(e) => onPodio3Change(Number(e.target.value))}
              >
                <option value="0">Elegir jugador...</option>
                {sala.participantes?.map((p) => (
                  <option key={`p3-${p.usuarioId}`} value={p.usuarioId}>
                    {p.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={onFinalizarAutoChess}
            className="w-full max-w-3xl mx-auto block bg-green-600 hover:bg-green-500 text-white font-black py-3 px-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all uppercase tracking-widest text-sm"
          >
            Pagar a Ganadores y Cerrar Sala
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
