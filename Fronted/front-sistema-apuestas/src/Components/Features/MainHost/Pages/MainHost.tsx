import React, { useState } from 'react';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext';
import ModalCrearSala from '../../Salas/Components/ModalCrearSala';
import { solicitarSala } from '../../Salas/Services/ServiceSalas';
import ListSolicitudes from '../../MainAdmin/Pages/ListSolicitudes';
import { FORMATOS_VALIDOS } from '../../Salas/constants/formatos';

interface FormDataSala {
  juego: string;
  formato: string;
  costo: number;
  tipoSala: string;
  premioARepartir: number;
  tipoPremio: string;
  mmrMinimo: number;
  mmrMaximo: number;
}

const MainHost: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [refreshKey, setRefreshKey] = useState(0);
  const [showModalSala, setShowModalSala] = useState(false);
  const [isSubmittingSala, setIsSubmittingSala] = useState(false);

  const [formDataSala, setFormDataSala] = useState<FormDataSala>({
    juego: 'DOTA2',
    formato: FORMATOS_VALIDOS.ALL_PICK_5V5,
    costo: 6,
    tipoSala: 'BASICA',
    premioARepartir: 50,
    tipoPremio: 'REAL',
    mmrMinimo: 0,
    mmrMaximo: 10000,
  });

  const handleSubmitSalaHost = async (e: React.FormEvent) => {
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
      alert('¡Sala creada con éxito!');
      setShowModalSala(false);
      setRefreshKey((prev) => prev + 1);
    } catch {
      alert('Error al crear la sala.');
    } finally {
      setIsSubmittingSala(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#0b0c1b] text-white font-sans overflow-hidden flex flex-col">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0b0c1b]/90 backdrop-blur-md z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center shadow-lg shadow-orange-600/20">
            <span className="font-bold text-xs italic text-white">H</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none text-white">
              ARENA <span className="text-orange-500">HOST</span>
            </h1>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase">
              Control de Salas
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/main')}
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
              {user?.username ?? 'Host'}
            </p>
            <p className="text-[10px] text-green-400 font-semibold tracking-widest">
              EN LÍNEA
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/40"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-black tracking-tight mb-2">
            Gestión de Salas
          </h2>
          <p className="text-gray-400 text-sm">
            Crea salas y finaliza partidas. El rol Host no procesa recargas,
            retiros ni bonos.
          </p>
        </div>

        <div className="bg-[#141526] border border-white/5 rounded-2xl p-6 hover:border-orange-500/30 transition-all flex flex-col justify-center mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-black text-white text-lg uppercase tracking-wider">
                CREAR SALA
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Publica salas y administra sus resultados.
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          <ListSolicitudes
            name="pendientes"
            refreshKey={refreshKey}
            onRefresh={() => setRefreshKey((prev) => prev + 1)}
            soloSalas
          />
          <ListSolicitudes
            name="mis-solicitudes"
            refreshKey={refreshKey}
            onRefresh={() => setRefreshKey((prev) => prev + 1)}
            soloSalas
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

      {showModalSala && (
        <ModalCrearSala
          userRol={user?.rol}
          formData={formDataSala}
          onFormChange={setFormDataSala}
          onSubmit={handleSubmitSalaHost}
          isSubmitting={isSubmittingSala}
          onClose={() => setShowModalSala(false)}
        />
      )}
    </div>
  );
};

export default MainHost;
