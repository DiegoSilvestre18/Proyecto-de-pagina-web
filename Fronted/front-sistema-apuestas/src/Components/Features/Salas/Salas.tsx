import React, { useState, useEffect } from 'react';

import type { CuentaJuego, Sala } from './types/types';
import {
  getSalas,
  solicitarSala,
  unirseASala,
  getMisCuentasJuego,
  cambiarEquipoSala,
} from './Services/ServiceSalas';
import { useAuth } from '../../../Context/AuthContext';
import SalasHeader from './Components/SalasHeader';
import SalasTabs from './Components/SalasTabs';
import SalasFilters from './Components/SalasFilters';
import SalasList from './Components/SalasList';
import ModalCrearSala from './Components/ModalCrearSala';
import ModalLobby from './Components/ModalLobby';

interface SalasProps {
  filtrosModos: string[];
}

const Salas: React.FC<SalasProps> = ({ salas: salasMock }) => {
  const { user, gameAccounts, hasGameAccount, updateBalance, actualizarSaldo } =
    useAuth();
  const [activeTab, setActiveTab] = useState('NAVEGAR');

  // Nuevos estados para la data real y la carga
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
    e.preventDefault();

    if (formData.costo < 5) {
      alert('La apuesta mínima es de S/ 5.00');
      return;
    }

    setIsSubmitting(true);
    try {
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

      setShowModal(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert('Hubo un error al procesar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const salasAMostrar = salasFiltradas;

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

  // Función REAL para cambiar de equipo
  const handleCambiarEquipo = async (salaId: number, nuevoEquipo: string) => {
    try {
      await cambiarEquipoSala(salaId, nuevoEquipo);

      alert(
        `¡Te has cambiado al ${nuevoEquipo === 'EQUIPO1' ? 'Radiant 🔵' : 'Dire 🔴'} exitosamente!`,
      );

      window.location.reload();
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
      <SalasHeader userRol={user?.rol} onOpenModal={() => setShowModal(true)} />

      <SalasTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <SalasFilters filtrosModos={filtrosModos} />

      {/* Filtros */}
      <div className="flex gap-2 bg-[#0b0c1b] p-1 rounded-full border border-white/5 overflow-x-auto">
        <button
          onClick={() => setFiltroEstado('TODAS')}
          className={`px-4 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filtroEstado === 'TODAS' ? 'bg-white/20 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltroEstado('ESPERANDO')}
          className={`px-4 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filtroEstado === 'ESPERANDO' ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
        >
          🟢 En Espera
        </button>

        {/* Estos ya no tienen el if de SUPERADMIN, todos pueden verlos */}
        <button
          onClick={() => setFiltroEstado('EN_CURSO')}
          className={`px-4 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filtroEstado === 'EN_CURSO' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
        >
          ⚔️ En Curso
        </button>
        <button
          onClick={() => setFiltroEstado('FINALIZADA')}
          className={`px-4 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filtroEstado === 'FINALIZADA' ? 'bg-red-500/20 text-red-500 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
        >
          🏁 Finalizadas
        </button>
      </div>

      {/* Lista de Salas */}
      <div className="space-y-2">
        <div className="flex items-center px-4 pb-2 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
          <div className="flex-1">Detalles de la Sala</div>
          <div className="w-32 text-center hidden md:block">Formato</div>
          <div className="w-40 text-center">Cuota Inicial</div>
          <div className="w-24 text-right">Jugadores</div>
        </div>

        {isLoading && (
          <div className="text-center py-8 text-gray-500 font-bold animate-pulse">
            Buscando salas en el servidor...
          </div>
        )}

        {!isLoading &&
          salasAMostrar.map((sala) => (
            <div
              key={sala.id}
              onClick={() => setSalaSeleccionada(sala)}
              className="group flex items-center justify-between p-4 bg-[#141526] border border-white/5 hover:border-orange-500/30 rounded-lg transition-all cursor-pointer hover:bg-[#1a1b30]"
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        sala.estado === 'ESPERANDO'
                          ? 'bg-green-500 animate-pulse'
                          : sala.estado === 'EN_CURSO'
                            ? 'bg-blue-500 animate-pulse'
                            : sala.estado === 'FINALIZADA'
                              ? 'bg-red-500'
                              : 'bg-gray-500'
                      }`}
                    ></span>
                    {sala.fecha}
                  </p>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider transition-all ${
                      sala.estado === 'ESPERANDO'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                        : sala.estado === 'EN_CURSO'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                          : sala.estado === 'FINALIZADA'
                            ? 'bg-red-500/10 text-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                            : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}
                  >
                    {sala.estado === 'ESPERANDO'
                      ? 'Esperando'
                      : sala.estado === 'EN_CURSO'
                        ? 'En Curso'
                        : sala.estado === 'FINALIZADA'
                          ? 'Finalizada'
                          : 'En Revisión'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white truncate">
                  {sala.nombre}
                </h4>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  Organizado por{' '}
                  <span className="text-gray-300">{sala.creador}</span>
                </p>
              </div>
              <div className="w-32 text-center hidden md:flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-300 bg-white/5 px-3 py-1 rounded">
                  {sala.formato}
                </span>
              </div>
              <div className="w-40 flex items-center justify-center gap-2">
                <div className="bg-orange-600/10 p-1.5 rounded text-orange-500">
                  <Coins size={16} />
                </div>
                <span className="font-black text-white text-sm">
                  S/ {sala.costo?.toFixed(2) || '0.00'}
                </span>
              </div>
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
      {showModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-[#141526] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-white">
                  {user?.rol === 'SUPERADMIN' || user?.rol === 'HOST'
                    ? 'Configurar Nueva Sala'
                    : 'Solicitar Sala'}
                </h3>
              </div>
              <form className="space-y-4" onSubmit={handleSubmitSala}>
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
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    FORMATO
                  </label>
                  <select
                    value={formData.formato}
                    onChange={(e) => {
                      const nuevoFormato = e.target.value;
                      if (nuevoFormato === 'Auto Chess') {
                        setFormData({
                          ...formData,
                          formato: nuevoFormato,
                          tipoSala: 'AUTOCHESS_3',
                          costo: 3,
                          premioARepartir: 20,
                        });
                      } else {
                        setFormData({
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
                    <option value="1v1">1 vs 1 (Duelo)</option>
                    <option value="5v5 All Pick">5 vs 5 (All Pick)</option>
                    <option value="5v5 Captains Mode">
                      5 vs 5 (Captains Mode)
                    </option>
                    {formData.juego === 'DOTA2' && (
                      <option value="Auto Chess">
                        Auto Chess (8 Jugadores)
                      </option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">
                    TIPO DE SALA Y PREMIOS
                  </label>
                  {formData.formato === 'Auto Chess' ? (
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      {[
                        { id: 'AUTOCHESS_3', costo: 3, p1: 12, p2: 5, p3: 3 },
                        { id: 'AUTOCHESS_5', costo: 5, p1: 20, p2: 10, p3: 6 },
                        {
                          id: 'AUTOCHESS_10',
                          costo: 10,
                          p1: 40,
                          p2: 18,
                          p3: 14,
                        },
                        {
                          id: 'AUTOCHESS_15',
                          costo: 15,
                          p1: 60,
                          p2: 24,
                          p3: 20,
                        },
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() =>
                            setFormData({
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
                            🥇 1º: S/ {tier.p1}
                          </div>
                          <div className="text-[11px] text-gray-300">
                            🥈 2º: S/ {tier.p2}
                          </div>
                          <div className="text-[11px] text-orange-400">
                            🥉 3º: S/ {tier.p3}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tipoSala: 'BASICA',
                            costo: 6,
                            premioARepartir: 50,
                          })
                        }
                        className={`p-3 text-left rounded-xl border transition-all ${formData.tipoSala === 'BASICA' ? 'bg-orange-500/20 border-orange-500' : 'bg-[#1a1b2e] border-white/10'}`}
                      >
                        <div className="font-black text-white uppercase text-sm">
                          Básica
                        </div>
                        <div className="text-xs text-gray-400">
                          Inscripción: S/ 6.00
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tipoSala: 'PREMIUM',
                            costo: 11,
                            premioARepartir: 100,
                          })
                        }
                        className={`p-3 text-left rounded-xl border transition-all ${formData.tipoSala === 'PREMIUM' ? 'bg-purple-500/20 border-purple-500' : 'bg-[#1a1b2e] border-white/10'}`}
                      >
                        <div className="font-black text-white uppercase text-sm">
                          Premium 💎
                        </div>
                        <div className="text-xs text-gray-400">
                          Inscripción: S/ 11.00
                        </div>
                      </button>
                    </div>
                  )}
                  {user?.rol === 'SUPERADMIN' && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, tipoSala: 'PERSONALIZADA' })
                      }
                      className={`mt-2 w-full p-3 text-left rounded-xl border transition-all ${formData.tipoSala === 'PERSONALIZADA' ? 'bg-red-500/20 border-red-500' : 'bg-[#1a1b2e] border-white/10'}`}
                    >
                      <div className="font-black text-red-400 uppercase text-sm flex items-center gap-2">
                        <Shield size={14} /> Personalizada (Admin)
                      </div>
                    </button>
                  )}
                  {formData.tipoSala === 'PERSONALIZADA' &&
                    user?.rol === 'SUPERADMIN' && (
                      <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-red-950/20 rounded-xl border border-red-500/20">
                        <div>
                          <label className="block text-[10px] font-bold text-red-400 mb-1">
                            Costo
                          </label>
                          <input
                            type="number"
                            value={formData.costo}
                            onChange={(e) =>
                              setFormData({
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
                              setFormData({
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
                    onClick={() => setShowModal(false)}
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
          </div>,
          document.body,
        )}

      {/* ====== MODAL DEL LOBBY PRINCIPAL ====== */}
      {salaSeleccionada &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closeSalaModal}
          >
            <div
              className="bg-[#0b0c1b] border border-white/10 rounded-2xl max-w-4xl w-full flex flex-col shadow-2xl relative overflow-hidden h-full max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeSalaModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-white z-50 transition-colors bg-black/50 rounded-full p-1.5 shadow-lg border border-white/10"
              >
                <X size={20} />
              </button>
              <div className="absolute top-4 right-14 z-50 pointer-events-none pr-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border backdrop-blur-md shadow-lg transition-all ${
                    salaSeleccionada.estado === 'ESPERANDO'
                      ? 'bg-green-900/40 text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                      : salaSeleccionada.estado === 'EN_CURSO'
                        ? 'bg-blue-900/40 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : salaSeleccionada.estado === 'FINALIZADA'
                          ? 'bg-red-900/40 text-red-500 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                          : 'bg-gray-900/40 text-gray-400 border-gray-500/50'
                  }`}
                >
                  {salaSeleccionada.estado === 'ESPERANDO' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  )}
                  {salaSeleccionada.estado === 'EN_CURSO' && (
                    <Swords size={12} className="text-blue-400" />
                  )}
                  {salaSeleccionada.estado === 'FINALIZADA' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  )}

                  {salaSeleccionada.estado === 'ESPERANDO'
                    ? 'ESPERANDO'
                    : salaSeleccionada.estado === 'EN_CURSO'
                      ? 'EN CURSO'
                      : salaSeleccionada.estado === 'FINALIZADA'
                        ? 'FINALIZADA'
                        : salaSeleccionada.estado}
                </span>
              </div>

              {salaSeleccionada.estado === 'ESPERANDO' &&
                user?.rol === 'SUPERADMIN' &&
                salaSeleccionada.formato === 'Auto Chess' && (
                  <div className="pt-4 px-6 shrink-0 flex justify-center z-40 relative bg-[#0b0c1b]">
                    <button
                      onClick={handleEmpezarPartida}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black uppercase tracking-widest py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all hover:scale-105 flex items-center gap-2"
                    >
                      ⚔️ Iniciar Partida Ahora
                    </button>
                  </div>
                )}

              <div className="relative p-6 border-b border-white/5 shrink-0 bg-[#0b0c1b] z-30">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20 opacity-50"></div>
                <div className="relative z-10 text-center">
                  <span className="inline-block px-3 py-1 mb-2 text-xs font-black tracking-widest text-orange-400 bg-orange-500/10 rounded-full border border-orange-500/20 uppercase">
                    {salaSeleccionada.juego} • {salaSeleccionada.formato}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">
                    Partida de{' '}
                    <span className="text-orange-500">
                      {salaSeleccionada.creador}
                    </span>
                  </h2>
                  <div className="flex items-center justify-center gap-6 mt-4 text-sm font-bold text-gray-400">
                    <div className="flex items-center gap-2">
                      <Coins size={16} className="text-yellow-500" /> Cuota:{' '}
                      <span className="text-white">
                        S/ {salaSeleccionada.costo?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-500" /> Jugadores:{' '}
                      <span className="text-gray-400">
                        {salaSeleccionada.participantes?.length || 0} /{' '}
                        {salaSeleccionada.formato === 'Auto Chess'
                          ? 8
                          : salaSeleccionada.maxJugadores || 10}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 bg-[#141526] p-6 relative z-10">
                {['ESPERANDO', 'SORTEO', 'DRAFTING'].includes(
                  salaSeleccionada.estado || '',
                ) || salaSeleccionada.formato === 'Auto Chess' ? (
                  <div className="flex flex-col gap-6 relative animate-in fade-in duration-300">
                    {/* ====== BANNER DE SORTEO DE MONEDA ====== */}
                    {salaSeleccionada.estado === 'SORTEO' && (
                      <div className="bg-gradient-to-r from-orange-900/40 via-[#1a1b2e] to-purple-900/40 border border-orange-500/30 rounded-xl p-6 text-center relative overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2 flex items-center justify-center gap-3">
                          🪙 ¡Hora del Sorteo! 🪙
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                          La moneda decidirá qué capitán tiene el primer turno
                          para reclutar.
                        </p>
                        {soyCapitanGlobal ? (
                          <button
                            onClick={handleLanzarMoneda}
                            className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-black uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all transform hover:scale-105"
                          >
                            Lanzar Moneda
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                            <Crown size={16} /> Esperando a los capitanes...
                          </div>
                        )}
                      </div>
                    )}

                    {/* ====== BANNER DE TURNO DE DRAFT ====== */}
                    {salaSeleccionada.estado === 'DRAFTING' && (
                      <div className="bg-gradient-to-r from-blue-900/40 via-[#1a1b2e] to-green-900/40 border border-green-500/30 rounded-xl p-4 text-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                          ⏱️ Turno de Selección ⏱️
                        </h3>
                        <p className="text-green-400 font-bold text-sm">
                          Le toca elegir a:{' '}
                          <span className="text-white text-lg ml-1">
                            {jugadorConTurno?.username || 'Cargando...'}
                          </span>
                        </p>
                      </div>
                    )}

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
                              Puedes forzar líderes.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <h3 className="text-center font-black text-white tracking-widest uppercase text-sm border-b border-white/10 pb-3 mt-2">
                      Piscina de Jugadores
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from({
                        length:
                          salaSeleccionada.formato === 'Auto Chess'
                            ? 8
                            : salaSeleccionada.maxJugadores || 10,
                      }).map((_, index) => {
                        const jugador = salaSeleccionada.participantes?.[index];
                        const idDelJugador = jugador?.id || jugador?.usuarioId;
                        const isCapitan1 =
                          salaSeleccionada.capitan1Id != null &&
                          idDelJugador != null &&
                          salaSeleccionada.capitan1Id === idDelJugador;
                        const isCapitan2 =
                          salaSeleccionada.capitan2Id != null &&
                          idDelJugador != null &&
                          salaSeleccionada.capitan2Id === idDelJugador;
                        const isCapitan = isCapitan1 || isCapitan2;
                        const soyCapitan =
                          user?.id != null &&
                          (user.id === salaSeleccionada.capitan1Id ||
                            user.id === salaSeleccionada.capitan2Id);
                        const esMiTurno = salaSeleccionada.turnoId === user?.id; // Lógica real de turnos
                        const isEsperando =
                          jugador &&
                          (!jugador.equipo ||
                            jugador.equipo === 'ESPERANDO_DRAFT');
                        const isAutoChess =
                          salaSeleccionada.formato === 'Auto Chess';

                        return (
                          <div
                            key={`pool-${index}`}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${
                              !jugador
                                ? 'bg-[#0b0c1b] border-white/5 border-dashed'
                                : isAutoChess
                                  ? 'bg-green-900/20 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)] animate-in zoom-in-95'
                                  : isCapitan
                                    ? 'bg-yellow-500/10 border-yellow-500/50'
                                    : isEsperando
                                      ? 'bg-[#1a1b2e] border-white/10'
                                      : jugador.equipo === 'EQUIPO1'
                                        ? 'bg-blue-500/5 border-blue-500/30'
                                        : 'bg-red-500/5 border-red-500/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded flex items-center justify-center relative ${jugador && isAutoChess ? 'bg-green-500/20' : 'bg-white/5'}`}
                              >
                                {jugador ? (
                                  <Users
                                    size={18}
                                    className={
                                      isAutoChess
                                        ? 'text-green-400'
                                        : isCapitan
                                          ? 'text-yellow-500'
                                          : isEsperando
                                            ? 'text-gray-500'
                                            : jugador.equipo === 'EQUIPO1'
                                              ? 'text-blue-500'
                                              : 'text-red-500'
                                    }
                                  />
                                ) : (
                                  <UserPlus
                                    size={18}
                                    className="text-gray-600 opacity-50"
                                  />
                                )}
                                {jugador && isCapitan && (
                                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full p-1 shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-bounce">
                                    <Crown size={12} fill="currentColor" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <p
                                  className={`text-sm font-bold truncate transition-colors ${jugador ? (isCapitan ? 'text-yellow-400' : isAutoChess ? 'text-green-400' : 'text-white') : 'text-gray-600'}`}
                                >
                                  {jugador
                                    ? jugador.username
                                    : 'Esperando jugador...'}
                                </p>
                                {jugador && (
                                  <p className="text-[10px] text-gray-400 truncate mt-0.5 uppercase tracking-tighter">
                                    {isAutoChess
                                      ? 'Listo en Sala'
                                      : isCapitan
                                        ? 'Capitán de Equipo'
                                        : !isEsperando
                                          ? `Elegido por ${jugador.equipo}`
                                          : 'Disponible para Draft'}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {soyCapitan &&
                                esMiTurno &&
                                isEsperando &&
                                !isCapitan &&
                                !isAutoChess && (
                                  <button
                                    onClick={() =>
                                      handlePickPlayer(idDelJugador as number)
                                    }
                                    className="text-[10px] bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded transition-all font-black uppercase shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                                  >
                                    Reclutar
                                  </button>
                                )}
                              {user?.rol === 'SUPERADMIN' &&
                                jugador &&
                                !isCapitan &&
                                !isAutoChess && (
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
                  <div className="flex flex-col md:flex-row gap-8 relative animate-in fade-in duration-300">
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

                {/* FOOTER INTELIGENTE */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4 bg-[#0b0c1b]/50 -mx-6 p-6">
                  {miParticipacion ? (
                    <div className="flex flex-col w-full gap-4">
                      {miParticipacion.nombreLobby && (
                        <div className="mx-auto w-fit px-6 py-2.5 bg-[#141526] border border-purple-500/40 rounded-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-[0_0_15px_rgba(168,85,247,0.1)] relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-600 to-blue-500"></div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                              LOBBY:
                            </span>
                            <span className="text-purple-300 font-mono font-bold text-sm bg-black/50 px-3 py-1 rounded border border-purple-500/20 select-all">
                              {miParticipacion.nombreLobby}
                            </span>
                          </div>
                          <div className="hidden sm:block w-px h-5 bg-white/10"></div>
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
                      <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-3">
                        {salaSeleccionada.formato === 'Auto Chess' ? (
                          <div className="flex w-full justify-center items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2.5 rounded-lg text-sm font-bold">
                            ✅ Inscrito en la partida (FFA)
                          </div>
                        ) : (
                          <>
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
                              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1a1b2e] hover:bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-gray-300 transition-colors w-full sm:w-auto"
                            >
                              🔄 Cambiar a{' '}
                              {miParticipacion.equipo === 'EQUIPO1'
                                ? 'Dire 🔴'
                                : 'Radiant 🔵'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : salaSeleccionada.estado === 'ESPERANDO' ? (
                    <div className="flex flex-col sm:flex-row justify-between items-end gap-4 w-full">
                      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
                            {cuentasParaSala.map((cuenta) => (
                              <option key={cuenta.id} value={cuenta.id}>
                                🎮 {cuenta.idVisible}
                              </option>
                            ))}
                          </select>
                        </div>
                        {salaSeleccionada.formato !== 'Auto Chess' && (
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                              Elige tu Bando
                            </label>
                            <select
                              value={equipoSeleccionado}
                              onChange={(e) =>
                                setEquipoSeleccionado(e.target.value)
                              }
                              className="w-full sm:w-48 bg-[#1a1b2e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500 outline-none"
                            >
                              <option value="EQUIPO1">
                                🔵 Radiant / Atacantes
                              </option>
                              <option value="EQUIPO2">
                                🔴 Dire / Defensores
                              </option>
                            </select>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleUnirseSala}
                        disabled={isJoining}
                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isJoining
                          ? 'Procesando...'
                          : `PAGAR S/ ${salaSeleccionada.costo.toFixed(2)} Y UNIRSE`}
                      </button>
                    </div>
                  ) : (
                    <div className="w-full text-center py-2 text-gray-500 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                      🔒 Las inscripciones están cerradas
                    </div>
                  )}
                </div>

                {/* PANEL DEL SUPERADMIN (Finalizar) */}
                {salaSeleccionada.estado === 'EN_CURSO' &&
                  user?.rol === 'SUPERADMIN' && (
                    <div className="p-6 bg-black/60 border-t border-orange-500/30 text-center relative z-20 -mx-6 -mb-6">
                      {salaSeleccionada.formato !== 'Auto Chess' ? (
                        <>
                          <h3 className="text-orange-400 font-black mb-3 uppercase text-sm tracking-widest">
                            Control de Administrador (5v5)
                          </h3>
                          <p className="text-xs text-gray-400 mb-4">
                            Elige qué equipo ganó la partida.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                              onClick={() => handleDeclararGanador(1)}
                              className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
                            >
                              🏆 Ganó Equipo 1 (Azul)
                            </button>
                            <button
                              onClick={() => handleDeclararGanador(2)}
                              className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                            >
                              🏆 Ganó Equipo 2 (Rojo)
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                          <h3 className="text-green-400 font-black mb-3 uppercase text-sm tracking-widest flex items-center justify-center gap-2">
                            <Crown size={16} /> Podio de Auto Chess
                          </h3>
                          <p className="text-xs text-gray-400 mb-4">
                            Selecciona a los 3 ganadores para repartir el pozo.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-left max-w-3xl mx-auto">
                            <div className="bg-yellow-500/10 border border-yellow-500/30 p-2 rounded-lg">
                              <label className="block text-[10px] font-bold text-yellow-500 mb-1">
                                🥇 1ER PUESTO
                              </label>
                              <select
                                className="w-full bg-[#141526] text-white text-xs p-2 rounded outline-none border border-white/5"
                                value={podio1}
                                onChange={(e) =>
                                  setPodio1(Number(e.target.value))
                                }
                              >
                                <option value="0">Elegir jugador...</option>
                                {salaSeleccionada.participantes?.map((p) => (
                                  <option
                                    key={`p1-${p.usuarioId}`}
                                    value={p.usuarioId}
                                  >
                                    {p.username}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="bg-gray-400/10 border border-gray-400/30 p-2 rounded-lg">
                              <label className="block text-[10px] font-bold text-gray-300 mb-1">
                                🥈 2DO PUESTO
                              </label>
                              <select
                                className="w-full bg-[#141526] text-white text-xs p-2 rounded outline-none border border-white/5"
                                value={podio2}
                                onChange={(e) =>
                                  setPodio2(Number(e.target.value))
                                }
                              >
                                <option value="0">Elegir jugador...</option>
                                {salaSeleccionada.participantes?.map((p) => (
                                  <option
                                    key={`p2-${p.usuarioId}`}
                                    value={p.usuarioId}
                                  >
                                    {p.username}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="bg-orange-600/10 border border-orange-600/30 p-2 rounded-lg">
                              <label className="block text-[10px] font-bold text-orange-400 mb-1">
                                🥉 3ER PUESTO
                              </label>
                              <select
                                className="w-full bg-[#141526] text-white text-xs p-2 rounded outline-none border border-white/5"
                                value={podio3}
                                onChange={(e) =>
                                  setPodio3(Number(e.target.value))
                                }
                              >
                                <option value="0">Elegir jugador...</option>
                                {salaSeleccionada.participantes?.map((p) => (
                                  <option
                                    key={`p3-${p.usuarioId}`}
                                    value={p.usuarioId}
                                  >
                                    {p.username}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <button
                            onClick={handleFinalizarAutoChess}
                            className="w-full max-w-3xl mx-auto block bg-green-600 hover:bg-green-500 text-white font-black py-3 px-6 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all uppercase tracking-widest text-sm"
                          >
                            Pagar a Ganadores y Cerrar Sala
                          </button>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Salas;
