import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { Game } from '../features/types';

const GamesData: Game[] = [
  {
    id: 'dota2',
    title: 'DOTA 2',
    tagline: 'APUESTAS Y SALAS DE',
    description:
      'Encuentra rivales, únete a salas personalizadas y apuesta tus créditos. Demuestra tu MMR en duelos reales.',
    bgImage:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    logo: 'DOTA 2',
    accentColor: 'border-red-600',
  },
  {
    id: 'valorant',
    title: 'VALORANT',
    tagline: 'COMPITE POR EL POZO EN',
    description:
      'Crea tu sala, establece la apuesta y compite en duelos de puntería o partidas 5v5. El ganador se lleva todo.',
    bgImage:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
    logo: 'VALORANT',
    accentColor: 'border-red-500',
  },
];

const Layout: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game>(GamesData[0]);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  return (
    <div className="flex h-screen w-full bg-[#0b0c1b] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-[#0b0c1b] z-20 transition-all duration-700 ease-in-out overflow-hidden ${isHome ? 'w-80 border-r border-white/5 opacity-100' : 'w-0 opacity-0 border-transparent'}`}
      >
        <div className="p-8 w-80">
          <div
            className="flex items-center gap-2 mb-12 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center group-hover:bg-orange-500 transition-colors">
              <span className="font-bold text-xs italic">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter leading-none">
                ARENA{' '}
                <span className="text-[10px] bg-orange-600 px-1 rounded ml-1">
                  BETA
                </span>
              </h1>
              <p className="text-[10px] text-gray-400">
                Plataforma de Apuestas
              </p>
            </div>
          </div>

          <h3 className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-6">
            Selecciona un juego
          </h3>

          <div className="space-y-4">
            {GamesData.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className={`group relative w-full h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedGame.id === game.id ? game.accentColor : 'border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
              >
                <img
                  src={game.bgImage}
                  alt={game.title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-3">
                  <span className="text-xs font-bold uppercase tracking-tight">
                    {game.logo}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${selectedGame.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: isHome
              ? 'brightness(0.4) contrast(1.1)'
              : 'brightness(0.2) contrast(1.1) blur(3px)',
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0b0c1b] via-[#0b0c1b]/80 to-transparent opacity-90" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0b0c1b] via-transparent to-black/30" />

        <nav className="relative z-20 flex items-center px-12 py-8 gap-8">
          {!isHome ? (
            <div className="mr-auto flex items-center gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate('/')}
              >
                <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <span className="font-bold text-xs italic text-white">A</span>
                </div>
                <h1 className="text-xl font-bold tracking-tighter leading-none text-white">
                  ARENA
                </h1>
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> VOLVER AL INICIO
              </button>
            </div>
          ) : (
            <div className="mr-auto"></div>
          )}

          <button
            onClick={() => navigate('/login')}
            className={`text-xs font-bold transition-colors ${location.pathname === '/login' ? 'text-orange-500' : 'text-white hover:text-orange-400'}`}
          >
            INICIAR SESIÓN
          </button>
          <button
            onClick={() => navigate('/register')}
            className={`text-xs font-bold uppercase transition-colors ${location.pathname === '/register' ? 'text-orange-500' : 'text-white hover:text-orange-400'}`}
          >
            REGISTRARSE
          </button>
        </nav>

        <div
          className={`relative z-20 h-full flex flex-col justify-center pb-32 transition-all duration-700 ${isHome ? 'px-24 max-w-4xl' : 'px-8 items-center w-full mx-auto'}`}
        >
          <Outlet context={{ selectedGame }} />
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-left-8 { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slide-in-from-left-4 { from { transform: translateX(-10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slide-in-from-bottom-8 { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-in { animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-left-8 { animation-name: slide-in-from-left-8; }
        .slide-in-from-left-4 { animation-name: slide-in-from-left-4; }
        .slide-in-from-bottom-8 { animation-name: slide-in-from-bottom-8; }
        .duration-500 { animation-duration: 500ms; }
        .duration-700 { animation-duration: 700ms; }
      `,
        }}
      />
    </div>
  );
};

export default Layout;
