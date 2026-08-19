using FleetX.Api.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FleetX.Api.Migrations;

[DbContext(typeof(FleetXDbContext))]
[Migration("20260818000200_UpdateBmwGenerationToF80")]
public partial class UpdateBmwGenerationToF80 : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder) =>
        migrationBuilder.Sql("UPDATE VehicleModels SET Variant = 'F80' WHERE Variant = 'G80'");

    protected override void Down(MigrationBuilder migrationBuilder) =>
        migrationBuilder.Sql("UPDATE VehicleModels SET Variant = 'G80' WHERE Variant = 'F80'");
}
