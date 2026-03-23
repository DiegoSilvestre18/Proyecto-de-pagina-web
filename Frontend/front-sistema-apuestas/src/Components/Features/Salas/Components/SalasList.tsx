import React from 'react';
import { Coins, Users, Trash2 } from 'lucide-react'; // 👈 Agregamos Trash2
import { ESTADOS_SALA, getEstadoLabel } from '../constants/estados';
import type { Sala } from '../types/types';

interface SalasListProps {
  salas: Sala[];
  isLoading: boolean;
  onSelectSala: (sala: Sala) => void;
  userRol?: string; // 👈 Necesario para saber si mostrar el basurero
  onCancelarSala?: (salaId: number) => void; // 👈 Función para eliminar
}

const SalasList: React.FC<SalasListProps> = ({
  salas,
  isLoading,
  onSelectSala,
  userRol, // 👈 Lo recibimos
  onCancelarSala, // 👈 Lo recibimos
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center px-4 pb-2 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
        <div className="flex-1">Detalles de la Sala</div>
        {userRol === 'SUPERADMIN' && <div className="w-12"></div>} {/* Espacio para el basurero */}
        <div className="w-32 text-center hidden md:block">Formato</div>
        <div className="w-40 text-center">Cuota Inicial</div>
        <div className="w-24 text-right">Jugadores</div>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-500 font-bold animate-pulse">
          Buscando salas en el servidor...
        </div>
      )}

      {!isLoading && salas.length === 0 && (
        <div className="text-center py-12 text-gray-500 font-bold">
          No hay salas disponibles con los filtros seleccionados.
        </div>
      )}

      {!isLoading &&
        salas.map((sala) => {
          // 👇 Magia para la lista 👇
          let textoPremioLista = `🏆 POZO S/ ${sala.premioARepartir?.toFixed(2) || '0.00'}`;
          if (sala.formato !== 'Auto Chess') { 
            if (sala.costo === 6) textoPremioLista = "🏆 GANAS S/ 10.00";
            else if (sala.costo === 11) textoPremioLista = "🏆 GANAS S/ 20.00";
          }

          return (
            <div
              key={sala.id}
              onClick={() => onSelectSala(sala)}
              className="group flex items-center justify-between p-4 bg-[#141526] border border-white/5 hover:border-orange-500/30 rounded-lg transition-all cursor-pointer hover:bg-[#1a1b30]"
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        sala.estado === 'ESPERANDO'
                          ? 'bg-green-500 animate-pulse'
                          : sala.estado === ESTADOS_SALA.SORTEO ||
                            sala.estado === ESTADOS_SALA.DRAFTING
                          ? 'bg-orange-400 animate-pulse'
                          : sala.estado === 'EN_CURSO'
                          ? 'bg-blue-500 animate-pulse'
                          : sala.estado === 'FINALIZADA'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}
                    ></span>
                    {sala.fecha}
                  </p>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider transition-all ${
                      sala.estado === 'ESPERANDO'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                        : sala.estado === ESTADOS_SALA.SORTEO ||
                          sala.estado === ESTADOS_SALA.DRAFTING
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                        : sala.estado === 'EN_CURSO'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                        : sala.estado === 'FINALIZADA'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}
                  >
                    {getEstadoLabel(sala.estado)}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white truncate">
                  {sala.nombre}
                </h4>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  Organizado por{' '}
                  <span className="text-gray-300">{sala.creador}</span>
                </p>
                {sala.mmrMinimo !== undefined && sala.mmrMaximo !== undefined && (
                  <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-gray-400 mt-2">
                    <span className="text-orange-500">🎯 MMR:</span>
                    {sala.mmrMinimo} - {sala.mmrMaximo}
                  </div>
                )}
              </div>

              {/* 👇 BOTÓN DE ELIMINAR (SOLO PARA ADMINS Y SALAS EN ESPERA) 👇 */}
              {userRol === 'SUPERADMIN' && sala.estado === 'ESPERANDO' && (
                <div className="flex items-center justify-center pr-2 md:pr-6 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 👈 Evita que se abra el modal al hacer clic en eliminar
                      const confirmar = window.confirm(
                        '🚨 ¿Estás seguro de cancelar esta sala? Se devolverá el dinero a los jugadores inscritos.'
                      );
                      if (confirmar && onCancelarSala) {
                        onCancelarSala(sala.id);
                      }
                    }}
                    className="p-2.5 bg-red-950/40 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all"
                    title="Cancelar Sala y Reembolsar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}

              <div className="w-32 text-center hidden md:flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-300 bg-white/5 px-3 py-1 rounded">
                  {sala.formato}
                </span>
              </div>

              <div className="w-40 flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-600/10 p-1 rounded text-orange-500">
                    <Coins size={14} />
                  </div>
                  <span className="font-black text-white text-sm">
                    S/ {sala.costo?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                  {textoPremioLista}
                </span>
              </div>

              <div className="w-24 flex items-center justify-end gap-2 text-gray-400 group-hover:text-white transition-colors">
                <Users size={16} />
                <span className="text-sm font-bold">
                  {sala.jugadores || 0}{' '}
                  <span className="text-gray-600">/ {sala.maxJugadores || 8}</span>
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SalasList;