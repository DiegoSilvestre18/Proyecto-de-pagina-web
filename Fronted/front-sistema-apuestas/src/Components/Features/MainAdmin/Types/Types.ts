export interface solicitudType {
  solicitudId: number;
  tipo: string;
  monto: number;
  moneda: string;
  metodo: string;
  cuentaDestino: string;
  fechaEmision: string;
  usuarioId: number;
  username: string;
  telefono: string;
  email: string;
}

export interface procesarSolicitudType {
  solicitudId: number;
  aprobar: boolean;
  nroOperacion: string;
  cuentaDestino: string;
}
