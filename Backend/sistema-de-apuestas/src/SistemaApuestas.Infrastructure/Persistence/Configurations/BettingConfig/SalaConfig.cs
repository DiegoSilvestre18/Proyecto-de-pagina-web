using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Betting;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.BettingConfig
{
    public class SalaConfig : IEntityTypeConfiguration<Sala>
    {
        public void Configure(EntityTypeBuilder<Sala> builder)
        {
            builder.ToTable("SALA");
            builder.HasKey(s => s.SalaId);

            builder.Property(s => s.SalaId)
                .HasColumnName("SALA_ID")
                .ValueGeneratedOnAdd();

            builder.Property(s => s.CreadorId)
                .HasColumnName("CREADOR_ID")
                .IsRequired();

            builder.Property(s => s.TorneoId)
                .HasColumnName("TORNEO_ID");

            builder.Property(s => s.Nombre)
                .HasColumnName("NOMBRE")
                .HasMaxLength(100);

            builder.Property(s => s.TipoSala)
                .HasColumnName("TIPO_SALA")
                .HasMaxLength(50)
                .HasDefaultValue("BASICA");

            builder.Property(s => s.Juego)
                .HasColumnName("JUEGO")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(s => s.CostoEntrada)
                .HasColumnName("COSTO_ENTRADA")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(s => s.PremioARepartir)
                .HasColumnName("PREMIO_A_REPARTIR")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(s => s.GananciaPlataforma)
                .HasColumnName("GANANCIA_PLATAFORMA")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(s => s.Estado)
                .HasColumnName("ESTADO")
                .HasMaxLength(20)
                .HasDefaultValue("ESPERANDO");

            builder.Property(s => s.MapaElegidoId)
                .HasColumnName("MAPA_ELEGIDO_ID");

            builder.Property(s => s.VetoLog)
                .HasColumnName("VETO_LOG")
                .HasColumnType("jsonb");

            builder.Property(s => s.ResultadoGanador)
                .HasColumnName("RESULTADO_GANADOR")
                .HasMaxLength(20);

            builder.Property(s => s.FechaCreacion)
                .HasColumnName("FECHA_CREACION")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // RELACIÓN: Creador de la sala
            builder.HasOne(s => s.Creador)
                .WithMany(u => u.SalasCreadas)
                .HasForeignKey(s => s.CreadorId)
                .OnDelete(DeleteBehavior.Restrict);

            // RELACIÓN: Torneo (opcional)
            builder.HasOne(s => s.Torneo)
                .WithMany(t => t.Salas)
                .HasForeignKey(s => s.TorneoId)
                .OnDelete(DeleteBehavior.SetNull);

            // RELACIÓN: Mapa elegido (opcional)
            builder.HasOne(s => s.MapaElegido)
                .WithMany(m => m.Salas)
                .HasForeignKey(s => s.MapaElegidoId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
