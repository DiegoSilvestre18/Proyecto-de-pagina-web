using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Gaming;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.GamingConfig
{
    public class UsuarioStatConfig : IEntityTypeConfiguration<UsuarioStat>
    {
        public void Configure(EntityTypeBuilder<UsuarioStat> builder)
        {
            builder.ToTable("USUARIO_STATS");
            builder.HasKey(u => u.UserStatId);

            builder.Property(u => u.UserStatId)
                .HasColumnName("USER_STAT_ID")
                .ValueGeneratedOnAdd();

            builder.Property(u => u.UsuarioId)
                .HasColumnName("USUARIO_ID");

            builder.Property(u => u.Juego)
                .HasColumnName("JUEGO")
                .HasMaxLength(50);

            builder.Property(u => u.EloMmr)
                .HasColumnName("ELO_MMR")
                .HasDefaultValue(0);

            builder.Property(u => u.Wins)
                .HasColumnName("WINS")
                .HasDefaultValue(0);

            builder.Property(u => u.Loses)
                .HasColumnName("LOSES")
                .HasDefaultValue(0);

            builder.Property(u => u.RangoMedalla)
                .HasColumnName("RANGO_MEDALLA")
                .HasMaxLength(50);

            // RELACIÓN: Stats pertenecen a un Usuario
            builder.HasOne(u => u.Usuario)
                .WithMany(usr => usr.UsuarioStats)
                .HasForeignKey(u => u.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
