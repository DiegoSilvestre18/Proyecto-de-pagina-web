using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Identity;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.IdentityConfig
{
    public class UsuarioConfig : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.ToTable("usuario");
            builder.HasKey(u => u.UsuarioId);

            builder.Property(u => u.UsuarioId)
                .HasColumnName("usuario_id")
                .ValueGeneratedOnAdd();

            builder.Property(u => u.ClanId)
                .HasColumnName("clan_id");

            builder.Property(u => u.Username)
                .HasColumnName("username")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(u => u.Email)
                .HasColumnName("email")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(u => u.PassHash)
                .HasColumnName("pass_hash")
                .HasColumnType("text")
                .IsRequired();

            builder.Property(u => u.SaldoReal)
                .HasColumnName("saldo_real")
                .HasPrecision(10, 2)
                .HasDefaultValue(0.00m);

            builder.Property(u => u.SaldoBono)
                .HasColumnName("saldo_bono")
                .HasPrecision(10, 2)
                .HasDefaultValue(0.00m);

            builder.Property(u => u.Rol)
                .HasColumnName("rol")
                .HasMaxLength(20)
                .HasDefaultValue("USER");

            builder.Property(u => u.PartidasJugadas)
                .HasColumnName("partidas_jugadas")
                .HasDefaultValue(0);

            builder.Property(u => u.FechaRegistro)
                .HasColumnName("fecha_registro")
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
