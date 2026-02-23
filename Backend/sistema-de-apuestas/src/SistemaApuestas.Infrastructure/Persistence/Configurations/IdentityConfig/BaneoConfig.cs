using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Identity;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.IdentityConfig
{
    public class BaneoConfig : IEntityTypeConfiguration<Baneo>
    {
        public void Configure(EntityTypeBuilder<Baneo> builder)
        {
            builder.ToTable("baneo");
            builder.HasKey(b => b.BaneoId);

            builder.Property(b => b.BaneoId)
                .HasColumnName("baneo_id")
                .ValueGeneratedOnAdd();

            builder.Property(b => b.UsuarioId)
                .HasColumnName("usuario_id")
                .IsRequired();

            builder.Property(b => b.AdminId)
                .HasColumnName("admin_id")
                .IsRequired();

            builder.Property(b => b.Motivo)
                .HasColumnName("motivo")
                .HasColumnType("text")
                .IsRequired();

            builder.Property(b => b.Tiempo)
                .HasColumnName("tiempo")
                .IsRequired();

            builder.Property(b => b.FechaBaneo)
                .HasColumnName("fecha_baneo")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // RELACIÓN: Usuario castigado
            builder.HasOne(b => b.Usuario)
                .WithMany(u => u.BaneosRecibidos)
                .HasForeignKey(b => b.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // RELACIÓN: Admin que castiga (misma tabla USUARIO, distinta FK)
            builder.HasOne(b => b.Admin)
                .WithMany(u => u.BaneosAplicados)
                .HasForeignKey(b => b.AdminId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
