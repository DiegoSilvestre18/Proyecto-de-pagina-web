import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { CreditCard, DollarSign, CheckCircle, X } from 'lucide-react';
import { Metodos, Monedas } from '../data/mockData';
import { postSolicitarRetiro } from '../Services/ServiceRecarga';
import { type RetiroForm } from '../types/types';
import { useAuth } from '../../../../Context/AuthContext';
import FormInput from '../../../Common/FormInput';
import FormSelect from '../../../Common/FormSelect';

const SolicitudRetiro: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RetiroForm>({
    monto: 0,
    moneda: Monedas[0],
    metodo: Metodos[0],
    cuentaDestino: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monto' ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const saldo = user?.saldoReal ?? 0;
    if (saldo < 30) {
      setError('Tu saldo debe ser mayor a S/ 30.00 para solicitar un retiro.');
      return;
    }
    if (formData.monto <= 0) {
      setError('El monto debe ser mayor a 0.');
      return;
    }
    if (formData.monto > saldo) {
      setError('El monto no puede ser mayor a tu saldo disponible.');
      return;
    }
    if (!formData.cuentaDestino.trim()) {
      setError('Debes ingresar una cuenta destino.');
      return;
    }

    try {
      await postSolicitarRetiro(formData);
      setShowModal(true);
    } catch {
      setError('Ocurrió un error al enviar la solicitud. Inténtalo de nuevo.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/main');
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 pb-20 px-4 lg:px-12 pt-8 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tight text-white mb-3">
          Solicitud de Retiro
        </h2>
        <p className="text-gray-400 text-sm">
          Completa el formulario para solicitar un retiro. Nuestro equipo
          procesará tu solicitud lo antes posible.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Saldo disponible:{' '}
          <span className="text-white font-bold">
            S/ {user?.saldoReal?.toFixed(2) ?? '0.00'}
          </span>
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium rounded-lg px-4 py-3 text-center">
          {error}
        </div>
      )}

      <form
        className="bg-[#141526] border border-white/5 rounded-2xl p-6 lg:p-10 shadow-2xl"
        onSubmit={handleFormSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Monto */}
          <FormInput
            icon={DollarSign}
            type="number"
            label="Monto a Retirar"
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
          <FormSelect
            icon={CreditCard}
            label="Método de Retiro"
            name="metodo"
            value={formData.metodo}
            onChange={handlerChange}
            options={Metodos.map((m) => ({ value: m, label: m }))}
          />

          {/* Cuenta destino */}
          <FormInput
            icon={CreditCard}
            type="text"
            label="Cuenta Destino"
            placeholder="Número de cuenta o celular"
            name="cuentaDestino"
            value={formData.cuentaDestino}
            onChange={handlerChange}
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-white hover:bg-gray-200 text-black font-black rounded-lg shadow-lg uppercase tracking-widest transition-all hover:scale-[1.02]"
        >
          Solicitar Retiro
        </button>
      </form>

      {/* ====== MODAL DE CONFIRMACIÓN ====== */}
      {showModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleCloseModal}
          >
            <div
              className="bg-[#141526] border border-white/10 rounded-2xl max-w-sm w-full p-8 shadow-2xl relative text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">
                ¡Retiro Enviado!
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Tu solicitud de retiro ha sido enviada exitosamente. Estaremos
                en contacto contigo para procesarla.
              </p>
              <button
                onClick={handleCloseModal}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-black font-black rounded-lg uppercase tracking-widest transition-all hover:scale-[1.02]"
              >
                Aceptar
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SolicitudRetiro;
