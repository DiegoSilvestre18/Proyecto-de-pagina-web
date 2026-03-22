import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { ArrowLeft, Swords } from 'lucide-react';
import { useAuth } from '../../../../Context/AuthContext';
import { SIGNALR_URL } from '../../../../Global/Api';
import type { Sala, CuentaJuego } from '../types/types';
import {
  getSalas, // Temporalmente usaremos getSalas hasta implementar un getSalaById si no existe
  unirseASala,
  getMisCuentasJuego,
  cambiarEquipoSala,
  retirarseDeSala,
  finalizarSalaAdmin,
  finalizarAutoChessAdmin,
  empezarPartidaAdmin,
  lanzarMonedaSala,
  reclutarJugadorDraft,
} from '../Services/ServiceSalas';

import { ESTADOS_SALA, getEstadoLabel } from '../constants/estados';
import { FORMATOS_VALIDOS } from '../constants/formatos';

import LobbyHeader from '../Components/LobbyHeader';
import PiscinaJugadores from '../Components/PiscinaJugadores';
import EquiposView from '../Components/EquiposView';
import LobbyFooter from '../Components/LobbyFooter';
import AdminPanel from '../Components/AdminPanel';

const SalaDetallePage: React.FC = () => {
  const { salaId } = useParams<{ salaId: string }>();
  const navigate = useNavigate();
  const { user, gameAccounts, hasGameAccount, updateBalance, actualizarSaldo } = useAuth();

  const [sala, setSala] = useState<Sala | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados locales (anteriormente en Salas.tsx)
  const [cuentasJuego, setCuentasJuego] = useState<CuentaJuego[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | ''>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isJoining, setIsJoining] = useState(false);
  const [podio1, setPodio1] = useState<number>(0);
  const [podio2, setPodio2] = useState<number>(0);
  const [podio3, setPodio3] = useState<number>(0);

  const fetchSala = useCallback(async () => {
    try {
      const salas = await getSalas(); // Idealmente sería getSalaById(salaId)
      const salaEncontrada = salas.find((s) => s.id.toString() === salaId);
      if (salaEncontrada) {
        setSala(salaEncontrada);
      } else {
        setError('Sala no encontrada');
      }
    } catch (err) {
      console.error('Error al traer la sala:', err);
      setError('Error al cargar la sala');
    } finally {
      setIsLoading(false);
    }
  }, [salaId]);

  useEffect(() => {
    void fetchSala();
  }, [fetchSala]);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const cuentas = await getMisCuentasJuego();
        if (Array.isArray(cuentas)) {
          setCuentasJuego(cuentas);
        }
      } catch (error) {
        console.error('Error al traer las cuentas de juego', error);
      }
    };
    void fetchCuentas();
  }, []);

  const normalizeJuego = (s: string) => s?.toUpperCase().replace(/\d+$/, '') || '';
  const cuentasParaSala = sala
    ? (gameAccounts || []).filter(
        (acc) => normalizeJuego(acc.juego) === normalizeJuego(sala.juego || '')
      )
    : gameAccounts || [];

  useEffect(() => {
    if (cuentasParaSala.length > 0) {
      setSelectedAccountId(cuentasParaSala[0].id);
    } else {
      setSelectedAccountId('');
    }
  }, [sala?.juego, cuentasParaSala.length]);

  // SignalR Logic
  useEffect(() => {
    if (!sala) return;

    const necesitaActualizacionEnVivo =
      sala.estado === ESTADOS_SALA.ESPERANDO ||
      sala.estado === ESTADOS_SALA.SORTEO ||
      sala.estado === ESTADOS_SALA.DRAFTING;

    if (!necesitaActualizacionEnVivo) return;

    const connection = new HubConnectionBuilder()
      .withUrl(SIGNALR_URL)
      .configureLogging(LogLevel.Information)
      .build();

    const iniciarConexion = async () => {
      try {
        await connection.start();
        await connection.invoke('UnirseASala', sala.id.toString());
      } catch (error) {
        console.error('Error al conectar con SignalR:', error);
      }
    };

    connection.on('ActualizarPantalla', () => {
      void fetchSala();
    });

    void iniciarConexion();

    return () => {
      void connection.stop();
    };
  }, [sala?.id, sala?.estado, fetchSala]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-white font-bold">Cargando sala...</div>;
  }

  if (error || !sala) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white gap-4">
        <h2 className="text-2xl font-bold text-red-500">{error || 'Sala no encontrada'}</h2>
        <button onClick={() => navigate('/main/salas')} className="px-6 py-2 bg-[#1a1b2e] border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
          Volver a Salas
        </button>
      </div>
    );
  }

  const isPoolView =
    sala.estado === ESTADOS_SALA.ESPERANDO ||
    sala.estado === ESTADOS_SALA.SORTEO ||
    sala.estado === ESTADOS_SALA.DRAFTING ||
    sala.formato === FORMATOS_VALIDOS.AUTO_CHESS;

  const miParticipacion = sala.participantes?.find(
    (p) => p.username === user?.username
  );

  const jugadorConTurno =
    sala.participantes?.find((p) => (p.usuarioId || p.id) === sala.turnoId) || null;

  const soyCapitanGlobal = !!(
    user?.id != null &&
    (user.id === sala.capitan1Id || user.id === sala.capitan2Id)
  );

  const soyCreador = sala.creador === user?.username;
  const esSuperAdmin = user?.rol === 'SUPERADMIN';
  const puedeVerLobby = !!miParticipacion || soyCreador || esSuperAdmin;

  const handleUnirseSala = async () => {
    if (hasGameAccount && !hasGameAccount(sala.juego || '')) {
      alert(`Necesitas vincular una cuenta de ${sala.juego} para unirte a esta sala.`);
      return;
    }
    setIsJoining(true);
    try {
      const response = await unirseASala({
        salaId: sala.id,
        gameAccountId: Number(selectedAccountId),
        equipo: 'ESPERANDO_DRAFT',
        rolJuego: selectedRole,
      });
      alert(response?.mensaje || '¡Te has unido a la sala con exito!');
      if (response?.saldoRealRestante !== undefined && response?.saldoBonoRestante !== undefined) {
        if (updateBalance) updateBalance(response.saldoRealRestante, response.saldoBonoRestante);
        if (actualizarSaldo) actualizarSaldo(response.saldoRealRestante, response.saldoBonoRestante, response.saldoRecargaRestante);
      }
      await fetchSala();
    } catch (error: any) {
      alert(error.message || 'Hubo un error al intentar unirte a la sala.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleRetirarseSala = async () => {
    if (!window.confirm('¿Deseas retirarte de esta sala? Si ya pasaron 8 minutos y la sala no está llena, se reembolsará tu inscripción.')) return;
    try {
      const response = await retirarseDeSala(sala.id);
      alert(response?.mensaje || 'Te retiraste de la sala.');
      if (response?.saldoRealRestante !== undefined && response?.saldoBonoRestante !== undefined && response?.saldoRecargaRestante !== undefined) {
        if (updateBalance) updateBalance(response.saldoRealRestante, response.saldoBonoRestante);
        if (actualizarSaldo) actualizarSaldo(response.saldoRealRestante, response.saldoBonoRestante, response.saldoRecargaRestante);
      }
      await fetchSala();
    } catch (error: any) {
      alert(error.message || 'No fue posible retirarte de la sala.');
    }
  };

  const handleCambiarEquipo = async (salaId: number, nuevoEquipo: string) => {
    try {
      await cambiarEquipoSala(salaId, nuevoEquipo);
      alert(`¡Te has cambiado al ${nuevoEquipo === 'EQUIPO1' ? 'Radiant' : 'Dire'} exitosamente!`);
      await fetchSala();
    } catch (error: any) {
      alert(error.message || 'Error al cambiar de equipo.');
    }
  };

  const handleLanzarMoneda = async () => {
    try {
      const response = await lanzarMonedaSala(sala.id);
      alert(response?.mensaje || '¡La moneda ha hablado!');
      await fetchSala();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handlePickPlayer = async (jugadorId: number) => {
    try {
      const response = await reclutarJugadorDraft(sala.id, jugadorId);
      alert(response?.mensaje || '¡Jugador reclutado!');
      await fetchSala();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEmpezarPartida = async () => {
    if (!window.confirm('¿Estas seguro de iniciar la partida? Esto cambiara el estado a EN CURSO.')) return;
    try {
      const response = await empezarPartidaAdmin(sala.id);
      alert(response?.mensaje || 'Partida iniciada.');
      await fetchSala();
    } catch (error: any) {
      alert('Error al iniciar: ' + error.message);
    }
  };

  const handleDeclararGanador = async (equipoGanador: number) => {
    if (!window.confirm(`¿Estas seguro de declarar al EQUIPO ${equipoGanador} como ganador?`)) return;
    try {
      const response = await finalizarSalaAdmin(sala.id, equipoGanador);
      alert(response?.mensaje || 'Sala finalizada y dinero repartido.');
      await fetchSala();
    } catch (error: any) {
      alert('Error al finalizar: ' + error.message);
    }
  };

  const handleFinalizarAutoChess = async () => {
    if (!podio1 || !podio2 || !podio3) return alert('Debes seleccionar a los 3 ganadores.');
    if (podio1 === podio2 || podio1 === podio3 || podio2 === podio3) return alert('Los 3 puestos deben ser diferentes.');
    if (!window.confirm(`¿Estas seguro de finalizar el Auto Chess y repartir los premios?`)) return;
    try {
      const response = await finalizarAutoChessAdmin(sala.id, podio1, podio2, podio3);
      alert(response?.mensaje || 'Auto Chess finalizado exitosamente.');
      await fetchSala();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#0b0c1b] text-white animate-in fade-in duration-500 flex flex-col pt-4 pb-12 px-4 lg:px-8 max-w-[1600px] mx-auto w-full">
      {/* Top Navigation */}
      <div className="mb-4 shrink-0 flex items-center justify-between">
        <button
          onClick={() => navigate('/main/salas')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10"
        >
          <ArrowLeft size={18} />
          <span className="font-bold text-sm tracking-widest uppercase">Volver a Salas</span>
        </button>

        {/* Estado badge */}
        <div
          className={`inline-flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest border backdrop-blur-md shadow-lg ${
            sala.estado === 'ESPERANDO'
              ? 'bg-green-900/40 text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
              : sala.estado === 'SORTEO' || sala.estado === 'DRAFTING'
                ? 'bg-orange-900/40 text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                : sala.estado === 'EN_CURSO'
                  ? 'bg-blue-900/40 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : sala.estado === 'FINALIZADA'
                    ? 'bg-red-900/40 text-red-500 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                    : 'bg-gray-900/40 text-gray-400 border-gray-500/50'
          }`}
        >
          {sala.estado === 'ESPERANDO' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
          {sala.estado === 'EN_CURSO' && <Swords size={14} className="text-blue-400" />}
          {(sala.estado === 'SORTEO' || sala.estado === 'DRAFTING') && <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>}
          {sala.estado === 'FINALIZADA' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
          {(getEstadoLabel(sala.estado) || '').toUpperCase()}
        </div>
      </div>

      {/* Admin: Iniciar Partida button for Auto Chess ESPERANDO */}
      {sala.estado === 'ESPERANDO' && user?.rol === 'SUPERADMIN' && sala.formato === FORMATOS_VALIDOS.AUTO_CHESS && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={handleEmpezarPartida}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black uppercase tracking-widest py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all hover:scale-105 flex items-center gap-2"
          >
            Iniciar Partida Ahora
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-[#141526] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col flex-1">
        {/* Panoraminc Header */}
        <LobbyHeader sala={sala} puedeVerLobby={puedeVerLobby} />

        {/* Content Layout: 2 Columns on Desktop */}
        <div className="flex flex-col xl:flex-row flex-1 min-h-0">
          
          {/* Left Column: Visualización Principal */}
          <div className="flex-1 p-6 lg:p-8 xl:border-r border-white/5">
            {isPoolView ? (
              <PiscinaJugadores
                sala={sala}
                userRol={user?.rol}
                userId={user?.id}
                soyCapitanGlobal={soyCapitanGlobal}
                jugadorConTurno={jugadorConTurno}
                onLanzarMoneda={handleLanzarMoneda}
                onPickPlayer={handlePickPlayer}
                onActualizarSala={fetchSala}
              />
            ) : (
              <EquiposView sala={sala} />
            )}
          </div>

          {/* Right Column: Actions (Sticky) */}
          <div className="w-full xl:w-[420px] shrink-0 bg-[#0b0c1b]/50 p-6 lg:p-8 flex flex-col gap-6">
            <h3 className="font-black text-gray-400 tracking-widest uppercase text-sm border-b border-white/10 pb-3">
              {miParticipacion ? 'Tu Participación' : 'Inscripción a la Partida'}
            </h3>
            
            <LobbyFooter
              sala={sala}
              userRol={user?.rol}
              miParticipacion={miParticipacion as any}
              cuentasJuego={cuentasParaSala.length > 0 ? cuentasParaSala : cuentasJuego}
              selectedAccountId={selectedAccountId}
              onSelectedAccountChange={setSelectedAccountId}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              isJoining={isJoining}
              onUnirseSala={handleUnirseSala}
              onCambiarEquipo={handleCambiarEquipo}
              onRetirarseSala={handleRetirarseSala}
            />

            {/* Admin Panel (EN_CURSO only) */}
            {sala.estado === 'EN_CURSO' && user?.rol === 'SUPERADMIN' && (
              <div className="mt-8 border-t border-white/10 pt-6">
                 <h3 className="font-black text-orange-500 tracking-widest uppercase text-sm mb-4">
                  Administración
                </h3>
                <AdminPanel
                  sala={sala}
                  podio1={podio1}
                  podio2={podio2}
                  podio3={podio3}
                  onPodio1Change={setPodio1}
                  onPodio2Change={setPodio2}
                  onPodio3Change={setPodio3}
                  onDeclararGanador={handleDeclararGanador}
                  onFinalizarAutoChess={handleFinalizarAutoChess}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaDetallePage;
