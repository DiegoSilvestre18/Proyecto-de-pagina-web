export const FORMATOS_VALIDOS = {
  ALL_PICK_5V5: '5v5 All Pick',
  AUTO_CHESS: 'Auto Chess',
} as const;

export type FormatoSala =
  (typeof FORMATOS_VALIDOS)[keyof typeof FORMATOS_VALIDOS];

export const FORMATOS_SALA: FormatoSala[] = [
  FORMATOS_VALIDOS.ALL_PICK_5V5,
  FORMATOS_VALIDOS.AUTO_CHESS,
];

export const isFormatoValido = (formato: string): formato is FormatoSala => {
  return FORMATOS_SALA.includes(formato as FormatoSala);
};

export const isAutoChess = (formato: string) => {
  return formato === FORMATOS_VALIDOS.AUTO_CHESS;
};
