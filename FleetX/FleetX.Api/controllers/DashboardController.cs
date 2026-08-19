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
        return Ok(new { totalVehicles = vehicles.Count, activeVehicles = vehicles.Count(v => v.Status == "Active"), drivers = await context.Drivers.CountAsync(), overdueMaintenance = await context.MaintenanceRecords.CountAsync(m => m.Status == "Overdue" || (m.DueDate != null && m.DueDate < today && m.Status != "Completed")), unassignedVehicles = vehicles.Count(v => !context.Drivers.Any(d => d.VehicleId == v.Id)), featuredVehicle = vehicles.FirstOrDefault() });
    }
}
