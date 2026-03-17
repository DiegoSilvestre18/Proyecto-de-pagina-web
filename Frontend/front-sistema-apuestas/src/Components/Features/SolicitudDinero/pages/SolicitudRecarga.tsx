import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CreditCard, DollarSign, QrCode, X } from 'lucide-react';
import qrPlin from '../../../../assets/QR_PLIN.png';
import { Metodos, Monedas } from '../data/mockData';
import { postSolicitarRecarga } from '../Services/ServiceRecarga';
import { type RecargaForm } from '../types/types';
import FormInput from '../../../Common/FormInput';
import FormSelect from '../../../Common/FormSelect';

const SolicitudRecarga: React.FC = () => {
  const [formData, setFormData] = useState<RecargaForm>({
    monto: 0,
    moneda: Monedas[0],
    metodo: Metodos[0],
  });
  const [showQrModal, setShowQrModal] = useState(false);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monto' ? Number(value) : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.monto <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }
    setShowQrModal(true);
  };

  const handleConfirmPayment = async () => {
    const response = await postSolicitarRecarga(formData);
    console.log(response);
    setShowQrModal(false);
    setFormData({ monto: 0, moneda: Monedas[0], metodo: Metodos[0] });
    alert('¡Solicitud de recarga enviada con éxito! La validaremos en breve.');
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 pb-20 px-4 lg:px-12 pt-8 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tight text-white mb-3">
          Solicitud de Recarga
        </h2>
        <p className="text-gray-400 text-sm">
          Completa el formulario para solicitar una recarga de saldo. Nuestro
          equipo procesará tu solicitud lo antes posible.
        </p>
      </div>

      <form
        className="bg-[#141526] border border-white/5 rounded-2xl p-6 lg:p-10 shadow-2xl"
        onSubmit={handleFormSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Monto */}
          <FormInput
            icon={DollarSign}
            type="number"
            label="Monto a Recargar"
            placeholder="0.00"
            name="monto"
            value={formData.monto ? String(formData.monto) : ''}
            onChange={handlerChange}
          />

          {/* Moneda */}
          <FormSelect
            icon={DollarSign}
            label="Moneda"
            name="moneda"
            value={formData.moneda}
            onChange={handlerChange}
            options={Monedas.map((m) => ({ value: m, label: m }))}
          />

          {/* Método */}
          <div className="md:col-span-2">
            <FormSelect
              icon={CreditCard}
              label="Método de Recarga"
              name="metodo"
              value={formData.metodo}
              onChange={handlerChange}
              options={Metodos.map((m) => ({ value: m, label: m }))}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-white hover:bg-gray-200 text-black font-black rounded-lg shadow-lg uppercase tracking-widest transition-all hover:scale-[1.02]"
        >
          Solicitar Recarga
        </button>
      </form>

      {/* ====== MODAL DEL CÓDIGO QR ====== */}
      {showQrModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowQrModal(false)}
          >
            <div
              className="bg-[#141526] border border-white/10 rounded-2xl max-w-xs w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-4 mt-1">
                <div className="w-12 h-12 bg-[#742284]/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-[#742284]/50">
                  <QrCode size={24} className="text-[#742284]" />
                </div>
                <h3 className="text-xl font-black text-white mb-1">
                  Escanea y Paga
                </h3>
                <p className="text-gray-400 text-xs">
                  Transfiere el monto exacto para procesar tu recarga.
                </p>
              </div>

              {/* Contenedor del QR */}
              <div className="bg-white p-3 rounded-xl mb-4 flex items-center justify-center shadow-[0_0_30px_rgba(116,34,132,0.15)]">
                <img src={qrPlin} alt="QR Yape" className="w-40 h-40 rounded" />
              </div>

              {/* Resumen del Pago */}
              <div className="bg-[#1a1b2e] rounded-lg p-3 mb-4 border border-white/5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-400 font-bold">
                    MONTO A TRANSFERIR:
                  </span>
                  <span className="text-base font-black text-[#742284]">
                    S/ {formData.monto ? formData.monto.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-400 font-bold">
                    MONEDA:
                  </span>
                  <span className="text-sm font-bold text-white">
                    {formData.moneda}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-bold">
                    MÉTODO:
                  </span>
                  <span className="text-sm font-bold text-white">
                    {formData.metodo}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmPayment}
                className="w-full py-3 bg-[#742284] hover:bg-[#5c1b69] text-white font-bold rounded-lg shadow-lg shadow-[#742284]/20 uppercase tracking-widest transition-all text-sm"
              >
                Ya realicé el pago
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SolicitudRecarga;
