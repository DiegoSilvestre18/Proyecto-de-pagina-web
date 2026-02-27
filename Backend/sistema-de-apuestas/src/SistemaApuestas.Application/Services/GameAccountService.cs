using Microsoft.Extensions.Configuration;
using System.Text.Json;
using SistemaApuestas.Application.DTOs.GameAccount;
using SistemaApuestas.Application.Interfaces.GameAccount;
using SistemaApuestas.Domain.Entities.Gaming;
using SistemaApuestas.Application.Repositories.GameAccount; // O la ruta exacta a tu GameAccount

namespace SistemaApuestas.Application.Services
{
    public class GameAccountService : IGameAccountService
    {
        private readonly IGameAccountRepository _repository;
        private readonly HttpClient _httpClient; // 🌐 El motor para llamar a las APIs
        private readonly IConfiguration _config;

        public GameAccountService(IGameAccountRepository repository, HttpClient httpClient, IConfiguration config)
        {
            _repository = repository;
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<string> VincularCuentaAsync(int usuarioId, VincularCuentaDto request)
        {
            string juegoMayusculas = request.Juego.ToUpper();

            // 1. Validar la regla de negocio
            if (await _repository.UsuarioYaTieneCuentaAsync(usuarioId, juegoMayusculas))
            {
                throw new Exception("Esta cuenta de juego ya está registrada en el sistema.");
            }

            string rangoObtenido = "UNRANKED";
            string nombreCuenta = request.Identificador;

            // 2. CONSULTAS A LAS APIS EXTERNAS (El Detective)
            if (juegoMayusculas == "VALORANT")
            {
                var partes = request.Identificador.Split('#');
                if (partes.Length != 2) throw new Exception("El formato de Valorant debe ser Nombre#Tag (ej: Thomas#LAN).");

                string nombreEscapado = Uri.EscapeDataString(partes[0]);
                string tagEscapado = Uri.EscapeDataString(partes[1]);

                // --- GOLPE 1: OBTENER DATOS DE LA CUENTA Y REGIÓN ---
                string urlAccount = $"https://api.henrikdev.xyz/valorant/v1/account/{nombreEscapado}/{tagEscapado}";
                var reqAccount = new HttpRequestMessage(HttpMethod.Get, urlAccount);
                reqAccount.Headers.Add("Authorization", _config["HenrikDevApiKey"]);

                var resAccount = await _httpClient.SendAsync(reqAccount);
                if (!resAccount.IsSuccessStatusCode)
                {
                    string errorReal = await resAccount.Content.ReadAsStringAsync();
                    throw new Exception($"Error Cuenta HenrikDev ({resAccount.StatusCode}): {errorReal}");
                }

                var jsonAccount = await resAccount.Content.ReadAsStringAsync();
                var datosAccount = JsonDocument.Parse(jsonAccount);
                var dataAcc = datosAccount.RootElement.GetProperty("data");

                string nombre = dataAcc.GetProperty("name").GetString() ?? partes[0];
                string tag = dataAcc.GetProperty("tag").GetString() ?? partes[1];
                string region = dataAcc.GetProperty("region").GetString() ?? "latam"; // ¡Necesitamos esto!

                // (Opcional) Aquí también podrías guardar el account_level si agregas la columna a tu BD
                // int nivel = dataAcc.GetProperty("account_level").GetInt32();

                nombreCuenta = $"{nombre}#{tag}";

                // --- GOLPE 2: OBTENER EL RANGO (MMR) ---
                string urlMmr = $"https://api.henrikdev.xyz/valorant/v1/mmr/{region}/{nombreEscapado}/{tagEscapado}";
                var reqMmr = new HttpRequestMessage(HttpMethod.Get, urlMmr);
                reqMmr.Headers.Add("Authorization", _config["HenrikDevApiKey"]);

                var resMmr = await _httpClient.SendAsync(reqMmr);

                if (resMmr.IsSuccessStatusCode)
                {
                    var jsonMmr = await resMmr.Content.ReadAsStringAsync();
                    var datosMmr = JsonDocument.Parse(jsonMmr);
                    var dataMmr = datosMmr.RootElement.GetProperty("data");

                    // Extraemos el texto limpio (Ej: "Gold 2")
                    if (dataMmr.TryGetProperty("currenttierpatched", out var tierElement) && tierElement.ValueKind != JsonValueKind.Null)
                    {
                        rangoObtenido = tierElement.GetString() ?? "UNRANKED";
                    }
                }
            }
            else if (juegoMayusculas == "DOTA")
            {
                string urlDota = $"https://api.opendota.com/api/players/{request.Identificador}";
                var response = await _httpClient.GetAsync(urlDota);

                if (!response.IsSuccessStatusCode) throw new Exception("La cuenta de Steam no existe en OpenDota.");

                var jsonString = await response.Content.ReadAsStringAsync();
                var datosDota = JsonDocument.Parse(jsonString);

                if (!datosDota.RootElement.TryGetProperty("profile", out var perfil))
                    throw new Exception("La cuenta es privada o no ha jugado Dota 2.");

                nombreCuenta = perfil.GetProperty("personaname").GetString() ?? request.Identificador;

                if (datosDota.RootElement.TryGetProperty("rank_tier", out var rankElement) && rankElement.ValueKind != JsonValueKind.Null)
                {
                    rangoObtenido = rankElement.GetInt32().ToString();
                }
            }
            else
            {
                throw new Exception("Juego no soportado. Usa 'VALORANT' o 'DOTA'.");
            }

            // 3. Crear el objeto
            var nuevaCuenta = new GameAccount
            {
                UsuarioId = usuarioId,
                Juego = juegoMayusculas,
                IdExterno = request.Identificador,
                IdVisible = nombreCuenta,
                RangoActual = rangoObtenido,
                EsRangoManual = false,
                FechaVinculacion = DateTime.UtcNow
            };

            // 4. Guardar en BD
            await _repository.AgregarAsync(nuevaCuenta);

            return $"Cuenta '{nombreCuenta}' verificada y vinculada exitosamente con rango {rangoObtenido}.";
        }

        //SINCRONIZAR RANGOS CAUSA 
        public async Task<string> SincronizarRangoAsync(int usuarioId, SincronizarCuentaDto request)
        {
            string juegoMayusculas = request.Juego.ToUpper();

            // 1. Buscamos la cuenta en la base de datos
            var cuenta = await _repository.ObtenerPorUsuarioYJuegoAsync(usuarioId, juegoMayusculas);
            if (cuenta == null) throw new Exception($"No tienes ninguna cuenta vinculada para {juegoMayusculas}.");

            string nuevoRango = "UNRANKED";

            // 2. Volvemos a consultar a los detectives externos
            if (juegoMayusculas == "VALORANT")
            {
                // Como IdExterno guardamos "Tefiii#0907", lo volvemos a separar
                var partes = cuenta.IdExterno.Split('#');
                string nombreEscapado = Uri.EscapeDataString(partes[0]);
                string tagEscapado = Uri.EscapeDataString(partes[1]);

                // A. Sacamos la región
                string urlAccount = $"https://api.henrikdev.xyz/valorant/v1/account/{nombreEscapado}/{tagEscapado}";
                var reqAccount = new HttpRequestMessage(HttpMethod.Get, urlAccount);
                reqAccount.Headers.Add("Authorization", _config["HenrikDevApiKey"]);

                var resAccount = await _httpClient.SendAsync(reqAccount);
                if (!resAccount.IsSuccessStatusCode) throw new Exception("Error al conectar con Riot Games.");

                var jsonAccount = await resAccount.Content.ReadAsStringAsync();
                var datosAccount = JsonDocument.Parse(jsonAccount);
                string region = datosAccount.RootElement.GetProperty("data").GetProperty("region").GetString() ?? "latam";

                // B. Sacamos el MMR nuevo
                string urlMmr = $"https://api.henrikdev.xyz/valorant/v1/mmr/{region}/{nombreEscapado}/{tagEscapado}";
                var reqMmr = new HttpRequestMessage(HttpMethod.Get, urlMmr);
                reqMmr.Headers.Add("Authorization", _config["HenrikDevApiKey"]);

                var resMmr = await _httpClient.SendAsync(reqMmr);
                if (resMmr.IsSuccessStatusCode)
                {
                    var jsonMmr = await resMmr.Content.ReadAsStringAsync();
                    var datosMmr = JsonDocument.Parse(jsonMmr);
                    if (datosMmr.RootElement.GetProperty("data").TryGetProperty("currenttierpatched", out var tierElement) && tierElement.ValueKind != JsonValueKind.Null)
                    {
                        nuevoRango = tierElement.GetString() ?? "UNRANKED";
                    }
                }
            }
            else if (juegoMayusculas == "DOTA")
            {
                // Como IdExterno guardamos el Steam32 ID
                string urlDota = $"https://api.opendota.com/api/players/{cuenta.IdExterno}";
                var response = await _httpClient.GetAsync(urlDota);

                if (!response.IsSuccessStatusCode) throw new Exception("Error al conectar con OpenDota.");

                var jsonString = await response.Content.ReadAsStringAsync();
                var datosDota = JsonDocument.Parse(jsonString);

                if (datosDota.RootElement.TryGetProperty("rank_tier", out var rankElement) && rankElement.ValueKind != JsonValueKind.Null)
                {
                    nuevoRango = rankElement.GetInt32().ToString();
                }
            }

            // 3. Sobrescribimos el rango antiguo con el nuevo
            cuenta.RangoActual = nuevoRango;

            // 4. Guardamos los cambios en PostgreSQL
            await _repository.ActualizarAsync(cuenta);

            return $"Rango actualizado exitosamente. Tu rango actual es: {nuevoRango}";
        }   

    }
}