import React from 'react';

interface FormDataSala {
  juego: string;
  formato: string;
  costo: number;
}

interface ModalCrearSalaProps {
  userRol?: string;
  formData: FormDataSala;
  onFormChange: (data: FormDataSala) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const ModalCrearSala: React.FC<ModalCrearSalaProps> = ({
  userRol,
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-[#141526] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-white">
            {userRol === 'SUPERADMIN' || userRol === 'HOST'
              ? 'Configurar Nueva Sala'
              : 'Solicitar Sala'}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {userRol === 'SUPERADMIN' || userRol === 'HOST'
              ? 'Crea una partida oficial que aparecerá al instante.'
              : 'Arma tu partida. Un administrador la aprobará en breve.'}
          </p>
        </div>

        {/* Agregamos el onSubmit al form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Juego */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              JUEGO
            </label>
            <select
              value={formData.juego}
              onChange={(e) =>
                onFormChange({ ...formData, juego: e.target.value })
              }
              className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="DOTA2">Dota 2</option>
              <option value="VALORANT">Valorant</option>
            </select>
          </div>

          {/* Formato */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              FORMATO
            </label>
            <select
              value={formData.formato}
              onChange={(e) =>
                onFormChange({ ...formData, formato: e.target.value })
              }
              className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="1v1">1 vs 1 (Duelo)</option>
              <option value="5v5 All Pick">5 vs 5 (All Pick)</option>
              <option value="5v5 Captains Mode">5 vs 5 (Captains Mode)</option>
            </select>
          </div>

          {/* Cuota (Apuesta) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              APUESTA INICIAL (S/)
            </label>
            <input
              type="number"
              min="5"
              step="1"
              value={formData.costo}
              onChange={(e) =>
                onFormChange({ ...formData, costo: Number(e.target.value) })
              }
              placeholder="Ej: 10.00"
              className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Botones de acción */}
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
      </div>
    </div>
  );
};

export default ModalCrearSala;
