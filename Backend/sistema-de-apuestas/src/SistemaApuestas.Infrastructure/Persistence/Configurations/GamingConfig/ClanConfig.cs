using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Gaming;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.GamingConfig
{
    public class ClanConfig : IEntityTypeConfiguration<Clan>
    {
        public void Configure(EntityTypeBuilder<Clan> builder)
        {
            builder.ToTable("clan");
            builder.HasKey(c => c.ClanId);

            builder.Property(c => c.ClanId)
                .HasColumnName("clan_id")
                .ValueGeneratedOnAdd();

            builder.Property(c => c.Nombre)
                .HasColumnName("nombre")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(c => c.Descripcion)
                .HasColumnName("descripcion")
                .HasColumnType("text");

            builder.Property(c => c.ImageUrl)
                .HasColumnName("image_url")
                .HasMaxLength(255);
        }
    }
}
