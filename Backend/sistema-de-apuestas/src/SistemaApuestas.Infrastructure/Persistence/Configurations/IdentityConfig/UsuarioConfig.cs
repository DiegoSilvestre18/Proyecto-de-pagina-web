using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Identity;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.IdentityConfig
{
    public class UsuarioConfig : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.ToTable("USUARIO");
            builder.HasKey(u => u.UsuarioId);

            builder.Property(u => u.UsuarioId)
                .HasColumnName("USUARIO_ID")
                .ValueGeneratedOnAdd();

            builder.Property(u => u.ClanId)
                .HasColumnName("CLAN_ID");

            builder.Property(u => u.Username)
                .HasColumnName("USERNAME")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(u => u.Email)
                .HasColumnName("EMAIL")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(u => u.PassHash)
                .HasColumnName("PASS_HASH")
                .HasColumnType("text")
                .IsRequired();

            builder.Property(u => u.SaldoReal)
                .HasColumnName("SALDO_REAL")
                .HasPrecision(10, 2)
                .HasDefaultValue(0.00m);

            builder.Property(u => u.SaldoBono)
                .HasColumnName("SALDO_BONO")
                .HasPrecision(10, 2)
                .HasDefaultValue(0.00m);

            builder.Property(u => u.Rol)
                .HasColumnName("ROL")
                .HasMaxLength(20)
                .HasDefaultValue("USER");

            builder.Property(u => u.PartidasJugadas)
                .HasColumnName("PARTIDAS_JUGADAS")
                .HasDefaultValue(0);

            builder.Property(u => u.FechaRegistro)
                .HasColumnName("FECHA_REGISTRO")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.HasIndex(u => u.Username).IsUnique();
            builder.HasIndex(u => u.Email).IsUnique();

            // RELACIÓN: Usuario pertenece a un Clan (opcional)
            builder.HasOne(u => u.Clan)
                .WithMany(c => c.Usuarios)
                .HasForeignKey(u => u.ClanId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
