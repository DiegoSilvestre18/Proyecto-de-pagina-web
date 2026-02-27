using SistemaApuestas.Application.DTOs.Financial.Request;
using SistemaApuestas.Application.DTOs.Financial.Response;
using SistemaApuestas.Application.Interfaces.Financial;
using SistemaApuestas.Application.Repositories.Financial;

namespace SistemaApuestas.Application.Services.Financial
{
    public class FinancialService : IFinancialService
    {
        private readonly ISolicitudRecargaRepository _recargaRepo;
        private readonly ISolicitudRetiroRepository _retiroRepo;

        public FinancialService(
            ISolicitudRecargaRepository recargaRepo,
            ISolicitudRetiroRepository retiroRepo)
        {
            _recargaRepo = recargaRepo;
            _retiroRepo = retiroRepo;
        }

        // =========================================
        // ACCIONES DEL USUARIO
        // =========================================

        public async Task<SolicitudResponseDto> SolicitarRecargaAsync(int usuarioId, SolicitudRecargaDto request)
        {
            var recarga = new Domain.Entities.Financial.SolicitudRecarga
            {
                UsuarioId = usuarioId,
                Monto = request.Monto,
                Moneda = request.Moneda,
                Metodo = request.Metodo,
                CuentaDestino = request.CuentaDestino,
                NroOperacion = request.NroOperacion,
                FechaEmision = DateTime.UtcNow
            };

            await _recargaRepo.AgregarAsync(recarga);

            return new SolicitudResponseDto
            {
                SolicitudId = recarga.RecargaId,
                Estado = recarga.Estado,
                Mensaje = "Solicitud de recarga creada correctamente."
            };
        }

        public async Task<SolicitudResponseDto> SolicitarRetiroAsync(int usuarioId, SolicitudRetiroDto request)
        {
            var retiro = new Domain.Entities.Financial.SolicitudRetiro
            {
                UsuarioId = usuarioId,
                Monto = request.Monto,
                Moneda = request.Moneda,
                Metodo = request.Metodo,
                CuentaDestino = request.CuentaDestino,
                FechaEmision = DateTime.UtcNow
            };

            await _retiroRepo.AgregarAsync(retiro);

            return new SolicitudResponseDto
            {
                SolicitudId = retiro.RetiroId,
                Estado = retiro.Estado,
                Mensaje = "Solicitud de retiro creada correctamente."
            };
        }

        // =========================================
        // ACCIONES DEL ADMIN
        // =========================================

        public async Task<IEnumerable<SolicitudPendienteAdminDto>> ObtenerSolicitudesPendientesAsync()
        {
            var recargas = await _recargaRepo.ObtenerPendientesConUsuarioAsync();
            var retiros = await _retiroRepo.ObtenerPendientesConUsuarioAsync();

            return recargas.Concat(retiros).OrderBy(s => s.FechaEmision);
        }

        public async Task<SolicitudResponseDto> TomarSolicitudAsync(int adminId, int solicitudId, string tipo)
        {
            bool tomada = tipo.ToUpper() switch
            {
                "RECARGA" => await _recargaRepo.TomarSolicitudAsync(solicitudId, adminId),
                "RETIRO" => await _retiroRepo.TomarSolicitudAsync(solicitudId, adminId),
                _ => throw new ArgumentException("Tipo de solicitud inválido. Use 'RECARGA' o 'RETIRO'.")
            };

            if (!tomada)
            {
                return new SolicitudResponseDto
                {
                    SolicitudId = solicitudId,
                    Estado = "CONFLICTO",
                    Mensaje = "Esta solicitud ya fue tomada por otro administrador."
                };
            }

            return new SolicitudResponseDto
            {
                SolicitudId = solicitudId,
                Estado = "EN_PROCESO",
                Mensaje = "Solicitud tomada correctamente. Ahora puedes procesarla."
            };
        }

        public async Task<SolicitudResponseDto> LiberarSolicitudAsync(int adminId, int solicitudId, string tipo)
        {
            bool liberada = tipo.ToUpper() switch
            {
                "RECARGA" => await _recargaRepo.LiberarSolicitudAsync(solicitudId, adminId),
                "RETIRO" => await _retiroRepo.LiberarSolicitudAsync(solicitudId, adminId),
                _ => throw new ArgumentException("Tipo de solicitud inválido. Use 'RECARGA' o 'RETIRO'.")
            };

            if (!liberada)
            {
                return new SolicitudResponseDto
                {
                    SolicitudId = solicitudId,
                    Estado = "ERROR",
                    Mensaje = "No se pudo liberar la solicitud. Verifica que sea tuya y esté EN_PROCESO."
                };
            }

            return new SolicitudResponseDto
            {
                SolicitudId = solicitudId,
                Estado = "PENDIENTE",
                Mensaje = "Solicitud liberada. Otros administradores podrán tomarla."
            };
        }

        public async Task<SolicitudResponseDto> ProcesarRecargaAsync(int adminId, ProcesarSolicitudDto request)
        {
            var recarga = await _recargaRepo.ObtenerPorIdAsync(request.SolicitudId);
            if (recarga == null)
                throw new Exception("Solicitud de recarga no encontrada.");

            if (recarga.AdminAtendiendoId != adminId)
                throw new Exception("No puedes procesar una solicitud que no has tomado.");

            if (recarga.Estado != "EN_PROCESO")
                throw new Exception("La solicitud no está en proceso.");

            recarga.Estado = request.Aprobar ? "APROBADA" : "RECHAZADA";
            recarga.NroOperacion = request.NroOperacion;
            recarga.FechaCierre = DateTime.UtcNow;

            await _recargaRepo.ActualizarAsync(recarga);

            return new SolicitudResponseDto
            {
                SolicitudId = recarga.RecargaId,
                Estado = recarga.Estado,
                Mensaje = request.Aprobar ? "Recarga aprobada." : "Recarga rechazada."
            };
        }

        public async Task<SolicitudResponseDto> ProcesarRetiroAsync(int adminId, ProcesarSolicitudDto request)
        {
            var retiro = await _retiroRepo.ObtenerPorIdAsync(request.SolicitudId);
            if (retiro == null)
                throw new Exception("Solicitud de retiro no encontrada.");

            if (retiro.AdminAtendiendoId != adminId)
                throw new Exception("No puedes procesar una solicitud que no has tomado.");

            if (retiro.Estado != "EN_PROCESO")
                throw new Exception("La solicitud no está en proceso.");

            retiro.Estado = request.Aprobar ? "APROBADA" : "RECHAZADA";
            retiro.NroOperacion = request.NroOperacion;
            retiro.FechaPago = DateTime.UtcNow;

            await _retiroRepo.ActualizarAsync(retiro);

            return new SolicitudResponseDto
            {
                SolicitudId = retiro.RetiroId,
                Estado = retiro.Estado,
                Mensaje = request.Aprobar ? "Retiro aprobado." : "Retiro rechazado."
            };
        }
    }
}
