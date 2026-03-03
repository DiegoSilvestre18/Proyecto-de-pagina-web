import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { type solicitudType } from '../Types/Types';
import {
  getMisSolicitudes,
  getSolicitudesPendientes,
} from '../Services/MainServices';
import CardSolicitudPendiente from '../Components/CardSolicitudPendiente';

interface ListType {
  name: 'pendientes' | 'mis-solicitudes';
  refreshKey: number;
  onRefresh: () => void;
}

export const ListSolicitudes: React.FC<ListType> = ({
  name,
  refreshKey,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<solicitudType[]>([]);

  useEffect(() => {
    if (name === 'pendientes') {
      fetchSolicitudesPendientes();
    } else if (name === 'mis-solicitudes') {
      fetchMisSolicitudes();
    }
  }, [name, refreshKey]);

  const fetchSolicitudesPendientes = async () => {
    setLoading(true);
    const response = await getSolicitudesPendientes();
    console.log('Solicitudes Pendientes:', response);
    setSolicitudes(response);
    setLoading(false);
  };

  const fetchMisSolicitudes = async () => {
    setLoading(true);
    const response = await getMisSolicitudes();
    console.log('Mis Solicitudes:', response);
    setSolicitudes(response);
    setLoading(false);
  };

  const isPendiente = name === 'pendientes';

  return (
    <div className="bg-[#141526] border border-white/5 rounded-2xl p-6 h-full flex flex-col">
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
              key={solicitud.solicitudId}
              onTomar={onRefresh}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ListSolicitudes;
