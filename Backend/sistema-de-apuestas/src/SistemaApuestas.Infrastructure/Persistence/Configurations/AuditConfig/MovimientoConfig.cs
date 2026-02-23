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
            builder.ToTable("movimientos");
            builder.HasKey(m => m.MovimientoId);

            builder.Property(m => m.MovimientoId)
                .HasColumnName("movimiento_id")
                .ValueGeneratedOnAdd();

            builder.Property(m => m.UsuarioId)
                .HasColumnName("usuario_id")
                .IsRequired();

            builder.Property(m => m.RecargaId)
                .HasColumnName("recarga_id");

            builder.Property(m => m.RetiroId)
                .HasColumnName("retiro_id");

            builder.Property(m => m.SalaId)
                .HasColumnName("sala_id");

            builder.Property(m => m.Tipo)
                .HasColumnName("tipo")
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(m => m.MontoReal)
                .HasColumnName("monto_real")
                .HasPrecision(10, 2)
                .HasDefaultValue(0.00m)
                .IsRequired();

            builder.Property(m => m.MontoBono)
                .HasColumnName("monto_bono")
                .HasPrecision(10, 2)
                .HasDefaultValue(0.00m)
                .IsRequired();

            builder.Property(m => m.Concepto)
                .HasColumnName("concepto")
                .HasColumnType("text")
                .IsRequired();

            builder.Property(m => m.Fecha)
                .HasColumnName("fecha")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.HasCheckConstraint("chk_movimiento_origen",
                "(recarga_id IS NOT NULL AND sala_id IS NULL AND retiro_id IS NULL) OR " +
                "(recarga_id IS NULL AND sala_id IS NOT NULL AND retiro_id IS NULL) OR " +
                "(recarga_id IS NULL AND sala_id IS NULL AND retiro_id IS NOT NULL)");

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
