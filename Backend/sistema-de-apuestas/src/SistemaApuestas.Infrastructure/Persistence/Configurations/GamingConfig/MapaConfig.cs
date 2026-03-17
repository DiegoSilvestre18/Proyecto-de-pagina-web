using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Gaming;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.GamingConfig
{
    public class MapaConfig : IEntityTypeConfiguration<Mapa>
    {
        public void Configure(EntityTypeBuilder<Mapa> builder)
        {
            builder.ToTable("mapa");
            builder.HasKey(m => m.MapaId);

            builder.Property(m => m.MapaId)
                .HasColumnName("mapa_id")
                .ValueGeneratedOnAdd();

            builder.Property(m => m.Nombre)
                .HasColumnName("nombre")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(m => m.ImagenUrl)
                .HasColumnName("imagen_url")
                .HasColumnType("text");

            builder.Property(m => m.Activo)
                .HasColumnName("activo")
                .HasDefaultValue(true);
        }
    }
}
