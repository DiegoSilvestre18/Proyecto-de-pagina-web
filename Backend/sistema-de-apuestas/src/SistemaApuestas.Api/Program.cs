using Microsoft.EntityFrameworkCore;
using SistemaApuestas.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Registro de Controllers
builder.Services.AddControllers();

// AGREGAR SERVICIOS DE SWAGGER 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuracion de la conexión a la base de datos PostgreSQL usando Entity Framework Core
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuración de CORS para permitir solicitudes desde el frontend React
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // El puerto de tu React
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

//GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

app.UseCors("ReactFrontend"); // Aplica la política de CORS
app.MapControllers(); // Mapea los controladores de la API
app.Run(); // Inicia la aplicación