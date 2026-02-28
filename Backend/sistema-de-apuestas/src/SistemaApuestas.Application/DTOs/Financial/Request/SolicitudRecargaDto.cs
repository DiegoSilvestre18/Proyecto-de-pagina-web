namespace SistemaApuestas.Application.DTOs.Financial.Request
{
    // Al momento de que el usuario mande a solicitar
    public class SolicitudRecargaDto
    {
        public decimal Monto { get; set; }
        public string Moneda { get; set; } = "PEN";
        public string Metodo { get; set; } = string.Empty;
        public string NumeroContacto { get; set; } = string.Empty; // Para que el admin sepa a qué número va a contactar
    }
}
