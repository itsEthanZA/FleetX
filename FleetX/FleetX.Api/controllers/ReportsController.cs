using FleetX.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetX.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController(FleetXDbContext context) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult> Summary()
    {
        var vehicles = await context.Vehicles.Include(v => v.VehicleModel).ToListAsync();
        var maintenance = await context.MaintenanceRecords.ToListAsync(); var fuel = await context.FuelLogs.ToListAsync();
        return Ok(new { totalVehicles = vehicles.Count, activeVehicles = vehicles.Count(v => v.Status == "Active"), maintenanceCost = maintenance.Sum(m => m.Cost), fuelCost = fuel.Sum(f => f.Cost), fuelLitres = fuel.Sum(f => f.Litres), byVehicle = vehicles.Select(v => new { vehicleId = v.Id, name = $"{v.VehicleModel!.Make} {v.VehicleModel.Model}", registration = v.RegistrationNumber, mileage = v.Mileage, maintenanceCost = maintenance.Where(m => m.VehicleId == v.Id).Sum(m => m.Cost), fuelCost = fuel.Where(f => f.VehicleId == v.Id).Sum(f => f.Cost) }) });
    }
    [HttpGet("vehicles.csv")]
    public async Task<FileContentResult> ExportVehicles()
    {
        var rows = await context.Vehicles.Include(v => v.VehicleModel).ToListAsync();
        var csv = "Registration,Vehicle,Status,Mileage\n" + string.Join("\n", rows.Select(v => $"{v.RegistrationNumber},\"{v.VehicleModel!.Make} {v.VehicleModel.Model}\",{v.Status},{v.Mileage}"));
        return File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "fleet-report.csv");
    }
}
