namespace SistemaApuestas.Application.DTOs.Financial.Request
{
    public class TomarSolicitudDto
    {
        public int SolicitudId { get; set; }
        public string Tipo { get; set; } = string.Empty; // "RECARGA" o "RETIRO"
    }
}
