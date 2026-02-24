namespace SistemaApuestas.Application.DTOs.Finanzas
{
    public class RecargaAdminDto
    {
        public int UsuarioDestinoId { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; } = string.Empty;
        public string CodigoOperacion { get; set; } = string.Empty;
        public string TipoSaldo { get; set; } = "REAL";
    }
}