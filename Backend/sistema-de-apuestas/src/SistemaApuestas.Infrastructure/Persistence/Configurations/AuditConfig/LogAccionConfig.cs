using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Audit;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.AuditConfig
{
    public class LogAccionConfig : IEntityTypeConfiguration<LogAccion>
    {
        public void Configure(EntityTypeBuilder<LogAccion> builder)
        {
            builder.ToTable("log_acciones");
            builder.HasKey(l => l.LogId);

            builder.Property(l => l.LogId)
                .HasColumnName("log_id")
                .ValueGeneratedOnAdd();

            builder.Property(l => l.UsuarioId)
                .HasColumnName("usuario_id");

            builder.Property(l => l.Accion)
                .HasColumnName("accion")
                .HasMaxLength(50);

            builder.Property(l => l.Detalle)
                .HasColumnName("detalle")
                .HasColumnType("jsonb");

            builder.Property(l => l.Fecha)
                .HasColumnName("fecha")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // RELACIÓN: Usuario que realizó la acción
            builder.HasOne(l => l.Usuario)
                .WithMany(u => u.LogAcciones)
                .HasForeignKey(l => l.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
