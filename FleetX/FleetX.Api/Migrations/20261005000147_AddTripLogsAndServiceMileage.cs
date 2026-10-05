using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FleetX.Api.Migrations
{
    public partial class AddTripLogsAndServiceMileage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(name: "DueMileage", table: "MaintenanceRecords", type: "int", nullable: true);
            migrationBuilder.CreateTable(
                name: "TripLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false).Annotation("SqlServer:Identity", "1, 1"),
                    DriverId = table.Column<int>(type: "int", nullable: false),
                    VehicleId = table.Column<int>(type: "int", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartOdometer = table.Column<int>(type: "int", nullable: false),
                    EndOdometer = table.Column<int>(type: "int", nullable: false),
                    FuelUsedLitres = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Purpose = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripLogs", x => x.Id);
                    table.ForeignKey("FK_TripLogs_Drivers_DriverId", x => x.DriverId, "Drivers", "Id", onDelete: ReferentialAction.Restrict);
                    table.ForeignKey("FK_TripLogs_Vehicles_VehicleId", x => x.VehicleId, "Vehicles", "Id", onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateIndex(name: "IX_TripLogs_DriverId", table: "TripLogs", column: "DriverId");
            migrationBuilder.CreateIndex(name: "IX_TripLogs_VehicleId", table: "TripLogs", column: "VehicleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "TripLogs");
            migrationBuilder.DropColumn(name: "DueMileage", table: "MaintenanceRecords");
        }
    }
}
