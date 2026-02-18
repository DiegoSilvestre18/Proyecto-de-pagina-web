using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Gaming;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.GamingConfig
{
    public class MapaConfig : IEntityTypeConfiguration<Mapa>
    {
        public void Configure(EntityTypeBuilder<Mapa> builder)
        {
            builder.ToTable("MAPA");
            builder.HasKey(m => m.MapaId);

            builder.Property(m => m.MapaId)
                .HasColumnName("MAPA_ID")
                .ValueGeneratedOnAdd();

            builder.Property(m => m.Nombre)
                .HasColumnName("NOMBRE")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(m => m.ImagenUrl)
                .HasColumnName("IMAGEN_URL")
                .HasColumnType("text");

            builder.Property(m => m.Activo)
                .HasColumnName("ACTIVO")
                .HasDefaultValue(true);
        }
    }
}
