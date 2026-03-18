import React from 'react';
import { Shield, X } from 'lucide-react';
import { FORMATOS_VALIDOS } from '../constants/formatos';

interface FormDataSala {
  juego: string;
  formato: string;
  costo: number;
  tipoSala: string;
  premioARepartir: number;
  tipoPremio: string;
  mmrMinimo: number;
  mmrMaximo: number;
  nombreLobby: string;
  passwordLobby: string;
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-[#141526] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-white">
            {userRol === 'SUPERADMIN' || userRol === 'HOST'
              ? 'Configurar Nueva Sala'
              : 'Solicitar Sala'}
          </h3>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              JUEGO
            </label>
            <select
              value={formData.juego}
              onChange={(e) => {
                const nuevoJuego = e.target.value;
                const autoChessNoPermitido =
                  nuevoJuego !== 'DOTA2' &&
                  formData.formato === FORMATOS_VALIDOS.AUTO_CHESS;

                onFormChange({
                  ...formData,
                  juego: nuevoJuego,
                  formato: autoChessNoPermitido
                    ? FORMATOS_VALIDOS.ALL_PICK_5V5
                    : formData.formato,
                  tipoSala: autoChessNoPermitido ? 'BASICA' : formData.tipoSala,
                  costo: autoChessNoPermitido ? 6 : formData.costo,
                  premioARepartir: autoChessNoPermitido
                    ? 50
                    : formData.premioARepartir,
                });
              }}
              className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="DOTA2">Dota 2</option>
              {/* <option value="VALORANT">Valorant</option> */}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              FORMATO
            </label>
            <select
              value={formData.formato}
              onChange={(e) => {
                const nuevoFormato = e.target.value;
                if (nuevoFormato === FORMATOS_VALIDOS.AUTO_CHESS) {
                  onFormChange({
                    ...formData,
                    formato: nuevoFormato,
                    tipoSala: 'AUTOCHESS_3',
                    costo: 3,
                    premioARepartir: 20,
                  });
                } else {
                  onFormChange({
                    ...formData,
                    formato: nuevoFormato,
                    tipoSala: 'BASICA',
                    costo: 6,
                    premioARepartir: 50,
                  });
                }
              }}
              className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option value={FORMATOS_VALIDOS.ALL_PICK_5V5}>
                5 vs 5 (All Pick)
              </option>
              {formData.juego === 'DOTA2' && (
                <option value={FORMATOS_VALIDOS.AUTO_CHESS}>
                  Auto Chess (8 Jugadores)
                </option>
              )}
            </select>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="text-xs text-gray-400">MMR Mínimo</label>
              <input
                type="number"
                value={formData.mmrMinimo}
                onChange={(e) =>
                  onFormChange({
                    // 👈 Usamos onFormChange en vez de setFormData
                    ...formData,
                    mmrMinimo: Number(e.target.value),
                  })
                }
                className="w-full bg-[#1a1b2e] p-2 rounded text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">MMR Máximo</label>
              <input
                type="number"
                value={formData.mmrMaximo}
                onChange={(e) =>
                  onFormChange({
                    // 👈 Usamos onFormChange en vez de setFormData
                    ...formData,
                    mmrMaximo: Number(e.target.value),
                  })
                }
                className="w-full bg-[#1a1b2e] p-2 rounded text-white"
              />
            </div>
          </div>

          {userRol === 'SUPERADMIN' && (
            <div className="grid grid-cols-1 gap-3 p-3 bg-orange-950/20 rounded-xl border border-orange-500/20">
              <div>
                <label className="block text-xs font-bold text-orange-400 mb-1">
                  Nombre del Lobby en Dota
                </label>
                <input
                  type="text"
                  value={formData.nombreLobby}
                  onChange={(e) =>
                    onFormChange({
                      ...formData,
                      nombreLobby: e.target.value,
                    })
                  }
                  placeholder="Ej: ArenaGG 5v5 #12"
                  className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-orange-400 mb-1">
                  Contraseña del Lobby
                </label>
                <input
                  type="text"
                  value={formData.passwordLobby}
                  onChange={(e) =>
                    onFormChange({
                      ...formData,
                      passwordLobby: e.target.value,
                    })
                  }
                  placeholder="Ej: ARENA2026"
                  className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">
              TIPO DE SALA Y PREMIOS
            </label>
            {formData.formato === FORMATOS_VALIDOS.AUTO_CHESS ? (
              <div className="grid grid-cols-2 gap-3 mb-2">
                {[
                  { id: 'AUTOCHESS_3', costo: 3, p1: 12, p2: 5, p3: 3 },
                  { id: 'AUTOCHESS_5', costo: 5, p1: 20, p2: 10, p3: 6 },
                  { id: 'AUTOCHESS_10', costo: 10, p1: 40, p2: 18, p3: 14 },
                  { id: 'AUTOCHESS_15', costo: 15, p1: 60, p2: 24, p3: 20 },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() =>
                      onFormChange({
                        ...formData,
                        tipoSala: tier.id,
                        costo: tier.costo,
                      })
                    }
                    className={`p-3 text-left rounded-xl border transition-all ${formData.tipoSala === tier.id ? 'bg-blue-500/20 border-blue-500' : 'bg-[#1a1b2e] border-white/10'}`}
                  >
                    <div className="font-black text-white uppercase text-sm mb-1">
                      Entrada S/ {tier.costo}
                    </div>
                    <div className="text-[11px] text-yellow-400">
                      1ro: S/ {tier.p1}
                    </div>
                    <div className="text-[11px] text-gray-300">
                      2do: S/ {tier.p2}
                    </div>
                    <div className="text-[11px] text-orange-400">
                      3ro: S/ {tier.p3}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <button
                  type="button"
                  onClick={() =>
                    onFormChange({
                      ...formData,
                      tipoSala: 'BASICA',
                      costo: 6,
                      premioARepartir: 50,
                    })
                  }
                  className={`p-3 text-left rounded-xl border transition-all ${formData.tipoSala === 'BASICA' ? 'bg-orange-500/20 border-orange-500' : 'bg-[#1a1b2e] border-white/10'}`}
                >
                  <div className="font-black text-white uppercase text-sm">
                    Basica
                  </div>
                  <div className="text-xs text-gray-400">
                    Inscripcion: S/ 6.00
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onFormChange({
                      ...formData,
                      tipoSala: 'PREMIUM',
                      costo: 11,
                      premioARepartir: 100,
                    })
                  }
                  className={`p-3 text-left rounded-xl border transition-all ${formData.tipoSala === 'PREMIUM' ? 'bg-purple-500/20 border-purple-500' : 'bg-[#1a1b2e] border-white/10'}`}
                >
                  <div className="font-black text-white uppercase text-sm">
                    Premium
                  </div>
                  <div className="text-xs text-gray-400">
                    Inscripcion: S/ 11.00
                  </div>
                </button>
              </div>
            )}
            {userRol === 'SUPERADMIN' && (
              <button
                type="button"
                onClick={() =>
                  onFormChange({ ...formData, tipoSala: 'PERSONALIZADA' })
                }
                className={`mt-2 w-full p-3 text-left rounded-xl border transition-all ${formData.tipoSala === 'PERSONALIZADA' ? 'bg-red-500/20 border-red-500' : 'bg-[#1a1b2e] border-white/10'}`}
              >
                <div className="font-black text-red-400 uppercase text-sm flex items-center gap-2">
                  <Shield size={14} /> Personalizada (Admin)
                </div>
              </button>
            )}
            {formData.tipoSala === 'PERSONALIZADA' &&
              userRol === 'SUPERADMIN' && (
                <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-red-950/20 rounded-xl border border-red-500/20">
                  <div>
                    <label className="block text-[10px] font-bold text-red-400 mb-1">
                      Costo
                    </label>
                    <input
                      type="number"
                      value={formData.costo}
                      onChange={(e) =>
                        onFormChange({
                          ...formData,
                          costo: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#0b0c1b] border border-red-500/30 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-red-400 mb-1">
                      Pozo Total
                    </label>
                    <input
                      type="number"
                      value={formData.premioARepartir}
                      onChange={(e) =>
                        onFormChange({
                          ...formData,
                          premioARepartir: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#0b0c1b] border border-red-500/30 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              )}
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
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-orange-600/20 transition-all"
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
