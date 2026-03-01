using SistemaApuestas.Application.DTOs.Financial.Request;
using SistemaApuestas.Application.DTOs.Financial.Response;
using SistemaApuestas.Application.DTOs.Audit;
using SistemaApuestas.Application.Interfaces.Audit;
using SistemaApuestas.Application.Interfaces.Financial;
using SistemaApuestas.Application.Repositories.Financial;
using SistemaApuestas.Application.Repositories.Identity;

namespace SistemaApuestas.Application.Services.Financial
{
    public class FinancialService : IFinancialService
    {
        private readonly ISolicitudRecargaRepository _recargaRepo;
        private readonly ISolicitudRetiroRepository _retiroRepo;
        private readonly IUsuarioRepository _usuarioRepo;
        private readonly IAuditService _auditRepo;

        public FinancialService(
            ISolicitudRecargaRepository recargaRepo,
            ISolicitudRetiroRepository retiroRepo,
            IUsuarioRepository usuarioRepo,
            IAuditService auditRepo)
        {
            _recargaRepo = recargaRepo;
            _retiroRepo = retiroRepo;
            _usuarioRepo = usuarioRepo;
            _auditRepo = auditRepo;
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
                CuentaDestino = null,
                Estado = "PENDIENTE",
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
            if (request.Monto < 20)
                throw new Exception("El retiro mínimo es de S/ 20.00");

            var usuario = await _usuarioRepo.ObtenerPorIdAsync(usuarioId);
            if (usuario == null)
                throw new Exception("Usuario no encontrado.");

            if (usuario.SaldoReal < request.Monto)
                throw new Exception("No tienes saldo suficiente para este retiro.");

            // Solo un retiro activo a la vez
            var tieneRetiroActivo = await _retiroRepo.TieneRetiroActivoAsync(usuarioId);
            if (tieneRetiroActivo)
                throw new Exception("Ya tienes un retiro pendiente o en proceso. Espera a que se resuelva antes de solicitar otro.");

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

            var usuario = await _usuarioRepo.ObtenerPorIdAsync(recarga.UsuarioId);

            if (request.Aprobar)
            {
                //Actualizamos la solicitud con los datos del Admin
                recarga.Estado = "APROBADA";
                recarga.NroOperacion = request.NroOperacion;
                recarga.CuentaDestino = request.CuentaDestino; // EL ADMIN DEJA SU MARCA AQUÍ

                // LE SUMAMOS EL DINERO AL JUGADOR
                usuario.SaldoReal += recarga.Monto;
                await _usuarioRepo.ActualizarAsync(usuario);
                recarga.FechaCierre = DateTime.UtcNow;

                var movimiento = new MovimientoDto
                {
                    UsuarioId = usuario.UsuarioId,
                    RecargaId = recarga.RecargaId,
                    Tipo = "INGRESO",
                    MontoReal = recarga.Monto,
                    Concepto = $"Recarga {recarga.Metodo} - Recibido en: {recarga.CuentaDestino}",
                    Fecha = DateTime.UtcNow
                };
                await _auditRepo.RegistrarMovimientoAsync(movimiento);
            }
            else
            {
                recarga.Estado = "RECHAZADA";
                recarga.FechaCierre = DateTime.UtcNow;
            }

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

            var usuario = await _usuarioRepo.ObtenerPorIdAsync(retiro.UsuarioId);

            if (request.Aprobar)
            {
                // Validación extra: verificar que el usuario siga teniendo saldo
                if (usuario!.SaldoReal < retiro.Monto)
                    throw new Exception("El usuario ya no tiene saldo suficiente para este retiro.");

                // Actualizamos la solicitud con los datos del Admin
                retiro.Estado = "APROBADA";
                retiro.NroOperacion = request.NroOperacion;

                // LE RESTAMOS EL DINERO AL JUGADOR
                usuario.SaldoReal -= retiro.Monto;
                await _usuarioRepo.ActualizarAsync(usuario);
                retiro.FechaPago = DateTime.UtcNow;

                // Registrar en el Libro Mayor (MOVIMIENTOS) como EGRESO
                var movimiento = new MovimientoDto
                {
                    UsuarioId = usuario.UsuarioId,
                    RetiroId = retiro.RetiroId,
                    Tipo = "EGRESO",
                    MontoReal = retiro.Monto,
                    Concepto = $"Retiro {retiro.Metodo} - Enviado a: {retiro.CuentaDestino}",
                    Fecha = DateTime.UtcNow
                };
                await _auditRepo.RegistrarMovimientoAsync(movimiento);
            }
            else
            {
                retiro.Estado = "RECHAZADA";
                retiro.FechaPago = DateTime.UtcNow;
            }

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
