using System.ComponentModel.DataAnnotations;
using FleetX.Api.Data;
using FleetX.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetX.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TripsController(FleetXDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> Get([FromQuery] int? vehicleId, [FromQuery] int? driverId)
    {
        var trips = await context.TripLogs
            .Include(t => t.Driver)
            .Include(t => t.Vehicle).ThenInclude(v => v!.VehicleModel)
            .Where(t => (!vehicleId.HasValue || t.VehicleId == vehicleId) && (!driverId.HasValue || t.DriverId == driverId))
            .OrderByDescending(t => t.EndedAt)
            .Select(t => new
            {
                t.Id, t.DriverId, driverName = t.Driver!.FirstName + " " + t.Driver.LastName,
                t.VehicleId, registrationNumber = t.Vehicle!.RegistrationNumber,
                vehicleName = t.Vehicle.VehicleModel!.Make + " " + t.Vehicle.VehicleModel.Model,
                t.StartedAt, t.EndedAt, t.StartOdometer, t.EndOdometer,
                distanceKm = t.EndOdometer - t.StartOdometer,
                t.FuelUsedLitres, t.Purpose, t.Notes
            }).ToListAsync();

        return Ok(trips);
    }

    [HttpPost]
    public async Task<ActionResult> Create(TripInput input)
    {
        if (input.EndOdometer < input.StartOdometer) return BadRequest("Ending mileage must be at least the starting mileage.");
        if (input.EndedAt < input.StartedAt) return BadRequest("End time must be after start time.");
        if (!await context.Drivers.AnyAsync(d => d.Id == input.DriverId && d.Status == "Active")) return BadRequest("Choose an active driver.");
        var vehicle = await context.Vehicles.FindAsync(input.VehicleId);
        if (vehicle is null) return BadRequest("Choose a car in your garage.");
        if (vehicle.Status != "Active") return BadRequest("This car is not marked ready to drive.");
        if (input.StartOdometer < vehicle.Mileage) return BadRequest($"Starting mileage cannot be below the car's current reading of {vehicle.Mileage:N0} km.");

        var trip = new TripLog
        {
            DriverId = input.DriverId, VehicleId = input.VehicleId,
            StartedAt = input.StartedAt, EndedAt = input.EndedAt,
            StartOdometer = input.StartOdometer, EndOdometer = input.EndOdometer,
            FuelUsedLitres = input.FuelUsedLitres,
            Purpose = input.Purpose ?? string.Empty, Notes = input.Notes ?? string.Empty
        };

        context.TripLogs.Add(trip);
        if (input.EndOdometer > vehicle.Mileage) vehicle.Mileage = input.EndOdometer;
        await context.SaveChangesAsync();
        return Ok(new { trip.Id, trip.DriverId, trip.VehicleId, trip.StartedAt, trip.EndedAt, trip.StartOdometer, trip.EndOdometer, distanceKm = trip.EndOdometer - trip.StartOdometer, trip.FuelUsedLitres, trip.Purpose, trip.Notes });
    }
}

public class TripInput
{
    [Range(1, int.MaxValue)] public int DriverId { get; set; }
    [Range(1, int.MaxValue)] public int VehicleId { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime EndedAt { get; set; }
    [Range(0, int.MaxValue)] public int StartOdometer { get; set; }
    [Range(0, int.MaxValue)] public int EndOdometer { get; set; }
    [Range(0, 999999)] public decimal FuelUsedLitres { get; set; }
    [Required, StringLength(160)] public string Purpose { get; set; } = string.Empty;
    [StringLength(1000)] public string? Notes { get; set; }
}
