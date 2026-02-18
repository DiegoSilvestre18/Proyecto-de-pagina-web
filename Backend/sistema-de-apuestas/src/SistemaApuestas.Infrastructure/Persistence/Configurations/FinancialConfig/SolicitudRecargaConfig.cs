using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Financial;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.FinancialConfig
{
    public class SolicitudRecargaConfig : IEntityTypeConfiguration<SolicitudRecarga>
    {
        public void Configure(EntityTypeBuilder<SolicitudRecarga> builder)
        {
            builder.ToTable("SOLICITUD_RECARGA");
            builder.HasKey(r => r.RecargaId);

            builder.Property(r => r.RecargaId)
                .HasColumnName("RECARGA_ID")
                .ValueGeneratedOnAdd();

            builder.Property(r => r.UsuarioId)
                .HasColumnName("USUARIO_ID")
                .IsRequired();

            builder.Property(r => r.Monto)
                .HasColumnName("MONTO")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(r => r.Metodo)
                .HasColumnName("METODO")
                .HasMaxLength(50);

            builder.Property(r => r.CodigoOperacion)
                .HasColumnName("CODIGO_OPERACION")
                .HasMaxLength(100);

            builder.Property(r => r.FotoVoucherUrl)
                .HasColumnName("FOTO_VOUCHER_URL")
                .HasColumnType("text");

            builder.Property(r => r.Estado)
                .HasColumnName("ESTADO")
                .HasMaxLength(20)
                .HasDefaultValue("PENDIENTE");

            builder.Property(r => r.AdminAtendiendoId)
                .HasColumnName("ADMIN_ATENDIENDO_ID");

            builder.Property(r => r.FechaEmision)
                .HasColumnName("FECHA_EMISION")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Property(r => r.FechaCierre)
                .HasColumnName("FECHA_CIERRE");
        }
    }
}
