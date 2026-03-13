using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SistemaApuestas.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarMmrSala : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Solo dejamos las instrucciones para agregar las 2 columnas en la tabla correcta
            migrationBuilder.AddColumn<int>(
                name: "mmr_minimo", // o "MmrMinimo" dependiendo de cómo lo llame tu código
                table: "sala",      // o "Salas"
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "mmr_maximo", // o "MmrMaximo"
                table: "sala",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "baneo");

            migrationBuilder.DropTable(
                name: "historial_mmr_admin");

            migrationBuilder.DropTable(
                name: "log_acciones");

            migrationBuilder.DropTable(
                name: "movimientos");

            migrationBuilder.DropTable(
                name: "participante_sala");

            migrationBuilder.DropTable(
                name: "usuario_stats");

            migrationBuilder.DropTable(
                name: "solicitud_recarga");

            migrationBuilder.DropTable(
                name: "solicitud_retiro");

            migrationBuilder.DropTable(
                name: "game_account");

            migrationBuilder.DropTable(
                name: "sala");

            migrationBuilder.DropTable(
                name: "mapa");

            migrationBuilder.DropTable(
                name: "torneo");

            migrationBuilder.DropTable(
                name: "usuario");

            migrationBuilder.DropTable(
                name: "clan");
        }
    }
}
