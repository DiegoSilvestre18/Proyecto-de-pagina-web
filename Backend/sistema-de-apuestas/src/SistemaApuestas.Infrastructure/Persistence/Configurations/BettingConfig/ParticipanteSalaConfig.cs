using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Betting;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.BettingConfig
{
    public class ParticipanteSalaConfig : IEntityTypeConfiguration<ParticipanteSala>
    {
        public void Configure(EntityTypeBuilder<ParticipanteSala> builder)
        {
            builder.ToTable("PARTICIPANTE_SALA");
            builder.HasKey(p => p.ParticipacionId);

            builder.Property(p => p.ParticipacionId)
                .HasColumnName("PARTICIPACION_ID")
                .ValueGeneratedOnAdd();

            builder.Property(p => p.SalaId)
                .HasColumnName("SALA_ID")
                .IsRequired();

            builder.Property(p => p.UsuarioId)
                .HasColumnName("USUARIO_ID")
                .IsRequired();

            builder.Property(p => p.GameAccountId)
                .HasColumnName("GAME_ACCOUNT_ID")
                .IsRequired();

            builder.Property(p => p.Equipo)
                .HasColumnName("EQUIPO")
                .HasMaxLength(10)
                .IsRequired();

            builder.Property(p => p.EsCapitan)
                .HasColumnName("ES_CAPITAN")
                .HasDefaultValue(false);

            builder.Property(p => p.SlotIndex)
                .HasColumnName("SLOT_INDEX");

            builder.Property(p => p.PagoConBono)
                .HasColumnName("PAGO_CON_BONO")
                .HasPrecision(10, 2)
                .HasDefaultValue(0m);

            builder.Property(p => p.PagoConReal)
                .HasColumnName("PAGO_CON_REAL")
                .HasPrecision(10, 2)
                .HasDefaultValue(0m);

            builder.HasIndex(p => new { p.SalaId, p.SlotIndex })
                .IsUnique()
                .HasDatabaseName("UQ_SALA_SLOT");
        }
    }
}
