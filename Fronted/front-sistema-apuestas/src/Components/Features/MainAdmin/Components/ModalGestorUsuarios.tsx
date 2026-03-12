import { buscarUsuariosAdmin } from '../Services/MainServices';
import React, { useState, useEffect } from 'react';
import {
  forzarMmrAdmin,
  banearUsuarioAdmin,
  otorgarBono,
} from '../Services/MainServices';
import {
  X,
  Search,
  ShieldAlert,
  DollarSign,
  Crosshair,
  UserX,
} from 'lucide-react';
// Importa tus servicios (tendrás que crearlos en MainServices o AdminServices)
// import { buscarUsuariosAdmin, cambiarMmrManual, banearUsuario, darBono } from '../Services/AdminServices';

interface ModalGestorUsuariosProps {
  onClose: () => void;
}

// Interfaz temporal (Ajustala a lo que devuelva tu C#)
interface UserAdminView {
  id: number;
  username: string;
  email: string;
  estado: string;
  rangoDota: string;
  rangoValorant: string;
}

const ModalGestorUsuarios: React.FC<ModalGestorUsuariosProps> = ({
  onClose,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState<UserAdminView[]>([]);
  const [loading, setLoading] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<UserAdminView | null>(null);

  // Estados para las acciones
  const [accionActiva, setAccionActiva] = useState<
    'NONE' | 'MMR' | 'BONO' | 'BAN'
  >('NONE');
  const [nuevoMmr, setNuevoMmr] = useState('');
  const [montoBono, setMontoBono] = useState('');
  const [juegoSeleccionado, setJuegoSeleccionado] = useState('DOTA2');

  // Ya no necesitamos sacar el { token } aquí, porque apiFetch lo hace solo

  useEffect(() => {
    // Si la búsqueda tiene menos de 3 letras y NO está vacía, no hacemos nada
    if (busqueda.length > 0 && busqueda.length < 3) {
      return;
    }

    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        // 👇 Magia pura: Llamamos a tu servicio global
        const data = await buscarUsuariosAdmin(busqueda);
        setUsuarios(data); // Llenamos la tabla
      } catch (error) {
        console.error('Error buscando usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    // Aplicamos el Debounce
    const timeoutId = setTimeout(() => fetchUsuarios(), 500);

    return () => clearTimeout(timeoutId);
  }, [busqueda]);
  const handleEjecutarAccion = async () => {
    if (!usuarioSeleccionado) return;

    try {
      if (accionActiva === 'MMR') {
        if (!nuevoMmr) return alert('Escribe un rango válido');
        const res = await forzarMmrAdmin(
          usuarioSeleccionado.id,
          juegoSeleccionado,
          nuevoMmr,
        );
        alert(`✅ ${res.mensaje}`);
        setNuevoMmr('');
      } else if (accionActiva === 'BONO') {
        if (!montoBono || Number(montoBono) <= 0)
          return alert('Monto inválido');
        // Usa username o ID, dependiendo de lo que pida la API de tu amigo
        await otorgarBono({
          username: usuarioSeleccionado.username,
          montoBono: Number(montoBono),
          motivo: 'Bono otorgado desde el Gestor de Usuarios', // O el motivo que quieras
        });
        alert(
          `✅ Bono de S/ ${montoBono} entregado a ${usuarioSeleccionado.username}`,
        );
        setMontoBono('');
      } else if (accionActiva === 'BAN') {
        const res = await banearUsuarioAdmin(usuarioSeleccionado.id);
        alert(`🔨 ${res.mensaje}`);
      }
      setAccionActiva('NONE');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`❌ Error al ejecutar acción: ${error.message}`);
      } else {
        alert('❌ Ocurrió un error desconocido.');
      }
    }
  };

  return (
    <div
      className="bg-[#141526] border border-white/10 rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col h-[80vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header del Buscador */}
      <div className="p-6 border-b border-white/5 bg-[#0b0c1b] shrink-0">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-4">
          <ShieldAlert className="text-red-500" /> BÚSQUEDA GLOBAL
        </h2>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Escribe el nombre de usuario o correo (Mín. 3 letras)..."
            value={busqueda}
            onChange={(e) => {
              const valorNuevo = e.target.value;
              setBusqueda(valorNuevo); // Actualizamos lo que escribió

              setUsuarioSeleccionado(null);
              setAccionActiva('NONE');
            }}
            className="w-full bg-[#1a1b2e] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-bold focus:border-red-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Lista de Resultados */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {loading && (
          <div className="text-center text-gray-500 py-8 animate-pulse font-bold tracking-widest">
            Buscando en los registros...
          </div>
        )}

        {!loading && busqueda.length >= 3 && usuarios.length === 0 && (
          <div className="text-center text-gray-600 py-8">
            No se encontró a ningún jugador.
          </div>
        )}

        {!loading &&
          usuarios.map((u) => (
            <div
              key={u.id}
              onClick={() => {
                setUsuarioSeleccionado(u);
                setAccionActiva('NONE');
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${usuarioSeleccionado?.id === u.id ? 'bg-red-500/10 border-red-500/50' : 'bg-[#0b0c1b] border-white/5 hover:border-white/20'}`}
            >
              <div>
                <h4 className="font-bold text-white text-lg leading-none mb-1">
                  {u.username}
                </h4>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <div className="text-right">
                <span
                  className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${u.estado === 'ACTIVO' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}
                >
                  {u.estado}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Panel de Acciones (Aparece al seleccionar usuario) */}
      {usuarioSeleccionado && (
        <div className="bg-[#0b0c1b] border-t border-white/10 p-6 shrink-0 animate-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            Acciones para{' '}
            <span className="text-white">{usuarioSeleccionado.username}</span>
          </h3>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setAccionActiva('MMR')}
              className={`p-3 rounded-lg border font-bold text-xs uppercase flex flex-col items-center gap-2 transition-all ${accionActiva === 'MMR' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#1a1b2e] border-white/10 text-gray-400 hover:text-white'}`}
            >
              <Crosshair size={18} /> Forzar MMR
            </button>
            <button
              onClick={() => setAccionActiva('BONO')}
              className={`p-3 rounded-lg border font-bold text-xs uppercase flex flex-col items-center gap-2 transition-all ${accionActiva === 'BONO' ? 'bg-green-600 border-green-500 text-white' : 'bg-[#1a1b2e] border-white/10 text-gray-400 hover:text-white'}`}
            >
              <DollarSign size={18} /> Dar Bono
            </button>
            <button
              onClick={() => setAccionActiva('BAN')}
              className={`p-3 rounded-lg border font-bold text-xs uppercase flex flex-col items-center gap-2 transition-all ${accionActiva === 'BAN' ? 'bg-red-600 border-red-500 text-white' : 'bg-[#1a1b2e] border-white/10 text-gray-400 hover:text-white'}`}
            >
              <UserX size={18} /> Banear
            </button>
          </div>

          {/* Formularios Dinámicos según la acción */}
          {accionActiva !== 'NONE' && (
            <div className="bg-[#1a1b2e] p-4 rounded-xl border border-white/5 flex gap-4 items-end animate-in fade-in duration-200">
              {accionActiva === 'MMR' && (
                <>
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-400 font-bold mb-1 block uppercase">
                      Juego
                    </label>
                    <select
                      value={juegoSeleccionado}
                      onChange={(e) => setJuegoSeleccionado(e.target.value)}
                      className="w-full bg-[#0b0c1b] text-white p-2.5 rounded border border-white/10 outline-none text-sm"
                    >
                      <option value="DOTA2">
                        Dota 2 (Actual: {usuarioSeleccionado.rangoDota})
                      </option>
                      <option value="VALORANT">
                        Valorant (Actual: {usuarioSeleccionado.rangoValorant})
                      </option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-400 font-bold mb-1 block uppercase">
                      Nuevo Rango / MMR
                    </label>
                    <input
                      type="text"
                      value={nuevoMmr}
                      onChange={(e) => setNuevoMmr(e.target.value)}
                      placeholder="Ej: 5000 o Immortal"
                      className="w-full bg-[#0b0c1b] text-white p-2.5 rounded border border-white/10 outline-none text-sm"
                    />
                  </div>
                  <button
                    onClick={handleEjecutarAccion}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded text-sm transition-colors"
                  >
                    Guardar
                  </button>
                </>
              )}

              {accionActiva === 'BONO' && (
                <>
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-400 font-bold mb-1 block uppercase">
                      Monto a regalar (S/)
                    </label>
                    <input
                      type="number"
                      value={montoBono}
                      onChange={(e) => setMontoBono(e.target.value)}
                      placeholder="Ej: 20.00"
                      className="w-full bg-[#0b0c1b] text-white p-2.5 rounded border border-white/10 outline-none text-sm"
                    />
                  </div>
                  <button
                    onClick={handleEjecutarAccion}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-2.5 rounded text-sm transition-colors"
                  >
                    Abonar
                  </button>
                </>
              )}

              {accionActiva === 'BAN' && (
                <div className="flex-1 flex items-center justify-between">
                  <p className="text-red-400 text-xs font-bold w-2/3">
                    ⚠️ El usuario no podrá loguearse ni unirse a salas. ¿Estás
                    seguro?
                  </p>
                  <button
                    onClick={handleEjecutarAccion}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded text-sm transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  >
                    Sí, Banear
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModalGestorUsuarios;
