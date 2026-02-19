using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Audit;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.AuditConfig
{
    public class LogAccionConfig : IEntityTypeConfiguration<LogAccion>
    {
        public void Configure(EntityTypeBuilder<LogAccion> builder)
        {
            builder.ToTable("LOG_ACCIONES");
            builder.HasKey(l => l.LogId);

            builder.Property(l => l.LogId)
                .HasColumnName("LOG_ID")
                .ValueGeneratedOnAdd();

            builder.Property(l => l.UsuarioId)
                .HasColumnName("USUARIO_ID");

            builder.Property(l => l.Accion)
                .HasColumnName("ACCION")
                .HasMaxLength(50);

            builder.Property(l => l.Detalle)
                .HasColumnName("DETALLE")
                .HasColumnType("jsonb");

            builder.Property(l => l.Fecha)
                .HasColumnName("FECHA")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // RELACIÓN: Usuario que realizó la acción
            builder.HasOne(l => l.Usuario)
                .WithMany(u => u.LogAcciones)
                .HasForeignKey(l => l.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
