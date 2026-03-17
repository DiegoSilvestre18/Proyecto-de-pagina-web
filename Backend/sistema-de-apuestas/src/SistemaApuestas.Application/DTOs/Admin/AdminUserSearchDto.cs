namespace SistemaApuestas.Application.DTOs.Admin
{
    public class AdminUserSearchDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Estado { get; set; } = "ACTIVO";
        public string RangoDota { get; set; } = "N/A";
        public string RangoValorant { get; set; } = "N/A";
    }
}
