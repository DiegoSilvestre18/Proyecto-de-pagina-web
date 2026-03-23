export const formatearFecha = (fecha: string | null | undefined) => {
  if (!fecha || fecha === 'HOY') return 'HOY';
  try {
    const date = new Date(fecha);
    return date.toLocaleString('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  } catch (e) {
    return 'HOY'; 
  }
};