using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SistemaApuestas.Application.Hubs;
using SistemaApuestas.Application.Interfaces;
using SistemaApuestas.Application.Interfaces.Audit;
using SistemaApuestas.Application.Interfaces.Admin;
using SistemaApuestas.Application.Interfaces.Auth;
using SistemaApuestas.Application.Interfaces.Financial;
using SistemaApuestas.Application.Interfaces.GameAccount;
using SistemaApuestas.Application.Interfaces.Salas;
using SistemaApuestas.Application.Repositories.Audit;
using SistemaApuestas.Application.Repositories.Financial;
using SistemaApuestas.Application.Repositories.GameAccount;
using SistemaApuestas.Application.Repositories.Identity;
using SistemaApuestas.Application.Services;
using SistemaApuestas.Application.Services.Admin;
using SistemaApuestas.Application.Services.Audit;
using SistemaApuestas.Application.Services.Financial;
using SistemaApuestas.Infrastructure.Persistence;
using SistemaApuestas.Infrastructure.Repositories;
using SistemaApuestas.Infrastructure.Repositories.Audit;
using SistemaApuestas.Infrastructure.Repositories.Financial;
using SistemaApuestas.Infrastructure.Repositories.Identity;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// INYECCIÓN DE DEPENDENCIAS (El puente entre capas)
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminService, AdminService>();

builder.Services.AddScoped<IGameAccountRepository, GameAccountRepository>();
builder.Services.AddHttpClient<IGameAccountService, GameAccountService>();

builder.Services.AddScoped<IMovimientoRepository, MovimientoRepository>();
builder.Services.AddScoped<IAuditService, AuditService>();

builder.Services.AddScoped<ISolicitudRecargaRepository, SolicitudRecargaRepository>();
builder.Services.AddScoped<ISolicitudRetiroRepository, SolicitudRetiroRepository>();
builder.Services.AddScoped<IFinancialService, FinancialService>();

builder.Services.AddScoped<ISalaService, SalaService>();
// Si también tienes un repositorio para salas, agrégalo:
builder.Services.AddScoped<ISalaRepository, SalaRepository>();

builder.Services.AddSignalR();

// Registro de Controllers
builder.Services.AddControllers();

// AGREGAR SERVICIOS DE SWAGGER 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuracion de la conexión a la base de datos PostgreSQL usando Entity Framework Core
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// CONFIGURACIÓN DE AUTENTICACIÓN (JWT + Steam)
builder.Services.AddAuthentication(options =>
{
    // Por defecto, la API sigue protegiéndose con JWT para las peticiones de React
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

    // Steam necesita este esquema temporal de cookies para su flujo de redirección
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    })
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddSteam("Steam", options =>
    {
        // Ruta interna que el middleware intercepta (NO es un endpoint de controller)
        options.CallbackPath = "/signin-steam";
    });

// Configuración de CORS para permitir solicitudes desde el frontend React
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()
    ?? ["http://localhost:5173", "https://arenagamergg.com", "https://www.arenagamergg.com"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()  // Permite enviar JSON y tokens de autorización
              .AllowAnyMethod() // Permite GET, POST, PUT, DELETE
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseForwardedHeaders();
app.UseRouting(); // 👈 Es buena práctica agregarlo

// Aplica la política de CORS (Solo deja la de "ReactFrontend" que ya tiene el AllowCredentials)
app.UseCors("ReactFrontend");

// ACTIVAR LA SEGURIDAD EN EL PIPELINE
app.UseAuthentication();
app.UseAuthorization();

// REGISTRAR RUTAS Y HUBS
app.MapControllers();
app.MapHub<SalaHub>("/salahub"); // 👈 AHORA SÍ, ANTES DEL RUN

// INICIAR EL SERVIDOR (¡Siempre va al final de todo!)
app.Run();