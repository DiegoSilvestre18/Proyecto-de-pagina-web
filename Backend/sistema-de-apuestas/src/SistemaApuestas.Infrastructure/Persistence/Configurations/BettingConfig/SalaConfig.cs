using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaApuestas.Domain.Entities.Betting;

namespace SistemaApuestas.Infrastructure.Persistence.Configurations.BettingConfig
{
    public class SalaConfig : IEntityTypeConfiguration<Sala>
    {
        public void Configure(EntityTypeBuilder<Sala> builder)
        {
            builder.ToTable("sala");
            builder.HasKey(s => s.SalaId);

            builder.Property(s => s.SalaId)
                .HasColumnName("sala_id")
                .ValueGeneratedOnAdd();

            builder.Property(s => s.CreadorId)
                .HasColumnName("creador_id")
                .IsRequired();

            builder.Property(s => s.TorneoId)
                .HasColumnName("torneo_id");

            builder.Property(s => s.Nombre)
                .HasColumnName("nombre")
                .HasMaxLength(100);

            builder.Property(s => s.TipoSala)
                .HasColumnName("tipo_sala")
                .HasMaxLength(50)
                .HasDefaultValue("BASICA");

            builder.Property(s => s.Juego)
                .HasColumnName("juego")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(s => s.CostoEntrada)
                .HasColumnName("costo_entrada")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(s => s.PremioARepartir)
                .HasColumnName("premio_a_repartir")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(s => s.GananciaPlataforma)
                .HasColumnName("ganancia_plataforma")
                .HasPrecision(10, 2)
                .IsRequired();

            builder.Property(s => s.Estado)
                .HasColumnName("estado")
                .HasMaxLength(20)
                .HasDefaultValue("ESPERANDO");

            builder.Property(s => s.MapaElegidoId)
                .HasColumnName("mapa_elegido_id");

            builder.Property(s => s.VetoLog)
                .HasColumnName("veto_log")
                .HasColumnType("jsonb");

            builder.Property(s => s.ResultadoGanador)
                .HasColumnName("resultado_ganador")
                .HasMaxLength(20);

            builder.Property(s => s.FechaCreacion)
                .HasColumnName("fecha_creacion")
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
