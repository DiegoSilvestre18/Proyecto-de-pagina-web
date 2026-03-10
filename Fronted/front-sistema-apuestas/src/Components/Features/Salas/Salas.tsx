import React, { useState, useEffect } from 'react';
import {
  Crosshair,
  Crown,
  Shield,
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
  cambiarEquipoSala,
} from './Services/ServiceSalas';
import { useAuth } from '../../../Context/AuthContext';

interface SalasProps {
  salas: Sala[]; // Estos son los mocks que vienen del MainPage
  filtrosModos: string[];
}

const Salas: React.FC<SalasProps> = ({ salas: salasMock, filtrosModos }) => {
  const { actualizarSaldo } = useAuth();
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

  const [equipoSeleccionado, setEquipoSeleccionado] =
    useState<string>('EQUIPO1');

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
        equipo: equipoSeleccionado,
      });

      // Si C# devuelve un mensaje de éxito, lo mostramos (ej. "Inscripción exitosa. Se cobraron S/...")
      alert(response?.mensaje || '¡Te has unido a la sala con éxito!');

      if (response.saldoRealRestante !== undefined) {
        actualizarSaldo(response.saldoRealRestante, response.saldoBonoRestante);
      }

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

  const miParticipacion = salaSeleccionada?.participantes?.find(
    (p: { username: string; equipo: string }) => p.username === user?.username,
  );

  // Función REAL para cambiar de equipo
  const handleCambiarEquipo = async (salaId: number, nuevoEquipo: string) => {
    try {
      // 1. Mandamos la orden al backend
      await cambiarEquipoSala(salaId, nuevoEquipo);

      // 2. Avisamos que fue un éxito
      alert(
        `¡Te has cambiado al ${nuevoEquipo === 'EQUIPO1' ? 'Radiant 🔵' : 'Dire 🔴'} exitosamente!`,
      );

      // 3. ¡MUY IMPORTANTE!
      // Aquí debes llamar a la función que recarga las salas para que el diseño se actualice.
      // Si tu función principal para traer las salas de C# se llama fetchSalas, llámala así:
      // fetchSalas();
      window.location.reload();

      // Opcional: También podrías cerrar el modal temporalmente para forzar al usuario a refrescar
      // setShowModal(false);
    } catch (error: unknown) {
      console.error('Error al cambiar de equipo:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Hubo un error al intentar cambiar de equipo.');
      }
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
                    Jugadores:
                    {/* Busca algo así y reemplázalo: */}
                    <span className="text-gray-400 text-sm">
                      {salaSeleccionada.participantes?.length || 0} / 10
                    </span>{' '}
                    {/* Por ahora hardcodeado */}
                  </div>
                </div>
              </div>
            </div>

            {/* Zona de Equipos (5v5) */}
            {/* Zona Principal (Condicional: Espera vs Partida) */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#141526]">
              {['ESPERANDO', 'SORTEO', 'DRAFTING'].includes(
                salaSeleccionada.estado || '',
              ) ? (
                /* ========================================================
                   NUEVA VISTA: PISCINA DE JUGADORES (CAPTAINS DRAFT) 
                   ======================================================== */
                <div className="flex flex-col gap-6 relative animate-in fade-in duration-300">
                  {/* PANEL VIP DEL ADMIN (EL OJO SUPREMO) */}
                  {user?.rol === 'SUPERADMIN' && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <Shield className="text-orange-500" size={24} />
                        </div>
                        <div>
                          <h4 className="text-orange-500 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            Ojo Supremo{' '}
                            <span className="text-[10px] bg-orange-500 text-black px-2 py-0.5 rounded-sm">
                              ADMIN
                            </span>
                          </h4>
                          <p className="text-xs text-orange-400/80 mt-0.5">
                            Modo Espectador. Esperando a que se llene la sala.
                            Puedes forzar líderes manualmente.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <h3 className="text-center font-black text-white tracking-widest uppercase text-sm border-b border-white/10 pb-3 mt-2">
                    Piscina de Jugadores
                  </h3>

                  {/* GRID ÚNICA DE 10 ESPACIOS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
                      const jugador = salaSeleccionada.participantes?.[index];

                      // 👇 NUEVO: Lógica de Capitanes Corregida 👇
                      // Asegúrate de que las propiedades coincidan con lo que manda C#
                      // Usualmente es jugador.usuarioId (o jugador.id si lo mapeaste así en tu DTO)
                      const idDelJugador = jugador?.id || jugador?.id;

                      // Solo evaluamos si la sala tiene capitanes y si el id del jugador existe
                      const isCapitan1 =
                        salaSeleccionada.capitan1Id != null &&
                        idDelJugador != null &&
                        salaSeleccionada.capitan1Id === idDelJugador;
                      const isCapitan2 =
                        salaSeleccionada.capitan2Id != null &&
                        idDelJugador != null &&
                        salaSeleccionada.capitan2Id === idDelJugador;
                      const isCapitan = isCapitan1 || isCapitan2;

                      // 2. ¿El usuario que está viendo el modal es un capitán?
                      const soyCapitan =
                        user?.id != null &&
                        (user.id === salaSeleccionada.capitan1Id ||
                          user.id === salaSeleccionada.capitan2Id);

                      // 3. ¿Le toca elegir a este capitán? (Por ahora lo dejamos en true para probar)
                      // const esMiTurno = salaSeleccionada.turnoId === user?.id;
                      const esMiTurno = true;

                      return (
                        <div
                          key={`pool-${index}`}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                            jugador
                              ? isCapitan
                                ? 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                                : jugador.equipo &&
                                    jugador.equipo !== 'ESPERANDO_DRAFT' // Si ya tiene equipo, lo marcamos
                                  ? jugador.equipo === 'EQUIPO1'
                                    ? 'bg-blue-500/5 border-blue-500/20 opacity-60'
                                    : 'bg-red-500/5 border-red-500/20 opacity-60'
                                  : 'bg-[#1a1b2e] border-white/10'
                              : 'bg-[#0b0c1b] border-white/5 border-dashed'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar / Ícono */}
                            <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-gray-400 relative">
                              {jugador ? (
                                <Users
                                  size={18}
                                  className={
                                    isCapitan
                                      ? 'text-yellow-500'
                                      : jugador.equipo === 'EQUIPO1'
                                        ? 'text-blue-500'
                                        : jugador.equipo === 'EQUIPO2'
                                          ? 'text-red-500'
                                          : ''
                                  }
                                />
                              ) : (
                                <UserPlus size={18} className="opacity-30" />
                              )}

                              {/* 👑 Corona de Líder */}
                              {jugador && isCapitan && (
                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full p-1 shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-bounce">
                                  <Crown size={12} fill="currentColor" />
                                </div>
                              )}
                            </div>

                            {/* Datos del Jugador */}
                            <div className="flex-1 overflow-hidden">
                              <p
                                className={`text-sm font-bold truncate ${
                                  jugador
                                    ? isCapitan
                                      ? 'text-yellow-400'
                                      : 'text-white'
                                    : 'text-gray-600'
                                }`}
                              >
                                {jugador
                                  ? jugador.username // Muestra el username real
                                  : 'Esperando jugador...'}
                              </p>
                              {jugador && (
                                <p className="text-[10px] text-gray-400 truncate mt-0.5 uppercase tracking-tighter">
                                  {isCapitan
                                    ? 'Capitán de Equipo'
                                    : jugador.equipo &&
                                        jugador.equipo !== 'ESPERANDO_DRAFT'
                                      ? `Elegido por ${jugador.equipo}`
                                      : 'Disponible para Draft'}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* ACCIONES DE DRAFT */}
                          <div className="flex gap-2">
                            {/* 1. Botón para el CAPITÁN: Reclutar jugador */}
                            {soyCapitan &&
                              esMiTurno &&
                              jugador &&
                              jugador.equipo === 'ESPERANDO_DRAFT' && // Solo si está libre
                              !isCapitan && (
                                <button
                                  onClick={() =>
                                    alert(`Reclutando a ${jugador.username}...`)
                                  } // handlePickPlayer(idDelJugador)
                                  className="text-[10px] bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded transition-all font-black uppercase shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                                >
                                  Reclutar
                                </button>
                              )}

                            {/* 2. Botón para el ADMIN: Forzar Líder */}
                            {user?.rol === 'SUPERADMIN' &&
                              jugador &&
                              !isCapitan && (
                                <button className="text-[10px] bg-[#0b0c1b] hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-500 border border-white/10 hover:border-yellow-500/30 px-3 py-1.5 rounded transition-colors font-bold uppercase tracking-wider">
                                  Forzar Líder
                                </button>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ========================================================
                   VISTA CLÁSICA: RADIANT VS DIRE (CUANDO LA SALA AVANZA) 
                   ======================================================== */
                <div className="flex flex-col md:flex-row gap-8 relative animate-in fade-in duration-300">
                  {/* Icono VS en el medio (Solo visible en Desktop) */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#0b0c1b] border border-white/10 rounded-full items-center justify-center z-10 shadow-lg shadow-black">
                    <Swords size={20} className="text-orange-500" />
                  </div>

                  {(() => {
                    const jugadoresEquipo1 =
                      salaSeleccionada.participantes?.filter(
                        (p) => p.equipo === 'EQUIPO1',
                      ) || [];
                    const jugadoresEquipo2 =
                      salaSeleccionada.participantes?.filter(
                        (p) => p.equipo === 'EQUIPO2',
                      ) || [];

                    return (
                      <>
                        {/* EQUIPO 1 (Radiant / Azul) */}
                        <div className="flex-1 space-y-2">
                          <h3 className="text-center font-black text-blue-400 tracking-widest uppercase mb-4 text-sm border-b border-blue-500/20 pb-2">
                            Radiant / Atacantes
                          </h3>
                          {[0, 1, 2, 3, 4].map((index) => {
                            const jugador = jugadoresEquipo1[index];
                            return (
                              <div
                                key={`eq1-${index}`}
                                className={`flex items-center gap-3 p-3 rounded-lg border ${jugador ? 'bg-blue-900/20 border-blue-500/30' : 'bg-[#0b0c1b] border-white/5 border-dashed'}`}
                              >
                                <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                                  {jugador ? (
                                    <Users size={16} />
                                  ) : (
                                    <UserPlus
                                      size={16}
                                      className="opacity-30"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <p
                                    className={`text-sm font-bold truncate ${jugador ? 'text-white' : 'text-gray-600'}`}
                                  >
                                    {jugador
                                      ? jugador.steamName
                                      : 'Esperando jugador...'}
                                  </p>
                                  {jugador && (
                                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                      Usuario: {jugador.username}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* ICONO DE ESPADAS (Móvil) */}
                        <div className="flex items-center justify-center px-2 md:hidden">
                          <div className="w-10 h-10 rounded-full bg-[#1a1b2e] border border-white/5 flex items-center justify-center shadow-lg z-10">
                            <Swords size={20} className="text-orange-500" />
                          </div>
                        </div>

                        {/* EQUIPO 2 (Dire / Rojo) */}
                        <div className="flex-1 space-y-2">
                          <h3 className="text-center font-black text-red-400 tracking-widest uppercase mb-4 text-sm border-b border-red-500/20 pb-2">
                            Dire / Defensores
                          </h3>
                          {[0, 1, 2, 3, 4].map((index) => {
                            const jugador = jugadoresEquipo2[index];
                            return (
                              <div
                                key={`eq2-${index}`}
                                className={`flex items-center gap-3 p-3 rounded-lg border ${jugador ? 'bg-red-900/20 border-red-500/30' : 'bg-[#0b0c1b] border-white/5 border-dashed'}`}
                              >
                                <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                                  {jugador ? (
                                    <Users size={16} />
                                  ) : (
                                    <UserPlus
                                      size={16}
                                      className="opacity-30"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <p
                                    className={`text-sm font-bold truncate ${jugador ? 'text-white' : 'text-gray-600'}`}
                                  >
                                    {jugador
                                      ? jugador.steamName
                                      : 'Esperando jugador...'}
                                  </p>
                                  {jugador && (
                                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                      Usuario: {jugador.username}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* FOOTER INTELIGENTE DEL MODAL */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0b0c1b]/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
              {!miParticipacion ? (
                /* --- ESTADO 1: NO ESTÁ EN LA SALA (Muestra pago y selectores) --- */
                <>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {/* Menú Desplegable de Cuentas */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Selecciona tu cuenta
                      </label>
                      <select
                        value={selectedAccountId}
                        onChange={(e) =>
                          setSelectedAccountId(Number(e.target.value))
                        }
                        className="w-full sm:w-48 bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none"
                      >
                        {cuentasJuego.map((cuenta) => (
                          <option key={cuenta.id} value={cuenta.id}>
                            🎮 {cuenta.idVisible}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Menú Desplegable de Bando */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Elige tu Bando
                      </label>
                      <select
                        value={equipoSeleccionado}
                        onChange={(e) => setEquipoSeleccionado(e.target.value)}
                        className="w-full sm:w-48 bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none"
                      >
                        <option value="EQUIPO1">🔵 Radiant / Atacantes</option>
                        <option value="EQUIPO2">🔴 Dire / Defensores</option>
                      </select>
                    </div>
                  </div>

                  {/* Botón Pagar */}
                  <button
                    onClick={handleUnirseSala}
                    disabled={isJoining}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isJoining
                      ? 'Procesando...'
                      : `PAGAR S/ ${salaSeleccionada.costo.toFixed(2)} Y UNIRSE`}
                  </button>
                </>
              ) : (
                /* --- ESTADO 2: YA ESTÁ EN LA SALA (Muestra Credenciales y Opciones) --- */
                <div className="flex flex-col w-full gap-4">
                  {/* 👇 CUADRO DE CREDENCIALES (COMPACTO Y ELEGANTE) 👇 */}
                  {miParticipacion.nombreLobby && (
                    <div className="mx-auto w-fit px-6 py-2.5 bg-[#141526] border border-purple-500/40 rounded-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-[0_0_15px_rgba(168,85,247,0.1)] relative overflow-hidden">
                      {/* Barrita de luz superior */}
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-600 to-blue-500"></div>

                      {/* Nombre Lobby */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                          LOBBY:
                        </span>
                        <span className="text-purple-300 font-mono font-bold text-sm bg-black/50 px-3 py-1 rounded border border-purple-500/20 select-all">
                          {miParticipacion.nombreLobby}
                        </span>
                      </div>

                      {/* Divisor vertical (se oculta en celulares) */}
                      <div className="hidden sm:block w-px h-5 bg-white/10"></div>

                      {/* Contraseña */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                          PASS:
                        </span>
                        <span className="text-purple-300 font-mono font-bold text-sm bg-black/50 px-3 py-1 rounded border border-purple-500/20 select-all">
                          {miParticipacion.passwordLobby}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* 👆 FIN DEL CUADRO DE CREDENCIALES 👆 */}

                  {/* Alerta de Inscrito y Botón de Cambiar Bando */}
                  <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3">
                    <div className="text-green-400 font-bold flex items-center gap-2 bg-green-500/10 px-4 py-2.5 rounded-lg border border-green-500/20 w-full sm:w-auto justify-center text-sm">
                      <span>✅</span> Inscrito en el{' '}
                      {miParticipacion.equipo === 'EQUIPO1'
                        ? 'Radiant'
                        : 'Dire'}
                    </div>

                    <button
                      onClick={() =>
                        handleCambiarEquipo(
                          salaSeleccionada.id,
                          miParticipacion.equipo === 'EQUIPO1'
                            ? 'EQUIPO2'
                            : 'EQUIPO1',
                        )
                      }
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#1a1b2e] hover:bg-[#2a2b46] border border-white/10 hover:border-white/30 rounded-lg text-white font-bold transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      🔄 Cambiar a{' '}
                      {miParticipacion.equipo === 'EQUIPO1'
                        ? 'Dire 🔴'
                        : 'Radiant 🔵'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salas;
