using FleetX.Api.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FleetX.Api.Migrations;

[DbContext(typeof(FleetXDbContext))]
[Migration("20260818000300_AddAudiRs3Sportback")]
public partial class AddAudiRs3Sportback : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder) => migrationBuilder.Sql("""
        DECLARE @modelId int;
        SELECT @modelId = Id FROM VehicleModels
        WHERE Make = 'Audi' AND Model = 'RS3 Sportback' AND Variant = '8V' AND Year = 2018;

        IF @modelId IS NULL
        BEGIN
            INSERT INTO VehicleModels (Make, Model, Variant, Year, FuelType, Horsepower, Torque, Transmission, ThreeDModelUrl)
            VALUES ('Audi', 'RS3 Sportback', '8V', 2018, 'Petrol', 294, 480, 'Automatic', '/models/2018-audi-rs3-sportback.glb');
            SET @modelId = SCOPE_IDENTITY();
        END;

        IF NOT EXISTS (SELECT 1 FROM Vehicles WHERE RegistrationNumber = 'CA 982-109')
        BEGIN
            INSERT INTO Vehicles (RegistrationNumber, VIN, Mileage, Status, VehicleModelId)
            VALUES ('CA 982-109', 'WUAZZZ8V0JA000001', 34000, 'Active', @modelId);
        END;
        """);

    protected override void Down(MigrationBuilder migrationBuilder) => migrationBuilder.Sql("""
        DELETE FROM Vehicles WHERE RegistrationNumber = 'CA 982-109';
        DELETE FROM VehicleModels WHERE Make = 'Audi' AND Model = 'RS3 Sportback' AND Variant = '8V' AND Year = 2018;
        """);
}
