import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import type { Sala } from './types/types';
import {
  getSalas,
  solicitarSala,
} from './Services/ServiceSalas';
import { useAuth } from '../../../Context/AuthContext';

import SalasHeader from './Components/SalasHeader';
import SalasTabs from './Components/SalasTabs';
import SalasFilters from './Components/SalasFilters';
import SalasList from './Components/SalasList';
import ModalCrearSala from './Components/ModalCrearSala';
import {
  ESTADOS_EN_CURSO_O_DRAFT,
  ESTADOS_SALA,
} from './constants/estados';
import { FORMATOS_VALIDOS, isFormatoValido } from './constants/formatos';

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

const Salas: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('NAVEGAR');

  const [salasReales, setSalasReales] = useState<Sala[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>('ESPERANDO');

  const [formData, setFormData] = useState<FormDataSala>({
    juego: 'DOTA2',
    formato: FORMATOS_VALIDOS.ALL_PICK_5V5,
    costo: 6,
    tipoSala: 'BASICA',
    premioARepartir: 50,
    tipoPremio: 'REAL',
    mmrMinimo: 0,
    mmrMaximo: 10000,
    nombreLobby: '',
    passwordLobby: '',
  });

  const refreshSalas = useCallback(async () => {
    try {
      const data = await getSalas();
      setSalasReales(data);
    } catch (error) {
      console.error('Error al traer salas del backend:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmitSala = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormatoValido(formData.formato)) {
      alert('Solo se permiten los formatos 5v5 All Pick y Auto Chess.');
      return;
    }

    if (
      formData.juego !== 'DOTA2' &&
      formData.formato === FORMATOS_VALIDOS.AUTO_CHESS
    ) {
      alert('Auto Chess solo esta disponible para Dota 2.');
      return;
    }

    if (formData.costo < 3) {
      alert('La cuota mínima es de S/ 3.00');
      return;
    }

    if (
      user?.rol?.toUpperCase() === 'SUPERADMIN' &&
      (!formData.nombreLobby.trim() || !formData.passwordLobby.trim())
    ) {
      alert('Como SUPERADMIN debes ingresar nombre y contraseña del lobby.');
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
        nombreLobby: formData.nombreLobby,
        passwordLobby: formData.passwordLobby,
      });

      alert(
        user?.rol === 'USER'
          ? '¡Solicitud enviada! Un admin la revisara pronto.'
          : '¡Sala creada con exito!',
      );
      setShowModal(false);
      await refreshSalas();
    } catch (error) {
      alert('Hubo un error al procesar la solicitud.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    void refreshSalas();
  }, [refreshSalas]);

  // Polling to keep the list fresh
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void refreshSalas();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [refreshSalas]);

  const salasFiltradas = salasReales.filter((sala) => {
    const soyCreador = sala.creador === user?.username;
    const soyParticipante = sala.participantes?.some(
      (p) => p.username === user?.username,
    );
    const tengoRelacionConSala = soyCreador || !!soyParticipante;

    if (activeTab === 'MIS SALAS' && !tengoRelacionConSala) {
      return false;
    }

    // EN_CURSO/FINALIZADA deben verse solo para usuarios inscritos (o creador).
    if (
      (filtroEstado === ESTADOS_SALA.EN_CURSO ||
        filtroEstado === ESTADOS_SALA.FINALIZADA) &&
      !tengoRelacionConSala
    ) {
      return false;
    }

    if (filtroEstado === ESTADOS_SALA.EN_CURSO) {
      const estado = sala.estado || ESTADOS_SALA.ESPERANDO;
      if (
        !ESTADOS_EN_CURSO_O_DRAFT.includes(
          estado as (typeof ESTADOS_EN_CURSO_O_DRAFT)[number],
        )
      ) {
        return false;
      }
    } else if (filtroEstado !== 'TODAS' && sala.estado !== filtroEstado) {
      return false;
    }

    return true;
  });

  const salasOrdenadas = [...salasFiltradas].sort((a, b) => {
    const relacionA =
      a.creador === user?.username ||
      a.participantes?.some((p) => p.username === user?.username);
    const relacionB =
      b.creador === user?.username ||
      b.participantes?.some((p) => p.username === user?.username);

    if (relacionA && !relacionB) return -1;
    if (!relacionA && relacionB) return 1;
    return 0;
  });

  const handleSelectSala = (sala: Sala) => {
    navigate(`/main/salas/${sala.id}`);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 px-4 lg:px-12 pt-8 max-w-[1600px] mx-auto">
      <SalasHeader userRol={user?.rol} onOpenModal={() => setShowModal(true)} />

      <SalasTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <SalasFilters
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
      />

      <SalasList
        salas={salasOrdenadas}
        isLoading={isLoading}
        onSelectSala={handleSelectSala}
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
    </div>
  );
};

export default Salas;
