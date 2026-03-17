using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Gaming;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.GamingConfig
{
    public class GameAccountConfig : IEntityTypeConfiguration<GameAccount>
    {
        public void Configure(EntityTypeBuilder<GameAccount> builder)
        {
            builder.ToTable("game_account");
            builder.HasKey(g => g.GameAccountId);

            builder.Property(g => g.GameAccountId)
                .HasColumnName("game_account_id")
                .ValueGeneratedOnAdd();

            builder.Property(g => g.UsuarioId)
                .HasColumnName("usuario_id");

            builder.Property(g => g.Juego)
                .HasColumnName("juego")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(g => g.IdExterno)
                .HasColumnName("id_externo")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(g => g.IdVisible)
                .HasColumnName("id_visible")
                .HasMaxLength(100);

            builder.Property(g => g.RangoActual)
                .HasColumnName("rango_actual")
                .HasMaxLength(50);

            builder.Property(g => g.EsRangoManual)
                .HasColumnName("es_rango_manual")
                .HasDefaultValue(false);

            builder.Property(g => g.FechaVinculacion)
                .HasColumnName("fecha_vinculacion")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.HasIndex(g => new { g.UsuarioId, g.Juego })
                .IsUnique()
                .HasDatabaseName("uq_usuario_juego");

            // RELACIÓN: Cuenta pertenece a un Usuario
            builder.HasOne(g => g.Usuario)
                .WithMany(u => u.GameAccounts)
                .HasForeignKey(g => g.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
