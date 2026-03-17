using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Gaming;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.GamingConfig
{
    public class UsuarioStatConfig : IEntityTypeConfiguration<UsuarioStat>
    {
        public void Configure(EntityTypeBuilder<UsuarioStat> builder)
        {
            builder.ToTable("usuario_stats");
            builder.HasKey(u => u.UserStatId);

            builder.Property(u => u.UserStatId)
                .HasColumnName("user_stat_id")
                .ValueGeneratedOnAdd();

            builder.Property(u => u.UsuarioId)
                .HasColumnName("usuario_id");

            builder.Property(u => u.Juego)
                .HasColumnName("juego")
                .HasMaxLength(50);

            builder.Property(u => u.EloMmr)
                .HasColumnName("elo_mmr")
                .HasDefaultValue(0);

            builder.Property(u => u.Wins)
                .HasColumnName("wins")
                .HasDefaultValue(0);

            builder.Property(u => u.Loses)
                .HasColumnName("loses")
                .HasDefaultValue(0);

            builder.Property(u => u.RangoMedalla)
                .HasColumnName("rango_medalla")
                .HasMaxLength(50);

            // RELACIÓN: Stats pertenecen a un Usuario
            builder.HasOne(u => u.Usuario)
                .WithMany(usr => usr.UsuarioStats)
                .HasForeignKey(u => u.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
