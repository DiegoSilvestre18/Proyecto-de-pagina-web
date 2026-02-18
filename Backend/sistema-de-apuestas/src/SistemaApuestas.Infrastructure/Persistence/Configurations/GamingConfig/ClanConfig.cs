using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Gaming;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.GamingConfig
{
    public class ClanConfig : IEntityTypeConfiguration<Clan>
    {
        public void Configure(EntityTypeBuilder<Clan> builder)
        {
            builder.ToTable("CLAN");
            builder.HasKey(c => c.ClanId);

            builder.Property(c => c.ClanId)
                .HasColumnName("CLAN_ID")
                .ValueGeneratedOnAdd();

            builder.Property(c => c.Nombre)
                .HasColumnName("NOMBRE")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(c => c.Descripcion)
                .HasColumnName("DESCRIPCION")
                .HasColumnType("text");

            builder.Property(c => c.ImageUrl)
                .HasColumnName("IMAGE_URL")
                .HasMaxLength(255);
        }
    }
}
