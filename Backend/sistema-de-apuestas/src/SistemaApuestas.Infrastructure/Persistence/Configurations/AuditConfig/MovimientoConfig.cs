using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Audit;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.AuditConfig
{
    public class MovimientoConfig : IEntityTypeConfiguration<Movimiento>
    {
        public void Configure(EntityTypeBuilder<Movimiento> builder)
        {
            // Configuración de la tabla y las columnas
            builder.ToTable("MOVIMIENTOS");
            builder.HasKey(m => m.MovimientoId);

            builder.Property(m => m.MovimientoId)
                .HasColumnName("MOVIMIENTO_ID")
                .ValueGeneratedOnAdd();

            builder.Property(m => m.UsuarioId)
                .HasColumnName("USUARIO_ID")
                .IsRequired();

            builder.Property(m => m.RecargaId)
                .HasColumnName("RECARGA_ID");

            builder.Property(m => m.RetiroId)
                .HasColumnName("RETIRO_ID");

            builder.Property(m => m.SalaId)
                .HasColumnName("SALA_ID");

            builder.Property(m => m.Tipo)
                .HasColumnName("TIPO")
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(m => m.MontoReal)
                .HasColumnName("MONTO_REAL")
                .HasPrecision(10, 2)
                .HasDefaultValue(0.00m)
                .IsRequired();

            builder.Property(m => m.MontoBono)
                .HasColumnName("MONTO_BONO")
                .HasPrecision(10, 2)
                .HasDefaultValue(0.00m)
                .IsRequired();

            builder.Property(m => m.Concepto)
                .HasColumnName("CONCEPTO")
                .HasColumnType("text")
                .IsRequired();

            builder.Property(m => m.Fecha)
                .HasColumnName("FECHA")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Agregar restricción para asegurar que solo una de las columnas de origen tenga valor
            builder.HasCheckConstraint("CHK_MOVIMIENTO_ORIGEN",
                "(RECARGA_ID IS NOT NULL AND SALA_ID IS NULL AND RETIRO_ID IS NULL) OR " +
                "(RECARGA_ID IS NULL AND SALA_ID IS NOT NULL AND RETIRO_ID IS NULL) OR " +
                "(RECARGA_ID IS NULL AND SALA_ID IS NULL AND RETIRO_ID IS NOT NULL)");

            // RELACIÓN: Usuario que genera el movimiento
            builder.HasOne(m => m.Usuario)
                .WithMany(u => u.Movimientos)
                .HasForeignKey(m => m.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // RELACIÓN: Origen Recarga (opcional)
            builder.HasOne(m => m.Recarga)
                .WithMany(r => r.Movimientos)
                .HasForeignKey(m => m.RecargaId)
                .OnDelete(DeleteBehavior.SetNull);

            // RELACIÓN: Origen Retiro (opcional)
            builder.HasOne(m => m.Retiro)
                .WithMany(r => r.Movimientos)
                .HasForeignKey(m => m.RetiroId)
                .OnDelete(DeleteBehavior.SetNull);

            // RELACIÓN: Origen Sala (opcional)
            builder.HasOne(m => m.Sala)
                .WithMany(s => s.Movimientos)
                .HasForeignKey(m => m.SalaId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
