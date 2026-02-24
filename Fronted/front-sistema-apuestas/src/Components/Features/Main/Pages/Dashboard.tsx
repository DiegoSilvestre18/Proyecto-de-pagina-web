import React from 'react';
import { Crosshair, Trophy, Users } from 'lucide-react';
import type { Club } from '../types';

interface DashboardProps {
  clubs: Club[];
  onNavigateToSalas: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ clubs, onNavigateToSalas }) => {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Hero Banner Superior */}
      <div className="relative w-full h-64 lg:h-80 bg-[#1a1b2e] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c1b] via-[#0b0c1b]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c1b] to-transparent" />

        <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center max-w-3xl">
          <span className="inline-block px-3 py-1 bg-orange-600/20 text-orange-500 text-xs font-bold rounded mb-4 w-max border border-orange-500/30">
            TEMPORADA 1 ACTIVA
          </span>
          <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">
            COMPITE. APUESTA. <br />
            <span className="text-orange-500">DEMUESTRA TU NIVEL.</span>
          </h2>
          <p className="text-gray-400 text-sm lg:text-base max-w-xl">
            Encuentra rivales de tu mismo MMR, únete a salas personalizadas y
            multiplica tus créditos. La Arena te espera.
          </p>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="px-4 lg:px-8 max-w-[1600px] mx-auto -mt-8 relative z-20">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Conectar Juego */}
            <div className="bg-[#141526] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600/10 border border-red-500/20 rounded-xl flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Dota_2_icon.svg/1024px-Dota_2_icon.svg.png"
                    alt="Dota 2"
                    className="w-8 h-8 opacity-80"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">CONECTAR JUEGO</h3>
                  <p className="text-xs text-gray-400">
                    Vincula tu cuenta de Steam para validar tu MMR
                    automáticamente.
                  </p>
                </div>
              </div>
              <button className="w-full sm:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg border border-white/10 transition-colors">
                Vincular Cuenta
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tarjeta Emparejamiento */}
              <div
                onClick={onNavigateToSalas}
                className="group bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-1 pb-0 overflow-hidden cursor-pointer shadow-lg shadow-orange-600/10 hover:shadow-orange-600/30 transition-all hover:-translate-y-1"
              >
                <div className="bg-[#141526] w-full h-full rounded-xl rounded-b-none p-6 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden group-hover:bg-[#1a1b30] transition-colors">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-24 h-24 mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-orange-500/30 flex items-center justify-center relative z-10">
                      <Crosshair size={32} className="text-orange-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black tracking-tight mb-2 relative z-10">
                    EMPAREJAMIENTO
                  </h3>
                  <p className="text-sm text-gray-400 text-center px-4 relative z-10">
                    Busca salas activas o crea la tuya para apostar contra otros
                    jugadores.
                  </p>
                </div>
                <div className="h-1.5 w-full bg-orange-500"></div>
              </div>

              {/* Tarjeta Torneos */}
              <div className="group bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-1 pb-0 overflow-hidden cursor-pointer shadow-lg shadow-blue-600/10 hover:shadow-blue-600/30 transition-all hover:-translate-y-1">
                <div className="bg-[#141526] w-full h-full rounded-xl rounded-b-none p-6 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden group-hover:bg-[#1a1b30] transition-colors">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-24 h-24 mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-blue-500/30 flex items-center justify-center relative z-10">
                      <Trophy size={32} className="text-blue-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black tracking-tight mb-2 relative z-10">
                    TORNEOS
                  </h3>
                  <p className="text-sm text-gray-400 text-center px-4 relative z-10">
                    Inscríbete en torneos oficiales, compite por grandes pozos y
                    gana prestigio.
                  </p>
                </div>
                <div className="h-1.5 w-full bg-blue-500"></div>
              </div>
            </div>
          </div>

          {/* Columna Derecha (Clubes) */}
          <div className="xl:col-span-1">
            <div className="bg-[#141526] border border-white/5 rounded-2xl p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <Users size={18} className="text-orange-500" /> Clubes Activos
                </h3>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                  {clubs.length}
                </span>
              </div>
              <div className="space-y-4">
                {clubs.map((club) => (
                  <div
                    key={club.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={club.avatar}
                          alt={club.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        {club.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-orange-500 w-3.5 h-3.5 rounded-full border-2 border-[#141526] flex items-center justify-center">
                            <svg
                              className="w-2 h-2 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={4}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight">
                          {club.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Club Público
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users size={12} />
                      <span className="text-xs">{club.members}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-[#1a1b2e] hover:bg-[#22233b] border border-white/5 text-xs font-bold rounded-lg transition-colors">
                DESCUBRE CLUBES
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
