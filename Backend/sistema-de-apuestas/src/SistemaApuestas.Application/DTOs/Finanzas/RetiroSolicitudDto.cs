namespace SistemaApuestas.Application.DTOs.Finanzas
{
    public class RetiroSolicitudDto
    {
        public decimal Monto { get; set; }
        public string CuentaDestino { get; set; } = string.Empty;
    }
}