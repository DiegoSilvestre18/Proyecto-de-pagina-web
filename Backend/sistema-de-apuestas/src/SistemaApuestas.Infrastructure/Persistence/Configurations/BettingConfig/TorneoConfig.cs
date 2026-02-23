using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Betting;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.BettingConfig
{
    public class TorneoConfig : IEntityTypeConfiguration<Torneo>
    {
        public void Configure(EntityTypeBuilder<Torneo> builder)
        {
            builder.ToTable("torneo");
            builder.HasKey(t => t.TorneoId);

            builder.Property(t => t.TorneoId)
                .HasColumnName("torneo_id")
                .ValueGeneratedOnAdd();

            builder.Property(t => t.Nombre)
                .HasColumnName("nombre")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(t => t.PremioPozo)
                .HasColumnName("premio_pozo")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(t => t.CostoInscripcion)
                .HasColumnName("costo_inscripcion")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(t => t.Estado)
                .HasColumnName("estado")
                .HasMaxLength(20)
                .HasDefaultValue("REGISTRO");

            builder.Property(t => t.FechaInicio)
                .HasColumnName("fecha_inicio");

            builder.Property(t => t.FechaFin)
                .HasColumnName("fecha_fin");
        }
    }
}
