using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Gaming;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.GamingConfig
{
    public class GameAccountConfig : IEntityTypeConfiguration<GameAccount>
    {
        public void Configure(EntityTypeBuilder<GameAccount> builder)
        {
            builder.ToTable("GAME_ACCOUNT");
            builder.HasKey(g => g.GameAccountId);

            builder.Property(g => g.GameAccountId)
                .HasColumnName("GAME_ACCOUNT_ID")
                .ValueGeneratedOnAdd();

            builder.Property(g => g.UsuarioId)
                .HasColumnName("USUARIO_ID");

            builder.Property(g => g.Juego)
                .HasColumnName("JUEGO")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(g => g.IdExterno)
                .HasColumnName("ID_EXTERNO")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(g => g.IdVisible)
                .HasColumnName("ID_VISIBLE")
                .HasMaxLength(100);

            builder.Property(g => g.RangoActual)
                .HasColumnName("RANGO_ACTUAL")
                .HasMaxLength(50);

            builder.Property(g => g.EsRangoManual)
                .HasColumnName("ES_RANGO_MANUAL")
                .HasDefaultValue(false);

            builder.Property(g => g.FechaVinculacion)
                .HasColumnName("FECHA_VINCULACION")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.HasIndex(g => new { g.UsuarioId, g.Juego })
                .IsUnique()
                .HasDatabaseName("UQ_USUARIO_JUEGO");
        }
    }
}
