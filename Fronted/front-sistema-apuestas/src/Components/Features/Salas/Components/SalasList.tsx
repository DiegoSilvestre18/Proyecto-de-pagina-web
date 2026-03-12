import React from 'react';
import { Coins, Users } from 'lucide-react';
import type { Sala } from '../types/types';

interface SalasListProps {
  salas: Sala[];
  isLoading: boolean;
  activeTab: string;
  onSelectSala: (sala: Sala) => void;
}

const SalasList: React.FC<SalasListProps> = ({
  salas,
  isLoading,
  activeTab,
  onSelectSala,
}) => {
  return (
    <div className="space-y-2">
      {/* Cabecera de la tabla */}
      <div className="flex items-center px-4 pb-2 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
        <div className="flex-1">Detalles de la Sala</div>
        <div className="w-32 text-center hidden md:block">Formato</div>
        <div className="w-40 text-center">Cuota Inicial</div>
        <div className="w-24 text-right">Jugadores</div>
      </div>

      {/* Indicador de Carga */}
      {isLoading && (
        <div className="text-center py-8 text-gray-500 font-bold animate-pulse">
          Buscando salas en el servidor...
        </div>
      )}

      {/* Filas (AQUÍ CAMBIAMOS 'salas' por 'salasAMostrar') */}
      {!isLoading && salas.length === 0 && (
        <div className="text-center py-12 text-gray-500 font-bold">
          No hay salas disponibles en este momento.
        </div>
      )}

      {!isLoading &&
        salas.length > 0 &&
        salas.map((sala) => (
          <div
            key={sala.id}
            onClick={() => onSelectSala(sala)}
            className="group flex items-center justify-between p-4 bg-[#141526] border border-white/5 hover:border-orange-500/30 rounded-lg transition-all cursor-pointer hover:bg-[#1a1b30]"
          >
            {/* Info Izquierda */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${sala.estado === 'ESPERANDO' ? 'bg-green-500' : sala.estado === 'PENDIENTE_APROBACION' ? 'bg-orange-500' : 'bg-gray-500'}`}
                  ></span>
                  {sala.fecha}
                </p>

                {/* Etiqueta de Estado Dinámica */}
                {activeTab === 'MIS SALAS' && (
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                      sala.estado === 'ESPERANDO'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : sala.estado === 'PENDIENTE_APROBACION' ||
                            sala.estado === 'EN_REVISION'
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {sala.estado === 'ESPERANDO'
                      ? 'Aprobada'
                      : sala.estado === 'RECHAZADA'
                        ? 'Rechazada'
                        : 'En Revisión'}
                  </span>
                )}
              </div>

              <h4 className="font-bold text-sm text-white truncate">
                {sala.nombre}
              </h4>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                Organizado por{' '}
                <span className="text-gray-300">{sala.creador}</span>
              </p>
            </div>

            {/* Formato */}
            <div className="w-32 text-center hidden md:flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-300 bg-white/5 px-3 py-1 rounded">
                {sala.formato}
              </span>
            </div>

            {/* Cuota */}
            <div className="w-40 flex items-center justify-center gap-2">
              <div className="bg-orange-600/10 p-1.5 rounded text-orange-500">
                <Coins size={16} />
              </div>
              <span className="font-black text-white text-sm">
                S/ {sala.costo?.toFixed(2) || '0.00'}
              </span>
            </div>

            {/* Jugadores */}
            <div className="w-24 flex items-center justify-end gap-2 text-gray-400 group-hover:text-white transition-colors">
              <Users size={16} />
              <span className="text-sm font-bold">
                {sala.jugadores}{' '}
                <span className="text-gray-600">/ {sala.maxJugadores}</span>
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SalasList;
