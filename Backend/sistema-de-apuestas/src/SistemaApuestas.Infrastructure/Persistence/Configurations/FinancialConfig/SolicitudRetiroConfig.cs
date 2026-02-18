using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Financial;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.FinancialConfig
{
    public class SolicitudRetiroConfig : IEntityTypeConfiguration<SolicitudRetiro>
    {
        public void Configure(EntityTypeBuilder<SolicitudRetiro> builder)
        {
            builder.ToTable("SOLICITUD_RETIRO");
            builder.HasKey(r => r.RetiroId);

            builder.Property(r => r.RetiroId)
                .HasColumnName("RETIRO_ID")
                .ValueGeneratedOnAdd();

            builder.Property(r => r.UsuarioId)
                .HasColumnName("USUARIO_ID")
                .IsRequired();

            builder.Property(r => r.Monto)
                .HasColumnName("MONTO")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(r => r.CuentaDestino)
                .HasColumnName("CUENTA_DESTINO")
                .HasColumnType("text")
                .IsRequired();

            builder.Property(r => r.Estado)
                .HasColumnName("ESTADO")
                .HasMaxLength(20)
                .HasDefaultValue("PENDIENTE");

            builder.Property(r => r.AdminAtendiendoId)
                .HasColumnName("ADMIN_ATENDIENDO_ID");

            builder.Property(r => r.FotoConstanciaPago)
                .HasColumnName("FOTO_CONSTANCIA_PAGO")
                .HasColumnType("text");

            builder.Property(r => r.FechaEmision)
                .HasColumnName("FECHA_EMISION")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Property(r => r.FechaPago)
                .HasColumnName("FECHA_PAGO");
        }
    }
}
