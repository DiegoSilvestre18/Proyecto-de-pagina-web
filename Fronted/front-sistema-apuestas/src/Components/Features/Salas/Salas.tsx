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

const Salas: React.FC<SalasProps> = ({ filtrosModos }) => {
  const { actualizarSaldo, user } = useAuth();
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

      <SalasList
        salas={salasAMostrar}
        isLoading={isLoading}
        activeTab={activeTab}
        onSelectSala={setSalaSeleccionada}
      />

      {showModal && (
        <ModalCrearSala
          userRol={user?.rol}
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleSubmitSala}
          isSubmitting={isSubmitting}
          onClose={() => setShowModal(false)}
        />
      )}

      {salaSeleccionada && (
        <ModalLobby
          sala={salaSeleccionada}
          userRol={user?.rol}
          userId={user?.id}
          username={user?.username}
          cuentasJuego={cuentasJuego}
          selectedAccountId={selectedAccountId}
          onSelectedAccountChange={(id) => setSelectedAccountId(id)}
          equipoSeleccionado={equipoSeleccionado}
          onEquipoChange={setEquipoSeleccionado}
          isJoining={isJoining}
          onUnirseSala={handleUnirseSala}
          onCambiarEquipo={handleCambiarEquipo}
          onClose={() => setSalaSeleccionada(null)}
        />
      )}
    </div>
  );
};

export default Salas;
