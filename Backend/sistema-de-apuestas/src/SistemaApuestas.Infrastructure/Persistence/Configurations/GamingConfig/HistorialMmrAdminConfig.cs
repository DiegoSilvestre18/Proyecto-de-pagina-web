using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Gaming;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.GamingConfig
{
    public class HistorialMmrAdminConfig : IEntityTypeConfiguration<HistorialMmrAdmin>
    {
        public void Configure(EntityTypeBuilder<HistorialMmrAdmin> builder)
        {
            builder.ToTable("HISTORIAL_MMR_ADMIN");
            builder.HasKey(h => h.HistorialId);

            builder.Property(h => h.HistorialId)
                .HasColumnName("HISTORIAL_ID")
                .ValueGeneratedOnAdd();

            builder.Property(h => h.AdminId)
                .HasColumnName("ADMIN_ID")
                .IsRequired();

            builder.Property(h => h.UserStatId)
                .HasColumnName("USER_STAT_ID")
                .IsRequired();

            builder.Property(h => h.MmrAnterior)
                .HasColumnName("MMR_ANTERIOR")
                .IsRequired();

            builder.Property(h => h.MmrNuevo)
                .HasColumnName("MMR_NUEVO")
                .IsRequired();

            builder.Property(h => h.Motivo)
                .HasColumnName("MOTIVO")
                .HasColumnType("text")
                .IsRequired();

            builder.Property(h => h.FechaCambio)
                .HasColumnName("FECHA_CAMBIO")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // RELACIÓN: Admin que aplicó el cambio
            builder.HasOne(h => h.Admin)
                .WithMany()
                .HasForeignKey(h => h.AdminId)
                .OnDelete(DeleteBehavior.Restrict);

            // RELACIÓN: Stat afectada
            builder.HasOne(h => h.UsuarioStat)
                .WithMany(s => s.HistorialCambios)
                .HasForeignKey(h => h.UserStatId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
