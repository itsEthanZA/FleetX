using FleetX.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetX.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(FleetXDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> Get()
    {
        var today = DateTime.UtcNow.Date;
        var vehicles = await context.Vehicles.Include(v => v.VehicleModel).OrderBy(v => v.Id).ToListAsync();
        var dueMileageItems = await context.MaintenanceRecords.Where(m => m.Status != "Completed" && m.DueMileage != null).Select(m => new { m.VehicleId, m.DueMileage }).ToListAsync();
        var overdueDateCount = await context.MaintenanceRecords.CountAsync(m => m.Status == "Overdue" || (m.DueDate != null && m.DueDate < today && m.Status != "Completed"));
        var mileageDueCount = dueMileageItems.Count(m => m.DueMileage.HasValue && vehicles.Any(v => v.Id == m.VehicleId && v.Mileage >= m.DueMileage.Value));
        return Ok(new { totalVehicles = vehicles.Count, activeVehicles = vehicles.Count(v => v.Status == "Active"), drivers = await context.Drivers.CountAsync(), overdueMaintenance = overdueDateCount + mileageDueCount, unassignedVehicles = vehicles.Count(v => !context.Drivers.Any(d => d.VehicleId == v.Id)), featuredVehicle = vehicles.FirstOrDefault() });
    }
}
