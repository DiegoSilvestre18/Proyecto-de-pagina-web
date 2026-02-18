using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Identity;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.IdentityConfig
{
    public class BaneoConfig : IEntityTypeConfiguration<Baneo>
    {
        public void Configure(EntityTypeBuilder<Baneo> builder)
        {
            builder.ToTable("BANEO");
            builder.HasKey(b => b.BaneoId);

            builder.Property(b => b.BaneoId)
                .HasColumnName("BANEO_ID")
                .ValueGeneratedOnAdd();

            builder.Property(b => b.UsuarioId)
                .HasColumnName("USUARIO_ID")
                .IsRequired();

            builder.Property(b => b.AdminId)
                .HasColumnName("ADMIN_ID")
                .IsRequired();

            builder.Property(b => b.Motivo)
                .HasColumnName("MOTIVO")
                .HasColumnType("text")
                .IsRequired();

            builder.Property(b => b.Tiempo)
                .HasColumnName("TIEMPO")
                .IsRequired();

            builder.Property(b => b.FechaBaneo)
                .HasColumnName("FECHA_BANEO")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        }
    }
}
