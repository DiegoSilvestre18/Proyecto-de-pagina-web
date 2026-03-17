using Microsoft.AspNetCore.SignalR;
// (O el namespace que le hayas puesto a SalaHub)

namespace SistemaApuestas.Application.Hubs
{
    // Esta clase es el megáfono que le gritará a React
    public class SalaHub : Hub
    {
        // Los usuarios se unen a una "frecuencia de radio" con el ID de la sala
        public async Task UnirseASala(string salaId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, salaId);
        }

        public async Task SalirDeSala(string salaId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, salaId);
        }
    }
}