using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Betting;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.BettingConfig
{
    public class TorneoConfig : IEntityTypeConfiguration<Torneo>
    {
        public void Configure(EntityTypeBuilder<Torneo> builder)
        {
            builder.ToTable("TORNEO");
            builder.HasKey(t => t.TorneoId);

            builder.Property(t => t.TorneoId)
                .HasColumnName("TORNEO_ID")
                .ValueGeneratedOnAdd();

            builder.Property(t => t.Nombre)
                .HasColumnName("NOMBRE")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(t => t.PremioPozo)
                .HasColumnName("PREMIO_POZO")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(t => t.CostoInscripcion)
                .HasColumnName("COSTO_INSCRIPCION")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(t => t.Estado)
                .HasColumnName("ESTADO")
                .HasMaxLength(20)
                .HasDefaultValue("REGISTRO");

            builder.Property(t => t.FechaInicio)
                .HasColumnName("FECHA_INICIO");

            builder.Property(t => t.FechaFin)
                .HasColumnName("FECHA_FIN");
        }
    }
}
