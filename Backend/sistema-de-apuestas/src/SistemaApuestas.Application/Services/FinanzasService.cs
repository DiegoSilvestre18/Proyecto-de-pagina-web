using SistemaApuestas.Application.DTOs.Finanzas;
using SistemaApuestas.Application.Interfaces;
using SistemaApuestas.Application.Interfaces.Finanzas;
using SistemaApuestas.Domain.Entities.Audit;
using SistemaApuestas.Domain.Entities.Financial;

namespace SistemaApuestas.Application.Services
{
    public class FinanzasService : IFinanzasService
    {
        private readonly IFinanzasRepository _repository;

        public FinanzasService(IFinanzasRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> RecargarSaldoFisicoAsync(int adminId, RecargaAdminDto request)
        {
            var usuarioDestino = await _repository.ObtenerUsuarioPorIdAsync(request.UsuarioDestinoId);
            if (usuarioDestino == null) throw new Exception("Usuario no encontrado.");

            bool esBono = request.TipoSaldo.ToUpper() == "BONO";

            if (esBono) usuarioDestino.SaldoBono += request.Monto;
            else usuarioDestino.SaldoReal += request.Monto;

            var recarga = new SolicitudRecarga
            {
                UsuarioId = usuarioDestino.UsuarioId,
                Monto = request.Monto,
                Metodo = request.MetodoPago,
                CodigoOperacion = request.CodigoOperacion,
                Estado = "COMPLETADA",
                AdminAtendiendoId = adminId,
                FechaEmision = DateTime.UtcNow,
                FechaCierre = DateTime.UtcNow
            };

            await _repository.AgregarSolicitudRecargaAsync(recarga);
            await _repository.GuardarCambiosAsync();

            var movimiento = new Movimiento
            {
                UsuarioId = usuarioDestino.UsuarioId,
                RecargaId = recarga.RecargaId,
                Tipo = "INGRESO",
                MontoReal = esBono ? 0 : request.Monto,
                MontoBono = esBono ? request.Monto : 0,
                Concepto = $"Recarga por WhatsApp aprobada por Admin {adminId}",
                Fecha = DateTime.UtcNow
            };

            await _repository.AgregarMovimientoAsync(movimiento);
            await _repository.GuardarCambiosAsync();

            return $"Se ha recargado S/ {request.Monto} ({request.TipoSaldo.ToUpper()}) a {usuarioDestino.Username} exitosamente.";
        }

        public async Task<string> SolicitarRetiroAsync(int usuarioId, RetiroSolicitudDto request)
        {
            if (request.Monto < 20) throw new Exception("El retiro mínimo es de S/ 20.00");

            var usuario = await _repository.ObtenerUsuarioPorIdAsync(usuarioId);
            if (usuario == null) throw new Exception("Usuario no encontrado.");

            if (usuario.SaldoReal < request.Monto) throw new Exception("No tienes saldo suficiente para este retiro.");

            var retirosPendientes = await _repository.SumarRetirosPendientesAsync(usuarioId);
            if ((usuario.SaldoReal - retirosPendientes) < request.Monto)
                throw new Exception("Tienes retiros en proceso que comprometen tu saldo actual. Espera a que se aprueben.");

            var solicitud = new SolicitudRetiro
            {
                UsuarioId = usuarioId,
                Monto = request.Monto,
                CuentaDestino = request.CuentaDestino,
                Estado = "PENDIENTE",
                FechaEmision = DateTime.UtcNow
            };

            await _repository.AgregarSolicitudRetiroAsync(solicitud);
            await _repository.GuardarCambiosAsync();

            return "Solicitud de retiro enviada. Un administrador te contactará.";
        }

        public async Task<string> TomarRetiroAsync(int adminId, int retiroId)
        {
            var solicitud = await _repository.ObtenerRetiroConUsuarioAsync(retiroId);
            if (solicitud == null) throw new Exception("Solicitud no encontrada.");

            if (solicitud.Estado != "PENDIENTE")
                throw new Exception("Esta solicitud ya está siendo atendida por otro administrador o ya fue cerrada.");

            solicitud.Estado = "EN_PROCESO";
            solicitud.AdminAtendiendoId = adminId;

            await _repository.GuardarCambiosAsync();

            return $"Has bloqueado la solicitud. Ahora descuenta el saldo y comunícate con {solicitud.Usuario!.Username}.";
        }

        public async Task<string> CompletarRetiroAsync(int adminId, int retiroId)
        {
            var solicitud = await _repository.ObtenerRetiroConUsuarioAsync(retiroId);
            if (solicitud == null) throw new Exception("Solicitud no encontrada.");

            if (solicitud.Estado != "EN_PROCESO" || solicitud.AdminAtendiendoId != adminId)
                throw new Exception("No puedes completar esta solicitud porque no la tienes asignada o ya fue pagada.");

            solicitud.Usuario!.SaldoReal -= solicitud.Monto;
            solicitud.Estado = "COMPLETADO";
            solicitud.FechaPago = DateTime.UtcNow;

            var movimiento = new Movimiento
            {
                UsuarioId = solicitud.UsuarioId,
                RetiroId = solicitud.RetiroId,
                Tipo = "EGRESO",
                MontoReal = solicitud.Monto,
                MontoBono = 0,
                Concepto = $"Retiro procesado a la cuenta {solicitud.CuentaDestino}",
                Fecha = DateTime.UtcNow
            };

            await _repository.AgregarMovimientoAsync(movimiento);
            await _repository.GuardarCambiosAsync();

            return "Retiro completado y saldo descontado del jugador exitosamente.";
        }
    }
}