using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FleetX.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddVehicleVIN : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VIN",
                table: "Vehicles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VIN",
                table: "Vehicles");
        }
    }
}
