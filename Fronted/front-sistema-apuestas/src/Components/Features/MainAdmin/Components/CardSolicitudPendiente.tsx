import React, { useState } from 'react';
import {
  DollarSign,
  CreditCard,
  ChevronRight,
  X,
  MessageCircle,
} from 'lucide-react';
import { type solicitudType } from '../Types/Types';
import { tomarSolicitud, procesarSolicitud } from '../Services/MainServices';

const CardSolicitudPendiente: React.FC<{
  solicitud: solicitudType;
  onTomar: () => void;
  name: string;
}> = ({ solicitud, onTomar, name }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    aprobar: true,
    nroOperacion: '',
    cuentaDestino: solicitud.cuentaDestino ?? '',
  });

  const handleOpenModal = () => {
    setStep(1);
    setShowDetails(true);
  };

  const handleTomarSolicitud = async () => {
    try {
      await tomarSolicitud({
        solicitudId: solicitud.solicitudId,
        tipo: solicitud.tipo,
      });
      alert('Solicitud tomada exitosamente');
      onTomar();
    } catch (error) {
      alert('Error al tomar la solicitud');
    }
  };

  const handleProcesar = async () => {
    try {
      await procesarSolicitud({
        solicitudId: solicitud.solicitudId,
        aprobar: formData.aprobar,
        nroOperacion: formData.nroOperacion,
        cuentaDestino: formData.cuentaDestino,
      });
      alert(
        formData.aprobar
          ? 'Solicitud aprobada exitosamente'
          : 'Solicitud rechazada',
      );
      setShowDetails(false);
      onTomar();
    } catch (error) {
      alert('Error al procesar la solicitud');
    }
  };

  // Ícono dinámico según el método
  const MethodIcon =
    solicitud.metodo.toLowerCase() === 'transferencia'
      ? CreditCard
      : DollarSign;

  return (
    <>
      <div className="group bg-[#1a1b2e] border border-white/5 hover:border-orange-500/30 rounded-xl p-4 transition-all hover:bg-[#1f2037]">
        <div className="flex items-center justify-between">
          {/* Info Izquierda */}
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-lg ${name === 'pendientes' ? 'bg-orange-600/10 text-orange-500' : 'bg-green-600/10 text-green-500'}`}
            >
              <MethodIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#141526] text-gray-400 border border-white/5">
                  {solicitud.tipo}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">
                  {solicitud.fechaEmision}
                </span>
              </div>
              <p className="text-sm font-semibold text-white">
                Usuario:{' '}
                <span className="text-gray-300">
                  {solicitud.username || 'Desconocido'}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                Método: {solicitud.metodo}
              </p>
            </div>
          </div>

          {/* Info Derecha & Botones */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-lg font-black text-white">
              S/ {solicitud.monto.toFixed(2)}
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
                  className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors shadow-lg shadow-orange-600/20"
                >
                  TOMAR
                </button>
              </div>
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

      {/* MODAL DE GESTIÓN Y WHATSAPP (MULTIPASO) */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141526] border border-white/10 rounded-2xl max-w-sm w-full p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setShowDetails(false);
                setStep(1);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
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
                  <p className="text-gray-400 text-xs">
                    Ponte en contacto para enviar constancias o coordinar la
                    transacción.
                  </p>
                </div>

                {/* Resumen de la Solicitud */}
                <div className="bg-[#1a1b2e] rounded-lg p-4 mb-6 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Usuario:
                    </span>
                    <span className="text-sm font-bold text-white">
                      {solicitud.username}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Monto:
                    </span>
                    <span className="text-sm font-black text-white">
                      S/ {solicitud.monto.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Método:
                    </span>
                    <span className="text-sm font-bold text-white">
                      {solicitud.metodo}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${solicitud.telefono?.replace(/\+/g, '')}?text=Hola%20${solicitud.username},%20me%20comunico%20desde%20Arena%20por%20tu%20solicitud%20de%20S/%20${solicitud.monto.toFixed(2)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#1ebd57] text-white font-bold rounded-lg shadow-lg shadow-[#25D366]/20 uppercase tracking-widest transition-all hover:scale-[1.02]"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>

                {name === 'pendientes' ? (
                  <button
                    onClick={() => {
                      handleTomarSolicitud();
                      setShowDetails(false);
                    }}
                    className="w-full mt-3 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg text-xs tracking-widest uppercase transition-colors"
                  >
                    Tomar Solicitud
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-4 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-xs tracking-widest uppercase transition-colors shadow-lg shadow-orange-600/20"
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
                    Procesar Operación
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Ingresa los datos finales para cerrar esta solicitud de{' '}
                    {solicitud.tipo}.
                  </p>
                </div>

                {/* Formulario de Decisión */}
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-2">
                    Acción
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setFormData({ ...formData, aprobar: true })
                      }
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
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
                        !formData.aprobar
                          ? 'bg-red-600 border-red-500 text-white'
                          : 'bg-[#1a1b2e] border-white/5 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>

                {/* Inputs de Operación */}
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase block mb-2">
                      Nro. de Operación
                    </label>
                    <input
                      type="text"
                      value={formData.nroOperacion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nroOperacion: e.target.value,
                        })
                      }
                      placeholder="Ej. XR-1200"
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cuentaDestino: e.target.value,
                        })
                      }
                      placeholder="Ej. 934933812"
                      className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Botones Finales */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg text-xs tracking-widest uppercase transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleProcesar}
                    className="flex-1 py-3 bg-white hover:bg-gray-200 text-black font-black rounded-lg text-xs tracking-widest uppercase transition-all hover:scale-[1.02] shadow-lg"
                  >
                    Guardar Cambios
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
