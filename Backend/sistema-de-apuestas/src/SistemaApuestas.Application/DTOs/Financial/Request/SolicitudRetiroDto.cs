namespace SistemaApuestas.Application.DTOs.Financial.Request
{
    public class SolicitudRetiroDto
    {
        public decimal Monto { get; set; }
        public string Moneda { get; set; } = "PEN";
        public string Metodo { get; set; } = string.Empty;
        public string CuentaDestino { get; set; } = string.Empty;
    }
}
