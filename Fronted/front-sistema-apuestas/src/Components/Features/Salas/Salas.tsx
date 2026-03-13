import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import type { CuentaJuego, Sala } from './types/types';
import {
  getSalas,
  solicitarSala,
  unirseASala,
  getMisCuentasJuego,
  cambiarEquipoSala,
  finalizarSalaAdmin,
  finalizarAutoChessAdmin,
  empezarPartidaAdmin,
  lanzarMonedaSala,
  reclutarJugadorDraft,
} from './Services/ServiceSalas';
import { useAuth } from '../../../Context/AuthContext';

import SalasHeader from './Components/SalasHeader';
import SalasTabs from './Components/SalasTabs';
import SalasFilters from './Components/SalasFilters';
import SalasList from './Components/SalasList';
import ModalCrearSala from './Components/ModalCrearSala';
import ModalLobby from './Components/ModalLobby';

const Salas: React.FC = () => {
  const { user, gameAccounts, hasGameAccount, updateBalance, actualizarSaldo } =
    useAuth();
  const [activeTab, setActiveTab] = useState('NAVEGAR');

  const [salasReales, setSalasReales] = useState<Sala[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [salaSeleccionada, setSalaSeleccionada] = useState<Sala | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>('ESPERANDO');

  const [podio1, setPodio1] = useState<number>(0);
  const [podio2, setPodio2] = useState<number>(0);
  const [podio3, setPodio3] = useState<number>(0);

  const [formData, setFormData] = useState({
    juego: 'DOTA2',
    formato: '5v5 Captains Mode',
    costo: 6,
    tipoSala: 'BASICA',
    premioARepartir: 50,
    tipoPremio: 'REAL',
    mmrMinimo: 0,
    mmrMaximo: 10000,
  });

  const [isJoining, setIsJoining] = useState(false);
  const [, setCuentasJuego] = useState<CuentaJuego[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | ''>('');
  const [equipoSeleccionado, setEquipoSeleccionado] =
    useState<string>('EQUIPO1');

  const closeSalaModal = () => {
    setSalaSeleccionada(null);
  };

  const handleSubmitSala = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.costo < 3) {
      alert('La apuesta minima es de S/ 3.00');
      return;
    }
    setIsSubmitting(true);
    try {
      await solicitarSala({
        juego: formData.juego,
        formato: formData.formato,
        costoEntrada: formData.costo,
        tipoSala: formData.tipoSala,
        tipoPremio: formData.tipoPremio || 'REAL',
        premioARepartir: formData.premioARepartir,
        mmrMinimo: formData.mmrMinimo,
        mmrMaximo: formData.mmrMaximo,
      });

      alert(
        user?.rol === 'USER'
          ? '¡Solicitud enviada! Un admin la revisara pronto.'
          : '¡Sala creada con exito!',
      );
      setShowModal(false);
    } catch (error) {
      alert('Hubo un error al procesar la solicitud.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchSalasBD = async () => {
      try {
        const data = await getSalas();
        if (data && data.length > 0) setSalasReales(data);
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
          if (cuentas.length > 0) setSelectedAccountId(cuentas[0].id);
        }
      } catch (error) {
        console.error('Error al traer las cuentas de juego', error);
      }
    };
    fetchCuentas();
  }, []);

  // Filtrar cuentas de juego segun la sala seleccionada
  const normalizeJuego = (s: string) =>
    s?.toUpperCase().replace(/\d+$/, '') || '';
  const cuentasParaSala = salaSeleccionada
    ? (gameAccounts || []).filter(
        (acc) =>
          normalizeJuego(acc.juego) ===
          normalizeJuego(salaSeleccionada.juego || ''),
      )
    : gameAccounts || [];

  useEffect(() => {
    if (cuentasParaSala.length > 0) {
      setSelectedAccountId(cuentasParaSala[0].id);
    } else {
      setSelectedAccountId('');
    }
  }, [salaSeleccionada, cuentasParaSala.length]);

  useEffect(() => {
    if (!salaSeleccionada) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSalaModal();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [salaSeleccionada]);

  const salasFiltradas = salasReales.filter((sala) => {
    if (activeTab === 'MIS SALAS') {
      const soyCreador = sala.creador === user?.username;
      const soyParticipante = sala.participantes?.some(
        (p) => p.username === user?.username,
      );
      if (!soyCreador && !soyParticipante) return false;
    }
    if (filtroEstado !== 'TODAS' && sala.estado !== filtroEstado) {
      return false;
    }
    return true;
  });

  const handleUnirseSala = async () => {
    if (!salaSeleccionada) return;

    if (hasGameAccount && !hasGameAccount(salaSeleccionada.juego || '')) {
      alert(
        `Necesitas vincular una cuenta de ${salaSeleccionada.juego} para unirte a esta sala.`,
      );
      return;
    }

    setIsJoining(true);
    try {
      const response = await unirseASala({
        salaId: salaSeleccionada.id,
        gameAccountId: Number(selectedAccountId),
        equipo: equipoSeleccionado,
      });

      alert(response?.mensaje || '¡Te has unido a la sala con exito!');

      if (
        response?.saldoRealRestante !== undefined &&
        response?.saldoBonoRestante !== undefined
      ) {
        if (updateBalance)
          updateBalance(response.saldoRealRestante, response.saldoBonoRestante);
        if (actualizarSaldo)
          actualizarSaldo(
            response.saldoRealRestante,
            response.saldoBonoRestante,
          );
      }

      setSalaSeleccionada(null);
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Hubo un error al intentar unirte a la sala.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleLanzarMoneda = async () => {
    if (!salaSeleccionada) return;
    try {
      const response = await lanzarMonedaSala(salaSeleccionada.id);
      alert(response?.mensaje || '¡La moneda ha hablado!');
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const handlePickPlayer = async (jugadorId: number) => {
    if (!salaSeleccionada) return;
    try {
      const response = await reclutarJugadorDraft(
        salaSeleccionada.id,
        jugadorId,
      );
      alert(response?.mensaje || '¡Jugador reclutado!');
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const handleEmpezarPartida = async () => {
    if (!salaSeleccionada) return;
    const confirmacion = window.confirm(
      '¿Estas seguro de iniciar la partida? Esto cambiara el estado a EN CURSO.',
    );
    if (!confirmacion) return;
    try {
      const response = await empezarPartidaAdmin(salaSeleccionada.id);
      alert(response?.mensaje || 'Partida iniciada.');
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) alert('Error al iniciar: ' + error.message);
    }
  };

  const handleDeclararGanador = async (equipoGanador: number) => {
    if (!salaSeleccionada) return;
    const confirmacion = window.confirm(
      `¿Estas seguro de declarar al EQUIPO ${equipoGanador} como ganador?`,
    );
    if (!confirmacion) return;
    try {
      const response = await finalizarSalaAdmin(
        salaSeleccionada.id,
        equipoGanador,
      );
      alert(response?.mensaje || 'Sala finalizada y dinero repartido.');
      setSalaSeleccionada(null);
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) alert('Error al finalizar: ' + error.message);
    }
  };

  const handleFinalizarAutoChess = async () => {
    if (!salaSeleccionada) return;
    if (!podio1 || !podio2 || !podio3)
      return alert('Debes seleccionar a los 3 ganadores.');
    if (podio1 === podio2 || podio1 === podio3 || podio2 === podio3)
      return alert('Los 3 puestos deben ser diferentes.');

    const confirmacion = window.confirm(
      `¿Estas seguro de finalizar el Auto Chess y repartir los premios?`,
    );
    if (!confirmacion) return;

    try {
      const response = await finalizarAutoChessAdmin(
        salaSeleccionada.id,
        podio1,
        podio2,
        podio3,
      );
      alert(response?.mensaje || 'Auto Chess finalizado exitosamente.');
      setSalaSeleccionada(null);
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) alert('Error: ' + error.message);
    }
  };

  const handleCambiarEquipo = async (salaId: number, nuevoEquipo: string) => {
    try {
      await cambiarEquipoSala(salaId, nuevoEquipo);
      alert(
        `¡Te has cambiado al ${nuevoEquipo === 'EQUIPO1' ? 'Radiant' : 'Dire'} exitosamente!`,
      );
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const jugadorConTurno =
    salaSeleccionada?.participantes?.find(
      (p) => (p.usuarioId || p.id) === salaSeleccionada?.turnoId,
    ) || null;

  const soyCapitanGlobal = !!(
    salaSeleccionada &&
    user?.id != null &&
    (user.id === salaSeleccionada.capitan1Id ||
      user.id === salaSeleccionada.capitan2Id)
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20 px-4 lg:px-12 pt-8 max-w-[1600px] mx-auto">
      <SalasHeader userRol={user?.rol} onOpenModal={() => setShowModal(true)} />

      <SalasTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <SalasFilters
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
      />

      <SalasList
        salas={salasFiltradas}
        isLoading={isLoading}
        onSelectSala={setSalaSeleccionada}
      />

      {/* Modal Crear / Solicitar Sala */}
      {showModal &&
        createPortal(
          <ModalCrearSala
            userRol={user?.rol}
            formData={formData}
            onFormChange={setFormData}
            onSubmit={handleSubmitSala}
            isSubmitting={isSubmitting}
            onClose={() => setShowModal(false)}
          />,
          document.body,
        )}

      {/* Modal Lobby */}
      {salaSeleccionada &&
        createPortal(
          <ModalLobby
            sala={salaSeleccionada}
            userRol={user?.rol}
            userId={user?.id}
            username={user?.username}
            cuentasJuego={cuentasParaSala}
            selectedAccountId={selectedAccountId}
            onSelectedAccountChange={(id) => setSelectedAccountId(id)}
            equipoSeleccionado={equipoSeleccionado}
            onEquipoChange={setEquipoSeleccionado}
            isJoining={isJoining}
            onUnirseSala={handleUnirseSala}
            onCambiarEquipo={handleCambiarEquipo}
            onClose={closeSalaModal}
            onLanzarMoneda={handleLanzarMoneda}
            onPickPlayer={handlePickPlayer}
            onEmpezarPartida={handleEmpezarPartida}
            onDeclararGanador={handleDeclararGanador}
            onFinalizarAutoChess={handleFinalizarAutoChess}
            soyCapitanGlobal={soyCapitanGlobal}
            jugadorConTurno={jugadorConTurno}
            podio1={podio1}
            podio2={podio2}
            podio3={podio3}
            onPodio1Change={setPodio1}
            onPodio2Change={setPodio2}
            onPodio3Change={setPodio3}
          />,
          document.body,
        )}
    </div>
  );
};

export default Salas;
