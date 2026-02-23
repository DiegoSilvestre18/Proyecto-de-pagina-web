using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Gaming;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.GamingConfig
{
    public class HistorialMmrAdminConfig : IEntityTypeConfiguration<HistorialMmrAdmin>
    {
        public void Configure(EntityTypeBuilder<HistorialMmrAdmin> builder)
        {
            builder.ToTable("historial_mmr_admin");
            builder.HasKey(h => h.HistorialId);

            builder.Property(h => h.HistorialId)
                .HasColumnName("historial_id")
                .ValueGeneratedOnAdd();

            builder.Property(h => h.AdminId)
                .HasColumnName("admin_id")
                .IsRequired();

            builder.Property(h => h.UserStatId)
                .HasColumnName("user_stat_id")
                .IsRequired();

            builder.Property(h => h.MmrAnterior)
                .HasColumnName("mmr_anterior")
                .IsRequired();

            builder.Property(h => h.MmrNuevo)
                .HasColumnName("mmr_nuevo")
                .IsRequired();

            builder.Property(h => h.Motivo)
                .HasColumnName("motivo")
                .HasColumnType("text")
                .IsRequired();

            builder.Property(h => h.FechaCambio)
                .HasColumnName("fecha_cambio")
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
