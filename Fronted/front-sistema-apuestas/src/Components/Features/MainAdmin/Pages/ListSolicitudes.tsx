import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { type solicitudType } from '../Types/Types';
import {
  getMisSolicitudes,
  getSolicitudesPendientes,
} from '../Services/MainServices';
import { getSalas } from '../../Salas/Services/ServiceSalas';
import CardSolicitudPendiente from '../Components/CardSolicitudPendiente';
import { type Sala } from '../../Salas/types/types';

// 👇 1. Importamos useAuth para tener el token para la petición
import { useAuth } from '../../../../Context/AuthContext';

interface ListType {
  name: 'pendientes' | 'mis-solicitudes';
  refreshKey: number;
  onRefresh: () => void;
  onAbrirModalGanador?: () => void;
}

export const ListSolicitudes: React.FC<ListType> = ({
  name,
  refreshKey,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<solicitudType[]>([]);

  // 👇 2. Estados para controlar el Modal de Ganador
  const { token } = useAuth();
  const [salaAFinalizar, setSalaAFinalizar] = useState<number | null>(null);
  const [procesandoGanador, setProcesandoGanador] = useState(false);

  useEffect(() => {
    if (name === 'pendientes') {
      fetchSolicitudesPendientes();
    } else if (name === 'mis-solicitudes') {
      fetchMisSolicitudes();
    }
  }, [name, refreshKey]);

  const fetchSolicitudesPendientes = async () => {
    setLoading(true);
    try {
      const finanzasResp = await getSolicitudesPendientes();
      const finanzasArr = Array.isArray(finanzasResp) ? finanzasResp : [];

      const salasResp = await getSalas();
      const salasArr = Array.isArray(salasResp) ? salasResp : [];

      const salasPendientes: solicitudType[] = salasArr
        .filter((sala: Sala) => sala.estado === 'PENDIENTE_APROBACION')
        .map((sala: Sala) => ({
          solicitudId: sala.id,
          tipo: 'SALA',
          fechaEmision: sala.fecha || 'HOY',
          username: sala.creador,
          metodo: sala.formato,
          monto: sala.costo,
          moneda: 'PEN',
          cuentaDestino: '',
          usuarioId: 0,
          telefono: '',
          email: '',
          // 👇 Guardamos el estado original para saber si mostrar el botón de Finalizar luego
          estado: sala.estado,
        }));

      setSolicitudes([...finanzasArr, ...salasPendientes]);
    } catch (error) {
      console.error('Error al traer pendientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMisSolicitudes = async () => {
    setLoading(true);
    try {
      const finanzasResp = await getMisSolicitudes();
      const finanzasArr = Array.isArray(finanzasResp) ? finanzasResp : [];

      const salasResp = await getSalas();
      const salasArr = Array.isArray(salasResp) ? salasResp : [];
      const salasActivas: solicitudType[] = salasArr
        // 👇 3. AHORA TAMBIÉN FILTRAMOS LAS SALAS 'EN_CURSO'
        .filter(
          (sala: Sala) =>
            sala.estado === 'EN_REVISION' || sala.estado === 'EN_CURSO',
        )
        .map((sala: Sala) => ({
          solicitudId: sala.id,
          tipo: 'SALA',
          fechaEmision: sala.fecha || 'HOY',
          username: sala.creador,
          metodo: sala.formato,
          monto: sala.costo,
          moneda: 'PEN',
          cuentaDestino: '',
          usuarioId: 0,
          telefono: '',
          email: '',
          estado: sala.estado, // Pasamos el estado a la tarjeta
        }));

      setSolicitudes([...finanzasArr, ...salasActivas]);
    } catch (error) {
      console.error('Error al traer mis solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 4. Función para enviar al ganador al backend
  const handleFinalizarPartida = async (
    salaId: number,
    equipoGanador: string,
  ) => {
    try {
      setProcesandoGanador(true);

      // Asegúrate de poner el PUERTO correcto de tu C#
      const response = await fetch(
        'https://localhost:5127/api/Sala/finalizar',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            salaId: salaId,
            equipoGanador: equipoGanador, // 'EQUIPO1' o 'EQUIPO2'
          }),
        },
      );

      if (response.ok) {
        alert('🏆 ¡Partida finalizada y premios repartidos a los ganadores!');
        setSalaAFinalizar(null);
        onRefresh(); // Recargamos la lista automáticamente
      } else {
        const error = await response.json();
        alert('Error: ' + error.mensaje);
      }
    } catch (error) {
      console.error('Error al finalizar la partida:', error);
      alert('Hubo un problema de conexión.');
    } finally {
      setProcesandoGanador(false);
    }
  };

  const isPendiente = name === 'pendientes';

  return (
    <div className="bg-[#141526] border border-white/5 rounded-2xl p-6 h-full flex flex-col relative">
      {/* Cabecera de la lista */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPendiente ? 'bg-orange-600/20 text-orange-500' : 'bg-green-600/20 text-green-500'}`}
          >
            {isPendiente ? <Clock size={16} /> : <CheckCircle2 size={16} />}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">
              {isPendiente ? 'Pool de Pendientes' : 'Mis Tareas Activas'}
            </h3>
            <p className="text-xs text-gray-400">
              {isPendiente
                ? 'Solicitudes esperando ser atendidas'
                : 'Solicitudes que estás gestionando'}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${isPendiente ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}
        >
          {solicitudes.length}
        </span>
      </div>

      {/* Contenido de la lista */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 space-y-3">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold tracking-widest uppercase">
              Cargando...
            </p>
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-600">
            <AlertCircle size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No hay solicitudes en esta bandeja.</p>
          </div>
        ) : (
          solicitudes.map((solicitud) => (
            <CardSolicitudPendiente
              name={name}
              solicitud={solicitud}
              key={`${solicitud.tipo}-${solicitud.solicitudId}`}
              onTomar={onRefresh}
              // 👇 5. Pasamos la función para abrir el modal a la tarjeta
              onAbrirModalGanador={() =>
                setSalaAFinalizar(solicitud.solicitudId)
              }
            />
          ))
        )}
      </div>

      {/* 👇 6. AQUÍ ESTÁ EL MODAL FLOTANTE 👇 */}
      {salaAFinalizar !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="bg-[#1a1b2e] p-8 rounded-2xl border border-white/10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-white text-center mb-2 uppercase tracking-tight">
              Declarar <span className="text-orange-500">Ganador</span>
            </h2>
            <p className="text-gray-400 text-sm text-center mb-8">
              Selecciona al equipo que ganó la sala #{salaAFinalizar}. Los
              premios se repartirán automáticamente.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Botón Radiant */}
              <button
                onClick={() =>
                  handleFinalizarPartida(salaAFinalizar, 'EQUIPO1')
                }
                disabled={procesandoGanador}
                className="flex flex-col items-center gap-4 p-6 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🛡️</span>
                </div>
                <span className="text-blue-400 font-bold tracking-widest uppercase">
                  RADIANT
                </span>
              </button>

              {/* Botón Dire */}
              <button
                onClick={() =>
                  handleFinalizarPartida(salaAFinalizar, 'EQUIPO2')
                }
                disabled={procesandoGanador}
                className="flex flex-col items-center gap-4 p-6 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] group-hover:scale-110 transition-transform">
                  <span className="text-3xl">⚔️</span>
                </div>
                <span className="text-red-400 font-bold tracking-widest uppercase">
                  DIRE
                </span>
              </button>
            </div>

            <button
              onClick={() => setSalaAFinalizar(null)}
              disabled={procesandoGanador}
              className="w-full mt-8 py-3 text-gray-500 text-sm font-bold uppercase tracking-widest hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      {/* 👆 FIN DEL MODAL 👆 */}
    </div>
  );
};

export default ListSolicitudes;
