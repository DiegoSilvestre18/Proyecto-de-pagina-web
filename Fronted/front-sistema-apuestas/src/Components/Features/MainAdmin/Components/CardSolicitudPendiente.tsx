import React, { useState } from 'react';
import {
  DollarSign,
  CreditCard,
  ChevronRight,
  X,
  MessageCircle,
  Gamepad2,
} from 'lucide-react';
import { type solicitudType } from '../Types/Types';

import {
  tomarSolicitud,
  procesarSolicitud,
  tomarSala,
  procesarSala,
} from '../Services/MainServices';

// 👇 1. Agregamos onAbrirModalGanador como propiedad opcional
const CardSolicitudPendiente: React.FC<{
  solicitud: solicitudType;
  onTomar: () => void;
  name: string;
  onAbrirModalGanador?: () => void;
}> = ({ solicitud, onTomar, name, onAbrirModalGanador }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    aprobar: true,
    nroOperacion: '',
    cuentaDestino: solicitud.cuentaDestino ?? '',

    costoSala: solicitud.monto || 0,
    nombreLobby: '',
    passwordLobby: '',
  });

  const isSala = solicitud.tipo.toUpperCase() === 'SALA';

  const handleOpenModal = () => {
    setStep(1);
    setShowDetails(true);
  };

  const handleTomarSolicitud = async () => {
    setLoading(true);
    try {
      if (isSala) {
        await tomarSala(solicitud.solicitudId);
      } else {
        await tomarSolicitud({
          solicitudId: solicitud.solicitudId,
          tipo: solicitud.tipo,
        });
      }
      alert('Solicitud tomada exitosamente');
      setShowDetails(false);
      setStep(1);
      onTomar();
    } catch (error) {
      alert('Error al tomar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleProcesar = async () => {
    setLoading(true);
    try {
      if (isSala) {
        await procesarSala(
          solicitud.solicitudId,
          formData.aprobar,
          formData.costoSala,
          formData.nombreLobby,
          formData.passwordLobby,
        );
        alert(
          formData.aprobar
            ? 'Sala aprobada y visible para todos'
            : 'Solicitud de sala rechazada',
        );
      } else {
        await procesarSolicitud(
          {
            solicitudId: solicitud.solicitudId,
            aprobar: formData.aprobar,
            nroOperacion: formData.nroOperacion,
            cuentaDestino: formData.cuentaDestino,
          },
          solicitud.tipo.toLowerCase(),
        );
        alert(
          formData.aprobar
            ? 'Solicitud aprobada exitosamente'
            : 'Solicitud rechazada',
        );
      }

      setShowDetails(false);
      onTomar();
    } catch (error) {
      alert('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  let MethodIcon = DollarSign;
  if (isSala) MethodIcon = Gamepad2;
  else if (solicitud.metodo.toLowerCase() === 'transferencia')
    MethodIcon = CreditCard;

  let iconBgColor =
    name === 'pendientes'
      ? 'bg-orange-600/10 text-orange-500'
      : 'bg-green-600/10 text-green-500';
  if (isSala) {
    iconBgColor =
      name === 'pendientes'
        ? 'bg-purple-600/10 text-purple-500'
        : 'bg-blue-600/10 text-blue-500';
  }

  return (
    <>
      <div
        className={`group bg-[#1a1b2e] border border-white/5 hover:border-${isSala ? 'purple' : 'orange'}-500/30 rounded-xl p-4 transition-all hover:bg-[#1f2037]`}
      >
        <div className="flex items-center justify-between">
          {/* Info Izquierda */}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${iconBgColor}`}>
              <MethodIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#141526] text-gray-400 border border-white/5">
                  {solicitud.tipo}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">
                  {solicitud.fechaEmision || 'HOY'}
                </span>
                {/* 👇 Indicador visual si está en curso 👇 */}
                {isSala && solicitud.estado === 'EN_CURSO' && (
                  <span className="text-[10px] text-yellow-500 font-bold uppercase animate-pulse border border-yellow-500/30 px-2 py-0.5 rounded bg-yellow-500/10">
                    EN CURSO
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-white">
                {isSala ? 'Creador:' : 'Usuario:'}{' '}
                <span className="text-gray-300">
                  {solicitud.username || 'Desconocido'}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                {isSala ? 'Formato:' : 'Método:'} {solicitud.metodo}
              </p>
            </div>
          </div>

          {/* Info Derecha & Botones */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-lg font-black text-white">
              S/ {solicitud.monto?.toFixed(2) || '0.00'}
            </span>

            {name === 'pendientes' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleOpenModal}
                  className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded transition-colors"
                >
                  DETALLES
                </button>
                <button
                  onClick={handleTomarSolicitud}
                  disabled={loading}
                  className={`text-white text-xs font-bold px-4 py-1.5 rounded transition-colors shadow-lg ${isSala ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/20'}`}
                >
                  {loading ? 'CARGANDO...' : 'TOMAR'}
                </button>
              </div>
            ) : // 👇 2. Lógica para mostrar el botón de GANADOR o GESTIONAR 👇
            isSala && solicitud.estado === 'EN_CURSO' ? (
              <button
                onClick={onAbrirModalGanador}
                className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-xs font-bold px-4 py-1.5 rounded transition-colors border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
              >
                🏆 FINALIZAR
              </button>
            ) : (
              <button
                onClick={handleOpenModal}
                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors border border-white/10"
              >
                GESTIONAR <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE GESTIÓN (MULTIPASO) - (El resto sigue exactamente igual) */}
      {showDetails && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141526] border border-white/10 rounded-2xl max-w-sm w-full p-8 shadow-2xl relative">
            <button
              onClick={() => {
                if (loading) return;
                setShowDetails(false);
                setStep(1);
              }}
              disabled={loading}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <X size={20} />
            </button>

            {step === 1 ? (
              /* PASO 1: CONTACTO Y RESUMEN */
              <div>
                <div className="text-center mb-6 mt-2">
                  <div className="w-16 h-16 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#25D366]/50 shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                    <MessageCircle size={32} className="text-[#25D366]" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">
                    Contactar Usuario
                  </h3>
                </div>

                {/* Resumen de la Solicitud */}
                <div className="bg-[#1a1b2e] rounded-lg p-4 mb-6 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {isSala ? 'Creador:' : 'Usuario:'}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {solicitud.username}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {isSala ? 'Cuota:' : 'Monto:'}
                    </span>
                    <span className="text-sm font-black text-white">
                      S/ {solicitud.monto?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${solicitud.telefono?.replace(/\+/g, '')}?text=Hola%20${solicitud.username},%20me%20comunico%20desde%20Arena%20por%20tu%20solicitud%20de%20${solicitud.tipo}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#1ebd57] text-white font-bold rounded-lg shadow-lg shadow-[#25D366]/20 uppercase tracking-widest transition-all"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>

                {name === 'pendientes' ? (
                  <button
                    onClick={handleTomarSolicitud}
                    disabled={loading}
                    className="w-full mt-3 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg text-xs tracking-widest uppercase transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Tomando solicitud...' : 'Tomar Solicitud'}
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className={`w-full mt-4 py-3 text-white font-bold rounded-lg text-xs tracking-widest uppercase transition-colors shadow-lg ${isSala ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/20'}`}
                  >
                    Siguiente
                  </button>
                )}
              </div>
            ) : (
              /* PASO 2: PROCESAR SOLICITUD */
              <div>
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-xl font-black text-white mb-1">
                    Procesar {isSala ? 'Sala' : 'Operación'}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {isSala
                      ? '¿Deseas aprobar esta sala para que sea visible públicamente?'
                      : `Ingresa los datos finales para cerrar esta solicitud de ${solicitud.tipo}.`}
                  </p>
                </div>

                {/* Formulario de Decisión */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setFormData({ ...formData, aprobar: true })
                      }
                      disabled={loading}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
                        formData.aprobar
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-[#1a1b2e] border-white/5 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, aprobar: false })
                      }
                      disabled={loading}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
                        !formData.aprobar
                          ? 'bg-red-600 border-red-500 text-white'
                          : 'bg-[#1a1b2e] border-white/5 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      Rechazar
                    </button>
                  </div>

                  {/* Input para modificar la cuota (SOLO SALAS) */}
                  {isSala && formData.aprobar && (
                    <div className="space-y-4 mb-8 mt-4">
                      <div>
                        <label className="text-[10px] font-bold text-orange-500 tracking-widest uppercase block mb-2">
                          Modificar Cuota Inicial (S/)
                        </label>
                        <input
                          type="number"
                          min="5"
                          value={formData.costoSala}
                          disabled={loading}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              costoSala: Number(e.target.value),
                            })
                          }
                          className="w-full bg-[#1a1b2e] border border-orange-500/50 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-purple-400 tracking-widest uppercase block mb-2">
                          Nombre del Lobby en Dota 2
                        </label>
                        <input
                          type="text"
                          value={formData.nombreLobby}
                          disabled={loading}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nombreLobby: e.target.value,
                            })
                          }
                          placeholder="Ej. WachiCup_55"
                          className="w-full bg-[#1a1b2e] border border-purple-500/50 rounded-lg p-3 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-purple-400 tracking-widest uppercase block mb-2">
                          Contraseña del Lobby
                        </label>
                        <input
                          type="text"
                          value={formData.passwordLobby}
                          disabled={loading}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              passwordLobby: e.target.value,
                            })
                          }
                          placeholder="Ej. dota123"
                          className="w-full bg-[#1a1b2e] border border-purple-500/50 rounded-lg p-3 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                        />
                      </div>

                      <p className="text-[10px] text-gray-500 mt-1">
                        La sala se publicará a nombre del capitán:{' '}
                        <span className="text-white font-bold">
                          {solicitud.username}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Inputs de Operación (SE OCULTAN SI ES UNA SALA) */}
                  {!isSala && (
                    <div className="space-y-4 mb-8 mt-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-2">
                          Nro. de Operación
                        </label>
                        <input
                          type="text"
                          value={formData.nroOperacion}
                          disabled={loading}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nroOperacion: e.target.value,
                            })
                          }
                          className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-2">
                          Cuenta Destino
                        </label>
                        <input
                          type="text"
                          value={formData.cuentaDestino}
                          disabled={loading}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cuentaDestino: e.target.value,
                            })
                          }
                          className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones Finales */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg text-xs tracking-widest uppercase transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleProcesar}
                    disabled={loading}
                    className="flex-1 py-3 bg-white hover:bg-gray-200 text-black font-black rounded-lg text-xs tracking-widest uppercase transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Procesando...' : 'Confirmar Acción'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CardSolicitudPendiente;
