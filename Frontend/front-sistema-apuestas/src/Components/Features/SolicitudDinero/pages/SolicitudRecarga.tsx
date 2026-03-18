import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CreditCard, DollarSign, QrCode, X, Info } from 'lucide-react';
import qrPlin from '../../../../assets/QR_PLIN.png';
import qrPayPal from '../../../../assets/QR_PAYPAL.jpg'; // 👈 1. Importamos tu nuevo QR
// import qrYape from '../../../../assets/QR_YAPE.png'; // 👈 Descomenta esto si también tienes una imagen para Yape

import { Monedas } from '../data/mockData';
import { postSolicitarRecarga } from '../Services/ServiceRecarga';
import { type RecargaForm } from '../types/types';
import FormInput from '../../../Common/FormInput';
import FormSelect from '../../../Common/FormSelect';

const SolicitudRecarga: React.FC = () => {
  const [formData, setFormData] = useState<RecargaForm>({
    monto: 0,
    moneda: 'PEN',
    metodo: 'Yape',
  });
  const [showQrModal, setShowQrModal] = useState(false);

  // Opciones dinámicas de método de pago
  const opcionesMetodo =
    formData.moneda === 'USD'
      ? [{ value: 'PayPal', label: 'PayPal' }]
      : [
          { value: 'Yape', label: 'Yape' },
          { value: 'Plin', label: 'Plin' },
        ];

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newData = { ...prev, [name]: name === 'monto' ? Number(value) : value };
      if (name === 'moneda') {
        newData.metodo = value === 'USD' ? 'PayPal' : 'Yape';
      }
      return newData;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.moneda === 'PEN' && formData.monto < 10) {
      alert('El monto mínimo de recarga es de 10 PEN');
      return;
    }
    if (formData.moneda === 'USD' && formData.monto < 4) {
      alert('El monto mínimo de recarga es de 4 USD');
      return;
    }
    setShowQrModal(true);
  };

  const handleConfirmPayment = async () => {
    // 👈 2. LA MAGIA DE LA CONVERSIÓN AQUÍ
    const dataParaAdmin = {
      ...formData,
      // Si eligió USD, multiplicamos por 3. Si es PEN, se queda igual.
      monto: formData.moneda === 'USD' ? formData.monto * 3 : formData.monto,
      // Forzamos a PEN para que en tu base de datos todo llegue estandarizado como Saldo
      moneda: 'PEN', 
      metodo: formData.metodo 
    };

    const response = await postSolicitarRecarga(dataParaAdmin);
    console.log(response);
    
    setShowQrModal(false);
    setFormData({ monto: 0, moneda: 'PEN', metodo: 'Yape' });
    alert('¡Solicitud de recarga enviada con éxito! La validaremos en breve.');
  };

  // 👈 3. Lógica para saber qué QR mostrar
  let qrActual = qrPlin; // Por defecto Plin (o puedes poner el de Yape si lo tienes)
  if (formData.metodo === 'PayPal') {
    qrActual = qrPayPal;
  }
  // if (formData.metodo === 'Yape') { qrActual = qrYape; } // Descomenta si tienes QR de Yape

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
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-blue-100 font-bold text-sm mb-1">Información importante</p>
            <p className="text-blue-200/80 text-xs">
              El tipo de cambio actual es: <strong className="text-white">1 dólar = 3 soles de saldo</strong>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <div>
            <FormInput
              icon={DollarSign}
              type="number"
              label="Monto a Recargar"
              placeholder="0.00"
              name="monto"
              value={formData.monto ? String(formData.monto) : ''}
              onChange={handlerChange}
            />
            <p className="text-[10px] text-gray-500 mt-1.5 ml-1 font-bold">
              MÍNIMO: {formData.moneda === 'PEN' ? '10 PEN' : '4 USD'}
            </p>
          </div>

          <FormSelect
            icon={DollarSign}
            label="Moneda"
            name="moneda"
            value={formData.moneda}
            onChange={handlerChange}
            options={Monedas.map((m) => ({ value: m, label: m }))}
          />

          <div className="md:col-span-2">
            <FormSelect
              icon={CreditCard}
              label="Método de Recarga"
              name="metodo"
              value={formData.metodo}
              onChange={handlerChange}
              options={opcionesMetodo}
            />
          </div>
        </div>

        <div className="text-center mt-8 mb-6">
          <p className="text-sm text-[#25D366] font-bold bg-[#25D366]/10 py-2 px-4 rounded-lg inline-block border border-[#25D366]/20">
            📱 Nuestro equipo se mantendrá en contacto contigo por WhatsApp
          </p>
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

              {/* 👈 4. Contenedor del QR dinámico */}
              <div className="bg-white p-3 rounded-xl mb-4 flex items-center justify-center shadow-[0_0_30px_rgba(116,34,132,0.15)]">
                <img src={qrActual} alt={`QR ${formData.metodo}`} className="w-40 h-40 rounded object-contain" />
              </div>

              {/* Resumen del Pago */}
              <div className="bg-[#1a1b2e] rounded-lg p-3 mb-4 border border-white/5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-400 font-bold">
                    MONTO A TRANSFERIR:
                  </span>
                  <span className="text-base font-black text-[#742284]">
                    {formData.moneda === 'PEN' ? 'S/ ' : '$ '}
                    {formData.monto ? formData.monto.toFixed(2) : '0.00'}
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