import React, { useState } from 'react';
import { type formBonoType } from '../Types/Types';
import { otorgarBono } from '../Services/MainServices';

interface FormBonoProps {
  onClose: () => void;
}

const FormBono: React.FC<FormBonoProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<formBonoType>({
    username: '',
    montoBono: 0,
    motivo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: llamar al servicio correspondiente
      console.log('Enviando bono con datos:', formData);
      await otorgarBono(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1">
          Username
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({
              ...formData,
              username: e.target.value,
            })
          }
          placeholder="Ej: john_doe"
          className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1">
          Monto
        </label>
        <input
          type="number"
          min="5"
          step="1"
          value={formData.montoBono}
          onChange={(e) =>
            setFormData({
              ...formData,
              montoBono: Number(e.target.value),
            })
          }
          placeholder="Ej: 10.00"
          className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1">
          Motivo
        </label>
        <input
          type="text"
          value={formData.motivo}
          onChange={(e) =>
            setFormData({
              ...formData,
              motivo: e.target.value,
            })
          }
          placeholder="Ej: Motivo de bono"
          className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-orange-600/20 transition-all flex justify-center items-center"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
};

export default FormBono;
