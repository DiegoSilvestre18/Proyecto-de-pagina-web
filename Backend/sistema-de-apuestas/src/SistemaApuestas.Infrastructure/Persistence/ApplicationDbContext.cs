using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Betting;
using SistemaApuestas.Domain.Entities.Financial;
using SistemaApuestas.Domain.Entities.Gaming;
using SistemaApuestas.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;

namespace SistemaApuestas.Infrastructure.Persistence
{
    internal class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // 1. Declaración de DbSets (Las tablas que C# va a manejar)
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

        // 2. Configuración con Fluent API (delegada a las clases IEntityTypeConfiguration)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
    }
}
