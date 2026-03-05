import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const AccountSettings: React.FC = () => {
  const [sections, setSections] = useState({
    info: true,
    saldos: true,
    seguridad: true,
    personal: false,
  });
  const toggleSection = (section: string) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };
  return (
    <>
      <h2 className="text-2xl font-black text-white mb-8 tracking-wide">
        Cuenta
      </h2>
      <div className="space-y-6">
        {/* SECCIÓN 1: Información de la cuenta */}
        <div className="border-b border-white/5 pb-2">
          <button
            onClick={() => toggleSection('info')}
            className="w-full flex justify-between items-center py-4 text-left group"
          >
            <h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">
              Información de la cuenta
            </h3>
            {sections.info ? (
              <ChevronUp size={20} className="text-gray-400" />
            ) : (
              <ChevronDown size={20} className="text-gray-400" />
            )}
          </button>

          {sections.info && (
            <div className="space-y-6 pb-6 animate-in slide-in-from-top-2">
              {/* Apodo */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-white mb-1">Apodo</p>
                  <p className="text-sm text-gray-400 max-w-md">gaaaa</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="bg-green-500 hover:bg-green-600 text-black text-xs font-black px-4 py-2 rounded uppercase tracking-wider transition-colors">
                    hola
                  </button>
                  <button className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
                    Comprar cambio
                  </button>
                </div>
              </div>

              <div className="h-px w-full bg-white/5"></div>

              {/* Correo */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white mb-1">
                    Correo electrónico
                  </p>
                  <p className="text-sm text-gray-400">email@example.com</p>
                </div>
                <button className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors">
                  Editar
                </button>
              </div>

              <div className="h-px w-full bg-white/5"></div>

              {/* Idioma */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white mb-1">Idioma</p>
                  <p className="text-sm text-gray-400">Español</p>
                </div>
                <button className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors">
                  Editar
                </button>
              </div>

              <div className="h-px w-full bg-white/5"></div>

              {/* Zona horaria */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white mb-1">Zona horaria</p>
                  <p className="text-sm text-gray-400">No definido</p>
                </div>
                <button className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors">
                  Editar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountSettings;
