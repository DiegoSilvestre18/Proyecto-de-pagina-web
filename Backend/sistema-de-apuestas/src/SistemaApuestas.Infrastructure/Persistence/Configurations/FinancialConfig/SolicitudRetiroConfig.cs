using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Financial;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.FinancialConfig
{
    public class SolicitudRetiroConfig : IEntityTypeConfiguration<SolicitudRetiro>
    {
        public void Configure(EntityTypeBuilder<SolicitudRetiro> builder)
        {
            builder.ToTable("solicitud_retiro");
            builder.HasKey(r => r.RetiroId);

            builder.Property(r => r.RetiroId)
                .HasColumnName("retiro_id")
                .ValueGeneratedOnAdd();

            builder.Property(r => r.UsuarioId)
                .HasColumnName("usuario_id")
                .IsRequired();

            builder.Property(r => r.Monto)
                .HasColumnName("monto")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(r => r.Moneda)
                .HasColumnName("moneda")
                .HasMaxLength(10)
                .HasDefaultValue("PEN");

            builder.Property(r => r.Metodo)
                .HasColumnName("metodo")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(r => r.CuentaDestino)
                .HasColumnName("cuenta_destino")
                .HasColumnType("text")
                .IsRequired();

            builder.Property(r => r.NroOperacion)
                .HasColumnName("nro_operacion")
                .HasMaxLength(100);

            builder.Property(r => r.Estado)
                .HasColumnName("estado")
                .HasMaxLength(20)
                .HasDefaultValue("PENDIENTE");

            builder.Property(r => r.AdminAtendiendoId)
                .HasColumnName("admin_atendiendo_id");

            builder.Property(r => r.FechaEmision)
                .HasColumnName("fecha_emision")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Property(r => r.FechaPago)
                .HasColumnName("fecha_pago");

            // RELACIÓN: Usuario que solicita
            builder.HasOne(r => r.Usuario)
                .WithMany(u => u.SolicitudesRetiro)
                .HasForeignKey(r => r.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // RELACIÓN: Admin que atiende (opcional)
            builder.HasOne(r => r.AdminAtendiendo)
                .WithMany()
                .HasForeignKey(r => r.AdminAtendiendoId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
