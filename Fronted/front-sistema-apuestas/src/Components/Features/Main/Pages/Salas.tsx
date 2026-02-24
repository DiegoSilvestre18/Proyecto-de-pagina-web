import React, { useState } from 'react';
import { Crosshair, Plus, Filter, Coins, Users } from 'lucide-react';
import type { Sala } from '../types';

interface SalasProps {
  salas: Sala[];
  filtrosModos: string[];
}

const Salas: React.FC<SalasProps> = ({ salas, filtrosModos }) => {
  const [activeTab, setActiveTab] = useState('NAVEGAR');

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 pb-20 px-4 lg:px-12 pt-8 max-w-[1600px] mx-auto">
      {/* Cabecera de Salas */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-orange-600/20 rounded flex items-center justify-center">
              <Crosshair size={18} className="text-orange-500" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Salas de Apuestas
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-2xl">
            Descubre salas activas para apostar tus créditos. Únete a un duelo
            1v1 o arma tu equipo para partidas 5v5.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#1a1b2e] border border-white/10 hover:border-orange-500 hover:bg-[#22233b] text-white px-6 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap">
          <Plus size={16} className="text-orange-500" /> CREAR SALA
        </button>
      </div>

      {/* Pestañas (Navegar / Mis Salas) */}
      <div className="flex gap-8 mb-6 border-b border-white/5">
        {['NAVEGAR', 'MIS SALAS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold tracking-widest transition-colors relative ${
              activeTab === tab
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full shadow-[0_-2px_8px_rgba(249,115,22,0.8)]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Filtros en Píldoras */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {filtrosModos.map((modo, index) => (
          <button
            key={index}
            className="px-4 py-1.5 bg-[#141526] hover:bg-white/10 border border-white/5 rounded-full text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            {modo}
          </button>
        ))}
        <div className="w-px h-6 bg-white/10 mx-2"></div>
        <button className="flex items-center gap-2 px-4 py-1.5 bg-transparent hover:bg-white/5 border border-transparent rounded-full text-xs font-semibold text-gray-300 hover:text-white transition-colors">
          <Filter size={14} /> FILTROS
        </button>
      </div>

      {/* Lista de Salas */}
      <div className="space-y-2">
        {/* Cabecera de la tabla */}
        <div className="flex items-center px-4 pb-2 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
          <div className="flex-1">Detalles de la Sala</div>
          <div className="w-32 text-center hidden md:block">Formato</div>
          <div className="w-40 text-center">Cuota Inicial</div>
          <div className="w-24 text-right">Jugadores</div>
        </div>

        {/* Filas */}
        {salas.map((sala) => (
          <div
            key={sala.id}
            className="group flex items-center justify-between p-4 bg-[#141526] border border-white/5 hover:border-orange-500/30 rounded-lg transition-all cursor-pointer hover:bg-[#1a1b30]"
          >
            {/* Info Izquierda */}
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                {sala.fecha}
              </p>
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
                S/ {sala.costo.toFixed(2)}
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

        {/* Separador de fechas */}
        <div className="pt-6 pb-2 text-xs font-bold text-gray-500 tracking-widest uppercase">
          Mañana, 25 Feb
        </div>

        {/* Ejemplo sala adicional */}
        <div className="group flex items-center justify-between p-4 bg-[#141526] border border-white/5 hover:border-orange-500/30 rounded-lg transition-all cursor-pointer hover:bg-[#1a1b30]">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">
              MAÑANA, 13:00 GMT-5
            </p>
            <h4 className="font-bold text-sm text-white truncate">
              Torneo Semanal - Inscripciones
            </h4>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              Organizado por{' '}
              <span className="text-orange-500">ARENA Oficial</span>
            </p>
          </div>
          <div className="w-32 text-center hidden md:flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-300 bg-white/5 px-3 py-1 rounded">
              5v5 All Pick
            </span>
          </div>
          <div className="w-40 flex items-center justify-center gap-2">
            <div className="bg-orange-600/10 p-1.5 rounded text-orange-500">
              <Coins size={16} />
            </div>
            <span className="font-black text-white text-sm">S/ 25.00</span>
          </div>
          <div className="w-24 flex items-center justify-end gap-2 text-gray-400 group-hover:text-white">
            <Users size={16} />
            <span className="text-sm font-bold">
              4 <span className="text-gray-600">/ 10</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salas;
