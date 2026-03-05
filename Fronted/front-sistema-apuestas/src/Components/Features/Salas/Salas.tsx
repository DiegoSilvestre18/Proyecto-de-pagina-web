import React, { useState, useEffect } from 'react';
import {
  Crosshair,
  Plus,
  Filter,
  Coins,
  Users,
  X,
  Swords,
  UserPlus,
} from 'lucide-react';

import type { CuentaJuego, Sala } from './types/types';
import {
  getSalas,
  solicitarSala,
  unirseASala,
  getMisCuentasJuego,
} from './Services/ServiceSalas';
import { useAuth } from '../../../Context/AuthContext';

interface SalasProps {
  salas: Sala[]; // Estos son los mocks que vienen del MainPage
  filtrosModos: string[];
}

const Salas: React.FC<SalasProps> = ({ salas: salasMock, filtrosModos }) => {
  const [activeTab, setActiveTab] = useState('NAVEGAR');

  // 1. Nuevos estados para la data real y la carga
  const [salasReales, setSalasReales] = useState<Sala[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [salaSeleccionada, setSalaSeleccionada] = useState<Sala | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para capturar los datos del formulario
  const [formData, setFormData] = useState({
    juego: 'DOTA2',
    formato: '1v1',
    costo: 10,
  });

  const [isJoining, setIsJoining] = useState(false);

  const [cuentasJuego, setCuentasJuego] = useState<CuentaJuego[]>([]);

  const [selectedAccountId, setSelectedAccountId] = useState<number | ''>('');

  // Función que se ejecuta al darle a "Enviar"
  const handleSubmitSala = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    if (formData.costo < 5) {
      alert('La apuesta mínima es de S/ 5.00');
      return;
    }

    setIsSubmitting(true);
    try {
      // Llamamos al servicio que creamos en el Paso 1
      await solicitarSala({
        juego: formData.juego,
        formato: formData.formato,
        costoEntrada: formData.costo,
      });

      alert(
        user?.rol === 'USER'
          ? '¡Solicitud enviada! Un admin la revisará pronto.'
          : '¡Sala creada con éxito!',
      );

      setShowModal(false); // Cerramos el modal

      // Opcional: Aquí podrías volver a llamar a tu función fetchSalasBD()
      // para que la lista de salas se actualice automáticamente en pantalla.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert('Hubo un error al procesar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { user } = useAuth();

  // 2. Disparamos la petición al Backend apenas carga el componente
  useEffect(() => {
    const fetchSalasBD = async () => {
      try {
        const data = await getSalas();
        // Si el backend devuelve info, la guardamos
        if (data && data.length > 0) {
          setSalasReales(data);
        }
      } catch (error) {
        console.error('Error al traer salas del backend:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalasBD();
  }, []);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const cuentas = await getMisCuentasJuego();
        if (Array.isArray(cuentas)) {
          setCuentasJuego(cuentas);
          // Si tienes cuentas, seleccionamos la primera por defecto
          if (cuentas.length > 0) setSelectedAccountId(cuentas[0].id);
        }
      } catch (error) {
        console.error('Error al traer las cuentas de juego', error);
      }
    };
    fetchCuentas();
  }, []);

  // 3. Estrategia de respaldo: Si el backend está vacío o falla, mostramos los mocks
  // LÓGICA DE FILTRADO INTELIGENTE
  const salasFiltradas = salasReales.filter((sala) => {
    if (activeTab === 'NAVEGAR') {
      // En Navegar SOLO mostramos las salas públicas aprobadas ("ESPERANDO")
      return sala.estado === 'ESPERANDO';
    } else if (activeTab === 'MIS SALAS') {
      // Muéstrame las salas donde SOY CREADOR... ¡O donde SOY PARTICIPANTE!
      const soyCreador = sala.creador === user?.username;
      const soyParticipante = sala.participantes?.some(
        (p) => p.username === user?.username,
      );

      return soyCreador || soyParticipante;
    }
    return true;
  });

  // Si hay salas filtradas, mostramos esas. Si no hay nada de la BD aún, mostramos los mocks por defecto.
  const salasAMostrar =
    salasFiltradas.length > 0
      ? salasFiltradas
      : salasReales.length === 0 && activeTab === 'NAVEGAR'
        ? salasMock
        : [];

  const handleUnirseSala = async () => {
    if (!salaSeleccionada) return;

    setIsJoining(true);
    try {
      const response = await unirseASala({
        salaId: salaSeleccionada.id,
        gameAccountId: Number(selectedAccountId),
      });

      // Si C# devuelve un mensaje de éxito, lo mostramos (ej. "Inscripción exitosa. Se cobraron S/...")
      alert(response?.mensaje || '¡Te has unido a la sala con éxito!');

      setSalaSeleccionada(null); // Cerramos el modal
      // Opcional: podrías volver a llamar a la función que trae las salas para que se actualice la lista
    } catch (error: unknown) {
      // Le decimos a TypeScript que es 'unknown' (desconocido) y luego verificamos si tiene un mensaje
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Hubo un error al intentar unirte a la sala.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 pb-20 px-4 lg:px-12 pt-8 max-w-[1600px] mx-auto">
      {/* Cabecera de Salas */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-orange-600/20 rounded flex items-center justify-center">
              <Crosshair size={18} className="text-orange-500" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Salas de Apuestas
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-2xl">
            Descubre salas activas para apostar tus créditos. Únete a un duelo
            1v1 o arma tu equipo para partidas 5v5.
          </p>
        </div>

        {/* 👇 BOTÓN DINÁMICO SEGÚN EL ROL 👇 */}
        {user?.rol === 'SUPERADMIN' || user?.rol === 'HOST' ? (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#1a1b2e] border border-white/10 hover:border-orange-500 hover:bg-[#22233b] text-white px-6 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap"
          >
            <Plus size={16} className="text-orange-500" /> CREAR SALA
          </button>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#1a1b2e] border border-white/10 hover:border-orange-500 hover:bg-[#22233b] text-white px-6 py-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap"
          >
            <Plus size={16} className="text-orange-500" /> SOLICITAR SALA
          </button>
        )}
      </div>{' '}
      {/* <--- ¡ESTE ES EL DIV QUE FALTABA! */}
      {/* Pestañas (Navegar / Mis Salas) */}
      {/* Pestañas (Navegar / Mis Salas) */}
      <div className="flex gap-8 mb-6 border-b border-white/5">
        {['NAVEGAR', 'MIS SALAS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold tracking-widest transition-colors relative ${
              activeTab === tab
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full shadow-[0_-2px_8px_rgba(249,115,22,0.8)]"></div>
            )}
          </button>
        ))}
      </div>
      {/* Filtros en Píldoras */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {filtrosModos.map((modo, index) => (
          <button
            key={index}
            className="px-4 py-1.5 bg-[#141526] hover:bg-white/10 border border-white/5 rounded-full text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            {modo}
          </button>
        ))}
        <div className="w-px h-6 bg-white/10 mx-2"></div>
        <button className="flex items-center gap-2 px-4 py-1.5 bg-transparent hover:bg-white/5 border border-transparent rounded-full text-xs font-semibold text-gray-300 hover:text-white transition-colors">
          <Filter size={14} /> FILTROS
        </button>
      </div>
      {/* Lista de Salas */}
      <div className="space-y-2">
        {/* Cabecera de la tabla */}
        <div className="flex items-center px-4 pb-2 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
          <div className="flex-1">Detalles de la Sala</div>
          <div className="w-32 text-center hidden md:block">Formato</div>
          <div className="w-40 text-center">Cuota Inicial</div>
          <div className="w-24 text-right">Jugadores</div>
        </div>

        {/* Indicador de Carga */}
        {isLoading && (
          <div className="text-center py-8 text-gray-500 font-bold animate-pulse">
            Buscando salas en el servidor...
          </div>
        )}

        {/* Filas (AQUÍ CAMBIAMOS 'salas' por 'salasAMostrar') */}
        {!isLoading &&
          salasAMostrar.map((sala) => (
            <div
              key={sala.id}
              onClick={() => setSalaSeleccionada(sala)}
              className="group flex items-center justify-between p-4 bg-[#141526] border border-white/5 hover:border-orange-500/30 rounded-lg transition-all cursor-pointer hover:bg-[#1a1b30]"
            >
              {/* Info Izquierda */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full animate-pulse ${sala.estado === 'ESPERANDO' ? 'bg-green-500' : sala.estado === 'PENDIENTE_APROBACION' ? 'bg-orange-500' : 'bg-gray-500'}`}
                    ></span>
                    {sala.fecha}
                  </p>

                  {/* 👇 Etiqueta de Estado Dinámica 👇 */}
                  {activeTab === 'MIS SALAS' && (
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        sala.estado === 'ESPERANDO'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : sala.estado === 'PENDIENTE_APROBACION' ||
                              sala.estado === 'EN_REVISION'
                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {sala.estado === 'ESPERANDO'
                        ? 'Aprobada'
                        : sala.estado === 'RECHAZADA'
                          ? 'Rechazada'
                          : 'En Revisión'}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-white truncate">
                  {sala.nombre}
                </h4>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  Organizado por{' '}
                  <span className="text-gray-300">{sala.creador}</span>
                </p>
              </div>

              {/* Formato */}
              <div className="w-32 text-center hidden md:flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-300 bg-white/5 px-3 py-1 rounded">
                  {sala.formato}
                </span>
              </div>

              {/* Cuota */}
              <div className="w-40 flex items-center justify-center gap-2">
                <div className="bg-orange-600/10 p-1.5 rounded text-orange-500">
                  <Coins size={16} />
                </div>
                <span className="font-black text-white text-sm">
                  S/ {sala.costo?.toFixed(2) || '0.00'}
                </span>
              </div>

              {/* Jugadores */}
              <div className="w-24 flex items-center justify-end gap-2 text-gray-400 group-hover:text-white transition-colors">
                <Users size={16} />
                <span className="text-sm font-bold">
                  {sala.jugadores}{' '}
                  <span className="text-gray-600">/ {sala.maxJugadores}</span>
                </span>
              </div>
            </div>
          ))}
      </div>
      {/* ====== MODAL DE CREAR / SOLICITAR SALA ====== */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowModal(false)} // Si hace clic afuera, se cierra
        >
          <div
            className="bg-[#141526] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic adentro
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-white">
                {user?.rol === 'SUPERADMIN' || user?.rol === 'HOST'
                  ? 'Configurar Nueva Sala'
                  : 'Solicitar Sala'}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {user?.rol === 'SUPERADMIN' || user?.rol === 'HOST'
                  ? 'Crea una partida oficial que aparecerá al instante.'
                  : 'Arma tu partida. Un administrador la aprobará en breve.'}
              </p>
            </div>

            {/* Agregamos el onSubmit al form */}
            <form className="space-y-4" onSubmit={handleSubmitSala}>
              {/* Juego */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  JUEGO
                </label>
                <select
                  value={formData.juego}
                  onChange={(e) =>
                    setFormData({ ...formData, juego: e.target.value })
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
                    setFormData({ ...formData, formato: e.target.value })
                  }
                  className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="1v1">1 vs 1 (Duelo)</option>
                  <option value="5v5 All Pick">5 vs 5 (All Pick)</option>
                  <option value="5v5 Captains Mode">
                    5 vs 5 (Captains Mode)
                  </option>
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
                    setFormData({ ...formData, costo: Number(e.target.value) })
                  }
                  placeholder="Ej: 10.00"
                  className="w-full bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
      )}
      {/* ====== MODAL DEL LOBBY (SALA DE ESPERA 5v5) ====== */}
      {salaSeleccionada && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSalaSeleccionada(null)}
        >
          <div
            className="bg-[#0b0c1b] border border-white/10 rounded-2xl max-w-4xl w-full flex flex-col shadow-2xl relative overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar */}
            <button
              onClick={() => setSalaSeleccionada(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white z-10 transition-colors bg-black/50 rounded-full p-1"
            >
              <X size={24} />
            </button>

            {/* Cabecera Épica */}
            <div className="relative p-6 border-b border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20 opacity-50"></div>
              <div className="relative z-10 text-center">
                <span className="inline-block px-3 py-1 mb-2 text-xs font-black tracking-widest text-orange-400 bg-orange-500/10 rounded-full border border-orange-500/20 uppercase">
                  {salaSeleccionada.juego} • {salaSeleccionada.formato}
                </span>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                  Partida de{' '}
                  <span className="text-orange-500">
                    {salaSeleccionada.creador}
                  </span>
                </h2>
                <div className="flex items-center justify-center gap-6 mt-4 text-sm font-bold text-gray-400">
                  <div className="flex items-center gap-2">
                    <Coins size={16} className="text-yellow-500" />
                    Cuota:{' '}
                    <span className="text-white">
                      S/ {salaSeleccionada.costo?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-blue-500" />
                    Jugadores: <span className="text-white">1 / 10</span>{' '}
                    {/* Por ahora hardcodeado */}
                  </div>
                </div>
              </div>
            </div>

            {/* Zona de Equipos (5v5) */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#141526]">
              <div className="flex flex-col md:flex-row gap-8 relative">
                {/* Icono VS en el medio (Solo visible en Desktop) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#0b0c1b] border border-white/10 rounded-full items-center justify-center z-10 shadow-lg shadow-black">
                  <Swords size={20} className="text-orange-500" />
                </div>

                {/* EQUIPO 1 (Azul/Verde) */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-center font-black text-blue-400 tracking-widest uppercase mb-4 text-sm border-b border-blue-500/20 pb-2">
                    Radiant / Atacantes
                  </h3>
                  {/* Creamos un array de 5 espacios. Si hay un jugador en esa posición, lo mostramos, si no, mostramos "Esperando" */}
                  {[0, 1, 2, 3, 4].map((index) => {
                    const jugador = salaSeleccionada.participantes?.[index]; // Buscamos si existe un jugador en este índice

                    return (
                      <div
                        key={`eq1-${index}`}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${jugador ? 'bg-blue-900/20 border-blue-500/30' : 'bg-[#0b0c1b] border-white/5 border-dashed'}`}
                      >
                        <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                          {jugador ? (
                            <Users size={16} />
                          ) : (
                            <UserPlus size={16} className="opacity-30" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-bold ${jugador ? 'text-white' : 'text-gray-600'}`}
                          >
                            {jugador
                              ? jugador.steamName
                              : 'Esperando jugador...'}
                          </p>
                          {jugador && (
                            <p className="text-[10px] text-gray-400">
                              Usuario: {jugador.username}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* EQUIPO 2 (Rojo/Naranja) */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-center font-black text-red-400 tracking-widest uppercase mb-4 text-sm border-b border-red-500/20 pb-2">
                    Equipo 2
                  </h3>
                  {[0, 1, 2, 3, 4].map((slot) => (
                    <div
                      key={`eq2-${slot}`}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-[#0b0c1b] border-white/5 border-dashed"
                    >
                      <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                        <UserPlus size={16} className="opacity-30" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-600">
                          Esperando jugador...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer de Acción (Pagar y Unirse) */}
            <div className="p-6 border-t border-white/5 bg-[#0b0c1b] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
                {/* Botón Mágico */}
                <button
                  onClick={handleUnirseSala}
                  disabled={isJoining}
                  className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:scale-100 text-white font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-orange-600/20 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Coins size={18} />
                  {isJoining
                    ? 'Procesando Pago...'
                    : `Pagar S/ ${salaSeleccionada.costo?.toFixed(2)} y Unirse`}
                </button>
                {/* Menú Desplegable de Cuentas */}
                <div className="w-full sm:w-auto">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                    Selecciona tu cuenta
                  </label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) =>
                      setSelectedAccountId(Number(e.target.value))
                    }
                    className="w-full sm:w-64 bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none cursor-pointer"
                  >
                    {cuentasJuego.length === 0 && (
                      <option value="">No tienes cuentas vinculadas</option>
                    )}
                    {cuentasJuego.map((cuenta) => (
                      <option key={cuenta.id} value={cuenta.id}>
                        🎮 {cuenta.idVisible} ({cuenta.juego})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 text-center sm:text-left">
                * El sistema descontará S/ {salaSeleccionada.costo?.toFixed(2)}{' '}
                usando tu Saldo Bono primero. Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salas;
