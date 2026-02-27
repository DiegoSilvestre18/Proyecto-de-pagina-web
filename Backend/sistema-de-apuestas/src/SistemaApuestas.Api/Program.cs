using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SistemaApuestas.Application.Interfaces.Auth;
using SistemaApuestas.Application.Interfaces.GameAccount;
using SistemaApuestas.Application.Interfaces.Financial;
using SistemaApuestas.Application.Repositories.Auth;
using SistemaApuestas.Application.Repositories.GameAccount;
using SistemaApuestas.Application.Repositories.Financial;
using SistemaApuestas.Application.Services;
using SistemaApuestas.Infrastructure.Persistence;
using SistemaApuestas.Infrastructure.Repositories;
using System.Text;
using SistemaApuestas.Application.Services.Financial;

var builder = WebApplication.CreateBuilder(args);

// INYECCIÓN DE DEPENDENCIAS (El puente entre capas)
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IGameAccountRepository, GameAccountRepository>();
builder.Services.AddHttpClient<IGameAccountService, GameAccountService>();

builder.Services.AddScoped<ISolicitudRecargaRepository, SolicitudRecargaRepository>();
builder.Services.AddScoped<ISolicitudRetiroRepository, SolicitudRetiroRepository>();
builder.Services.AddScoped<IFinancialService, FinancialService>();

// Registro de Controllers
builder.Services.AddControllers();

// AGREGAR SERVICIOS DE SWAGGER 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuracion de la conexión a la base de datos PostgreSQL usando Entity Framework Core
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// CONFIGURACIÓN DE JWT (Para generar y leer los tokens)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
    });

// Configuración de CORS para permitir solicitudes desde el frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // El puerto de React
              .AllowAnyHeader()  // Permite enviar JSON y tokens de autorización
              .AllowAnyMethod(); // Permite GET, POST, PUT, DELETE
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactFrontend"); // Aplica la política de CORS

// ACTIVAR LA SEGURIDAD EN EL PIPELINE
app.UseAuthentication(); // Primero identifica quién es el usuario (Lee el Token)
app.UseAuthorization();  // Luego verifica si tiene permiso de entrar a la ruta

app.MapControllers(); // Mapea los controladores de la API
app.Run(); // Inicia la aplicación