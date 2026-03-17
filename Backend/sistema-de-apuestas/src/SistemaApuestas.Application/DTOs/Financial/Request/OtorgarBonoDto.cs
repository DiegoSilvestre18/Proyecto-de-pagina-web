namespace SistemaApuestas.Application.DTOs.Financial.Request
{
    public class OtorgarBonoDto
    {
        public string Username { get; set; } = string.Empty;
        public decimal MontoBono { get; set; }
        public string Motivo { get; set; } = string.Empty;
    }
}
