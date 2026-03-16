import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../../../Global/Api';
import { useAuth } from '../../../../Context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, X } from 'lucide-react';

type Notificacion = {
  tipo: 'exito' | 'error';
  mensaje: string;
} | null;

const IntegrationsSettings: React.FC = () => {
  const { token, hasGameAccount, fetchGameAccounts } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notificacion, setNotificacion] = useState<Notificacion>(null);
  const [vinculado, setVinculado] = useState(false);

  // Sincronizar estado con las cuentas reales del contexto
  useEffect(() => {
    setVinculado(hasGameAccount('DOTA'));
  }, [hasGameAccount]);

  const handleVincularDota = () => {
    if (!token) {
      setNotificacion({
        tipo: 'error',
        mensaje: 'Debes iniciar sesión primero.',
      });
      return;
    }

    window.location.href = `${BASE_URL}/api/steamauth/vincular-dota?token=${token}`;
  };

  useEffect(() => {
    const vinculacion = searchParams.get('vinculacion');
    const error = searchParams.get('error');

    if (vinculacion === 'exito') {
      setNotificacion({
        tipo: 'exito',
        mensaje: '¡Cuenta de Dota 2 vinculada exitosamente!',
      });
      setVinculado(true);
      fetchGameAccounts(); // Refrescar cuentas en el contexto global
      setSearchParams({});
    }

    if (error) {
      setNotificacion({
        tipo: 'error',
        mensaje: `Error al vincular: ${decodeURIComponent(error)}`,
      });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      <h2 className="text-2xl font-black text-white mb-8 tracking-wide">
        Integraciones
      </h2>

      {/* Notificación */}
      {notificacion && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg mb-6 border ${
            notificacion.tipo === 'exito'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {notificacion.tipo === 'exito' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 shrink-0" />
          )}
          <p className="text-sm font-medium flex-1">{notificacion.mensaje}</p>
          <button
            onClick={() => setNotificacion(null)}
            className="text-current opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-white mb-1">Steam</p>
            <p
              className={`text-sm ${vinculado ? 'text-green-400' : 'text-gray-400'}`}
            >
              {vinculado ? 'Conectado' : 'No conectado'}
            </p>
          </div>
          {vinculado ? (
            <span className="text-green-400 text-xs font-black px-4 py-2 rounded uppercase tracking-wider border border-green-500/30">
              Vinculado
            </span>
          ) : (
            <button
              onClick={handleVincularDota}
              className="bg-green-500 hover:bg-green-600 text-black text-xs font-black px-4 py-2 rounded uppercase tracking-wider transition-colors"
            >
              Vincular
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default IntegrationsSettings;
