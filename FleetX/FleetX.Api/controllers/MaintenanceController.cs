using System.ComponentModel.DataAnnotations;
using FleetX.Api.Data;
using FleetX.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetX.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaintenanceController(FleetXDbContext context) : ControllerBase
{
    [HttpGet]
    public Task<List<MaintenanceRecord>> Get([FromQuery] int? vehicleId) => context.MaintenanceRecords
        .Include(m => m.Vehicle).ThenInclude(v => v!.VehicleModel)
        .Where(m => !vehicleId.HasValue || m.VehicleId == vehicleId)
        .OrderByDescending(m => m.DueDate ?? m.ServiceDate).ToListAsync();

    [HttpPost]
    public async Task<ActionResult<MaintenanceRecord>> Create(MaintenanceInput input)
    {
        if (!await context.Vehicles.AnyAsync(v => v.Id == input.VehicleId)) return BadRequest("Vehicle does not exist.");
        var item = new MaintenanceRecord { VehicleId = input.VehicleId, ServiceType = input.ServiceType, Vendor = input.Vendor ?? string.Empty, ServiceDate = input.ServiceDate, DueDate = input.DueDate, Mileage = input.Mileage, Cost = input.Cost, Notes = input.Notes ?? string.Empty, Status = input.Status };
        context.MaintenanceRecords.Add(item); await context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, MaintenanceInput input)
    {
        var item = await context.MaintenanceRecords.FindAsync(id); if (item is null) return NotFound();
        item.VehicleId = input.VehicleId; item.ServiceType = input.ServiceType; item.Vendor = input.Vendor ?? string.Empty; item.ServiceDate = input.ServiceDate; item.DueDate = input.DueDate; item.Mileage = input.Mileage; item.Cost = input.Cost; item.Notes = input.Notes ?? string.Empty; item.Status = input.Status;
        await context.SaveChangesAsync(); return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) { var item = await context.MaintenanceRecords.FindAsync(id); if (item is null) return NotFound(); context.Remove(item); await context.SaveChangesAsync(); return NoContent(); }
}

public class MaintenanceInput
{
    [Range(1, int.MaxValue)] public int VehicleId { get; set; }
    [Required, StringLength(100)] public string ServiceType { get; set; } = string.Empty;
    [StringLength(100)] public string? Vendor { get; set; }
    public DateTime ServiceDate { get; set; }
    public DateTime? DueDate { get; set; }
    [Range(0, int.MaxValue)] public int Mileage { get; set; }
    [Range(0, 999999999)] public decimal Cost { get; set; }
    [StringLength(1000)] public string? Notes { get; set; }
    [Required, RegularExpression("Completed|Scheduled|Overdue")] public string Status { get; set; } = "Completed";
}
