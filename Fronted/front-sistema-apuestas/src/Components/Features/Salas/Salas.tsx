import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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

const Salas: React.FC<SalasProps> = ({ filtrosModos }) => {
  const { user, actualizarSaldo } = useAuth();
  const [activeTab, setActiveTab] = useState('NAVEGAR');

  // Estados para la data real y la carga
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

  // Funcion que se ejecuta al darle a "Enviar"
  const handleSubmitSala = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.costo < 5) {
      alert('La apuesta minima es de S/ 5.00');
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
          ? 'Solicitud enviada! Un admin la revisara pronto.'
          : 'Sala creada con exito!',
      );

      setShowModal(false);
      // Refrescar las salas despues de crear
      const data = await getSalas();
      if (data && data.length > 0) {
        setSalasReales(data);
      }
    } catch {
      alert('Hubo un error al procesar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Peticion al Backend al montar
  useEffect(() => {
    const fetchSalasBD = async () => {
      try {
        const data = await getSalas();
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
          if (cuentas.length > 0) setSelectedAccountId(cuentas[0].id);
        }
      } catch (error) {
        console.error('Error al traer las cuentas de juego', error);
      }
    };
    fetchCuentas();
  }, []);

  // LOGICA DE FILTRADO INTELIGENTE
  const salasFiltradas = salasReales.filter((sala) => {
    if (activeTab === 'NAVEGAR') {
      return sala.estado === 'ESPERANDO';
    } else if (activeTab === 'MIS SALAS') {
      const soyCreador = sala.creador === user?.username;
      const soyParticipante = sala.participantes?.some(
        (p) => p.username === user?.username,
      );
      return soyCreador || soyParticipante;
    }
    return true;
  });

  const handleUnirseSala = async () => {
    if (!salaSeleccionada) return;

    setIsJoining(true);
    try {
      const response = await unirseASala({
        salaId: salaSeleccionada.id,
        gameAccountId: Number(selectedAccountId),
        equipo: equipoSeleccionado,
      });

      alert(response?.mensaje || 'Te has unido a la sala con exito!');

      if (response.saldoRealRestante !== undefined) {
        actualizarSaldo(response.saldoRealRestante, response.saldoBonoRestante);
      }

      setSalaSeleccionada(null);
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

  const handleCambiarEquipo = async (salaId: number, nuevoEquipo: string) => {
    try {
      await cambiarEquipoSala(salaId, nuevoEquipo);

      alert(
        'Te has cambiado al ' + (nuevoEquipo === 'EQUIPO1' ? 'Radiant' : 'Dire') + ' exitosamente!',
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

      <SalasList
        salas={salasFiltradas}
        isLoading={isLoading}
        activeTab={activeTab}
        onSelectSala={setSalaSeleccionada}
      />

      {/* Modal de Crear / Solicitar Sala */}
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

      {/* Modal del Lobby */}
      {salaSeleccionada &&
        createPortal(
          <ModalLobby
            sala={salaSeleccionada}
            userRol={user?.rol}
            userId={user?.id}
            username={user?.username}
            cuentasJuego={cuentasJuego}
            selectedAccountId={selectedAccountId}
            onSelectedAccountChange={setSelectedAccountId}
            equipoSeleccionado={equipoSeleccionado}
            onEquipoChange={setEquipoSeleccionado}
            isJoining={isJoining}
            onUnirseSala={handleUnirseSala}
            onCambiarEquipo={handleCambiarEquipo}
            onClose={() => setSalaSeleccionada(null)}
          />,
          document.body,
        )}
    </div>
  );
};

export default Salas;
