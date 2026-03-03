import { useState } from 'react';
import { Crosshair, Gavel, Play, LogOut } from 'lucide-react';
import { useAuth } from '../../../../Context/AuthContext';
import ListSolicitudes from '../Pages/ListSolicitudes';

const MainAdmin: React.FC = () => {
  const { user, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshAll = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen w-full bg-[#0b0c1b] text-white font-sans overflow-hidden flex flex-col">
      {/* HEADER ADMIN */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0b0c1b]/90 backdrop-blur-md z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-lg shadow-red-600/20">
            <span className="font-bold text-xs italic text-white">A</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none text-white">
              ARENA <span className="text-red-500">ADMIN</span>
            </h1>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase">
              Panel de Control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold leading-tight">
              {user?.username ?? 'Admin'}
            </p>
            <p className="text-[10px] text-green-400 font-semibold tracking-widest">
              EN LÍNEA
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/40"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-black tracking-tight mb-2">
            Resumen de Operaciones
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona la plataforma, aprueba recargas y modera la comunidad.
          </p>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Botón Crear Sala */}
          <button className="group relative overflow-hidden rounded-2xl p-6 flex items-center justify-between border border-white/5 bg-[#141526] hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-600/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 text-left">
              <h3 className="text-xl font-black text-white mb-1 tracking-tight flex items-center gap-2">
                CREAR SALA <Play size={16} className="text-orange-500" />
              </h3>
              <p className="text-gray-400 text-xs">
                Configura una partida oficial o torneo.
              </p>
            </div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <Crosshair size={24} className="text-white" />
            </div>
          </button>

          {/* Botón Aplicar Baneo */}
          <button className="group relative overflow-hidden rounded-2xl p-6 flex items-center justify-between border border-white/5 bg-[#141526] hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-600/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 text-left">
              <h3 className="text-xl font-black text-white mb-1 tracking-tight flex items-center gap-2">
                APLICAR BANEO
              </h3>
              <p className="text-gray-400 text-xs">
                Suspende usuarios o modifica MMR (Smurfs).
              </p>
            </div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <Gavel size={24} className="text-white" />
            </div>
          </button>
        </div>

        {/* ÁREA DE SOLICITUDES (2 Columnas) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          <ListSolicitudes
            name="pendientes"
            refreshKey={refreshKey}
            onRefresh={handleRefreshAll}
          />
          <ListSolicitudes
            name="mis-solicitudes"
            refreshKey={refreshKey}
            onRefresh={handleRefreshAll}
          />
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body { overflow: hidden; height: 100%; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2b3d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ea580c; }
      `,
        }}
      />
    </div>
  );
};

export default MainAdmin;
