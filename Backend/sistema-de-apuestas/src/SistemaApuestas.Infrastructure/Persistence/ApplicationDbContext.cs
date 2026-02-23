using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Betting;
using SistemaApuestas.Domain.Entities.Financial;
using SistemaApuestas.Domain.Entities.Gaming;
using SistemaApuestas.Domain.Entities.Identity;

namespace SistemaApuestas.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Declaración de DbSets (Las tablas que C# va a manejar)
        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<Clan> Clanes => Set<Clan>();
        public DbSet<GameAccount> GameAccounts => Set<GameAccount>();
        public DbSet<UsuarioStat> UsuarioStats => Set<UsuarioStat>();
        public DbSet<HistorialMmrAdmin> HistorialMmrAdmin => Set<HistorialMmrAdmin>();
        public DbSet<Mapa> Mapas => Set<Mapa>();
        public DbSet<Torneo> Torneos => Set<Torneo>();
        public DbSet<Sala> Salas => Set<Sala>();
        public DbSet<ParticipanteSala> ParticipanteSalas => Set<ParticipanteSala>();
        public DbSet<SolicitudRecarga> SolicitudesRecarga => Set<SolicitudRecarga>();
        public DbSet<SolicitudRetiro> SolicitudesRetiro => Set<SolicitudRetiro>();
        public DbSet<Movimiento> Movimientos => Set<Movimiento>();
        public DbSet<Baneo> Baneos => Set<Baneo>();
        public DbSet<LogAccion> LogAcciones => Set<LogAccion>();

        // Configuración para que lea las configuraciones de las entidades desde la carpeta "Configurations"
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var utcConverter = new ValueConverter<DateTime, DateTime>(
                toDb => toDb.Kind == DateTimeKind.Utc ? toDb : toDb.ToUniversalTime(),
                fromDb => DateTime.SpecifyKind(fromDb, DateTimeKind.Utc)
            );

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(utcConverter);
                    }
                }
            }

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
    }
}
