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
        var trips = await context.TripLogs.Include(t => t.Driver).ToListAsync();
        var byVehicle = vehicles.Select(v => new { vehicleId = v.Id, name = $"{v.VehicleModel!.Make} {v.VehicleModel.Model}", registration = v.RegistrationNumber, mileage = v.Mileage, maintenanceCost = maintenance.Where(m => m.VehicleId == v.Id).Sum(m => m.Cost), fuelCost = fuel.Where(f => f.VehicleId == v.Id).Sum(f => f.Cost), distanceDrivenKm = trips.Where(t => t.VehicleId == v.Id).Sum(t => t.EndOdometer - t.StartOdometer), fuelUsedLitres = trips.Where(t => t.VehicleId == v.Id).Sum(t => t.FuelUsedLitres) }).ToList();
        var byDriver = trips.GroupBy(t => t.DriverId).Select(group => new { driverId = group.Key, driverName = $"{group.First().Driver!.FirstName} {group.First().Driver!.LastName}", tripCount = group.Count(), distanceDrivenKm = group.Sum(t => t.EndOdometer - t.StartOdometer), fuelUsedLitres = group.Sum(t => t.FuelUsedLitres) }).ToList();
        return Ok(new { totalVehicles = vehicles.Count, activeVehicles = vehicles.Count(v => v.Status == "Active"), maintenanceCost = maintenance.Sum(m => m.Cost), fuelCost = fuel.Sum(f => f.Cost), fuelBoughtLitres = fuel.Sum(f => f.Litres), fuelUsedLitres = trips.Sum(t => t.FuelUsedLitres), distanceDrivenKm = trips.Sum(t => t.EndOdometer - t.StartOdometer), byVehicle, byDriver });
    }
    [HttpGet("vehicles.csv")]
    public async Task<FileContentResult> ExportVehicles()
    {
        var rows = await context.Vehicles.Include(v => v.VehicleModel).ToListAsync();
        var csv = "Registration,Vehicle,Status,Mileage\n" + string.Join("\n", rows.Select(v => $"{v.RegistrationNumber},\"{v.VehicleModel!.Make} {v.VehicleModel.Model}\",{v.Status},{v.Mileage}"));
        return File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "fleet-report.csv");
    }
}
