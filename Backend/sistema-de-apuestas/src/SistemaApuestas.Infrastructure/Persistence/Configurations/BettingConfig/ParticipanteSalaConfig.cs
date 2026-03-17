using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Betting;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.BettingConfig
{
    public class ParticipanteSalaConfig : IEntityTypeConfiguration<ParticipanteSala>
    {
        public void Configure(EntityTypeBuilder<ParticipanteSala> builder)
        {
            builder.ToTable("participante_sala");
            builder.HasKey(p => p.ParticipacionId);

            builder.Property(p => p.ParticipacionId)
                .HasColumnName("participacion_id")
                .ValueGeneratedOnAdd();

            builder.Property(p => p.SalaId)
                .HasColumnName("sala_id")
                .IsRequired();

            builder.Property(p => p.UsuarioId)
                .HasColumnName("usuario_id")
                .IsRequired();

            builder.Property(p => p.GameAccountId)
                .HasColumnName("game_account_id")
                .IsRequired();

            builder.Property(p => p.Equipo)
                .HasColumnName("equipo")
                .HasMaxLength(10)
                .IsRequired();

            builder.Property(p => p.EsCapitan)
                .HasColumnName("es_capitan")
                .HasDefaultValue(false);

            builder.Property(p => p.SlotIndex)
                .HasColumnName("slot_index");

            builder.Property(p => p.PagoConBono)
                .HasColumnName("pago_con_bono")
                .HasPrecision(10, 2)
                .HasDefaultValue(0m);

            builder.Property(p => p.PagoConReal)
                .HasColumnName("pago_con_real")
                .HasPrecision(10, 2)
                .HasDefaultValue(0m);

            builder.HasIndex(p => new { p.SalaId, p.SlotIndex })
                .IsUnique()
                .HasDatabaseName("uq_sala_slot");

            // RELACIÓN: Participante en una Sala
            builder.HasOne(p => p.Sala)
                .WithMany(s => s.Participantes)
                .HasForeignKey(p => p.SalaId)
                .OnDelete(DeleteBehavior.Cascade);

            // RELACIÓN: Usuario que participa
            builder.HasOne(p => p.Usuario)
                .WithMany(u => u.Participaciones)
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // RELACIÓN: Cuenta de juego usada
            builder.HasOne(p => p.GameAccount)
                .WithMany(g => g.Participaciones)
                .HasForeignKey(p => p.GameAccountId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
