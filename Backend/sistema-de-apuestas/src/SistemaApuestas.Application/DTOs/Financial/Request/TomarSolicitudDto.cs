namespace SistemaApuestas.Application.DTOs.Financial.Request
{
    // El admin toma la solicitud
    public class TomarSolicitudDto
    {
        public int SolicitudId { get; set; }
        public string Tipo { get; set; } = string.Empty; // "RECARGA" o "RETIRO"
    }
}
