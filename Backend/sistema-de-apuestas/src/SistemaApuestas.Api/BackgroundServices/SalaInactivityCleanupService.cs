using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Infrastructure.Persistence;

namespace SistemaApuestas.Api.BackgroundServices
{
    public class SalaInactivityCleanupService : BackgroundService
    {
        private static readonly TimeSpan CheckInterval = TimeSpan.FromMinutes(2);
        private static readonly TimeSpan MaxInactivity = TimeSpan.FromMinutes(10);

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<SalaInactivityCleanupService> _logger;

        public SalaInactivityCleanupService(
            IServiceScopeFactory scopeFactory,
            ILogger<SalaInactivityCleanupService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    var cutoff = DateTime.UtcNow.Subtract(MaxInactivity);

                    var deactivatedCount = await dbContext.Salas
                        .Where(s => s.Activa)
                        .Where(s => s.Estado == "ESPERANDO")
                        .Where(s => s.FechaQuedoVacia != null)
                        .Where(s => s.FechaQuedoVacia <= cutoff)
                        .Where(s => !s.Participantes.Any())
                        .ExecuteUpdateAsync(
                            setters => setters
                                .SetProperty(s => s.Activa, false)
                                .SetProperty(s => s.FechaQuedoVacia, (DateTime?)null),
                            stoppingToken);

                    if (deactivatedCount > 0)
                    {
                        _logger.LogInformation(
                            "Limpieza automática de salas inactivas: {DeactivatedCount} sala(s) desactivada(s).",
                            deactivatedCount);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error durante la limpieza automática de salas inactivas.");
                }

                await Task.Delay(CheckInterval, stoppingToken);
            }
        }
    }
}
