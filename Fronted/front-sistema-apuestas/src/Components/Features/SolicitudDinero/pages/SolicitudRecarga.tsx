import React from 'react';
import { Metodos, Monedas } from '../data/mockData';
import { type RecargaForm } from '../types/types';

const SolicitudRecarga: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">
        Solicitud de Recarga
      </h1>
      <p className="text-gray-400 mb-6">
        Aquí puedes solicitar una recarga de saldo para tu cuenta. Por favor,
        completa el formulario a continuación y nuestro equipo se pondrá en
        contacto contigo para procesar tu solicitud.
      </p>
      <form className="space-y-4 max-w-md">
        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-1"
            htmlFor="amount"
          >
            Monto a Recargar
          </label>
          <input
            type="number"
            id="amount"
            className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Ej. 50.00"
          />
          <label>Moneda</label>
          <select className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
            {Monedas.map((moneda) => (
              <option key={moneda} value={moneda}>
                {moneda}
              </option>
            ))}
          </select>
          <label>Método de Recarga</label>
          <select className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
            {Metodos.map((metodo) => (
              <option key={metodo} value={metodo}>
                {metodo}
              </option>
            ))}
          </select>
          {}
        </div>
      </form>
    </div>
  );
};

export default SolicitudRecarga;
