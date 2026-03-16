export const ESTADOS_SALA = {
  ESPERANDO: 'ESPERANDO',
  SORTEO: 'SORTEO',
  DRAFTING: 'DRAFTING',
  EN_CURSO: 'EN_CURSO',
  FINALIZADA: 'FINALIZADA',
} as const;

export type EstadoSala = (typeof ESTADOS_SALA)[keyof typeof ESTADOS_SALA];

export const ESTADOS_PRE_PARTIDA = [
  ESTADOS_SALA.ESPERANDO,
  ESTADOS_SALA.SORTEO,
  ESTADOS_SALA.DRAFTING,
];

export const ESTADOS_EN_CURSO_O_DRAFT = [
  ESTADOS_SALA.EN_CURSO,
  ESTADOS_SALA.SORTEO,
  ESTADOS_SALA.DRAFTING,
];

export const getEstadoLabel = (estado?: string) => {
  switch (estado) {
    case ESTADOS_SALA.ESPERANDO:
      return 'Esperando';
    case ESTADOS_SALA.SORTEO:
      return 'Sorteo';
    case ESTADOS_SALA.DRAFTING:
      return 'Draft';
    case ESTADOS_SALA.EN_CURSO:
      return 'En Curso';
    case ESTADOS_SALA.FINALIZADA:
      return 'Finalizada';
    default:
      return estado || 'Sin Estado';
  }
};
