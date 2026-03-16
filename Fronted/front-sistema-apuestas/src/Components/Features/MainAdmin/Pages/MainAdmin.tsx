import React, { useEffect, useState } from 'react';
import { LogOut, Search } from 'lucide-react';
import { useAuth } from '../../../../Context/AuthContext';
import ListSolicitudes from '../Pages/ListSolicitudes';
import ModalGestorUsuarios from '../Components/ModalGestorUsuarios';
import ModalCrearSala from '../../Salas/Components/ModalCrearSala';
import { solicitarSala } from '../../Salas/Services/ServiceSalas';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Puedes elegir la flecha o la casita

const MainAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalSala, setShowModalSala] = useState(false);
  const [isSubmittingSala, setIsSubmittingSala] = useState(false);
  const [formDataSala, setFormDataSala] = useState({
    juego: 'DOTA2',
    formato: '5v5 Captains Mode',
    costo: 6,
    tipoSala: 'BASICA',
    premioARepartir: 50,
    tipoPremio: 'REAL',
    mmrMinimo: 0,
    mmrMaximo: 10000,
  });

  useEffect(() => {
    if (user && user.rol.toUpperCase() === 'USER') return;
  }, [user]);

  const handleSubmitSalaAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSala(true);
    try {
      await solicitarSala({
        juego: formDataSala.juego,
        formato: formDataSala.formato,
        costoEntrada: formDataSala.costo,
        tipoSala: formDataSala.tipoSala,
        tipoPremio: formDataSala.tipoPremio || 'REAL',
        premioARepartir: formDataSala.premioARepartir,
        mmrMinimo: formDataSala.mmrMinimo,
        mmrMaximo: formDataSala.mmrMaximo,
      });
      alert('¡Sala oficial creada y publicada con éxito!');
      setShowModalSala(false);
      // window.location.reload(); // Opcional: si quieres que la página se refresque
    } catch (error) {
      alert('Error al crear la sala.');
    } finally {
      setIsSubmittingSala(false);
    }
  };

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

        {/* Botón para volver al lado del cliente */}
        <button
          onClick={() => navigate('/main')} // 👈 Cambia '/main' por la ruta real de tu inicio si es diferente
          className="flex items-center gap-2 px-4 py-2 mt-4 bg-gray-800/50 hover:bg-[#ea580c] text-gray-300 hover:text-white rounded-xl transition-all duration-300 border border-gray-700 hover:border-[#ea580c] group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium tracking-wide">Volver a la Arena</span>
        </button>

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
          {/* Botón Crear Sala (MANTENLO IGUAL) */}
          <div className="bg-[#141526] border border-white/5 rounded-2xl p-6 hover:border-orange-500/30 transition-all flex flex-col justify-center">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-white text-lg uppercase tracking-wider">
                  CREAR SALA OFICIAL
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Abre una sala pública de inmediato.
                </p>
              </div>
              <button
                onClick={() => setShowModalSala(true)}
                className="w-12 h-12 bg-orange-600 hover:bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-600/20 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </button>
            </div>
          </div>

          {/* 👇 NUEVO BOTÓN: GESTOR DE USUARIOS 👇 */}
          <button
            onClick={() => setShowModal(true)}
            className="group relative overflow-hidden rounded-2xl p-6 flex items-center justify-between border border-white/5 bg-[#141526] hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-600/10 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 text-left">
              <h3 className="text-xl font-black text-white mb-1 tracking-tight flex items-center gap-2">
                GESTIÓN DE JUGADORES
              </h3>
              <p className="text-gray-400 text-xs">
                Buscar usuarios, editar MMR manual, banear o dar bonos.
              </p>
            </div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <Search size={24} className="text-white" />
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

      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowModal(false)} // Si hace clic afuera, se cierra
        >
          <div
            className="bg-[#141526] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic adentro
          >
            {showModal && (
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setShowModal(false)}
              >
                {/* Llamamos al nuevo Súper Gestor de Usuarios */}
                <ModalGestorUsuarios onClose={() => setShowModal(false)} />
              </div>
            )}
          </div>
        </div>
      )}

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
      {showModalSala && (
        <ModalCrearSala
          userRol={user?.rol}
          formData={formDataSala}
          onFormChange={setFormDataSala}
          onSubmit={handleSubmitSalaAdmin}
          isSubmitting={isSubmittingSala}
          onClose={() => setShowModalSala(false)}
        />
      )}
    </div>
  );
};

export default MainAdmin;
