using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Infrastructure.Persistence;

namespace SistemaApuestas.Api.BackgroundServices
{
    public class SalaInactivityCleanupService : BackgroundService
    {
        private static readonly TimeSpan CheckInterval = TimeSpan.FromMinutes(1);
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

                    var deletedCount = await dbContext.Salas
                        .Where(s => s.Estado == "ESPERANDO")
                        .Where(s => s.FechaCreacion <= cutoff)
                        .Where(s => !s.Participantes.Any())
                        .ExecuteDeleteAsync(stoppingToken);

                    if (deletedCount > 0)
                    {
                        _logger.LogInformation(
                            "Limpieza automática de salas inactivas: {DeletedCount} sala(s) eliminada(s).",
                            deletedCount);
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
