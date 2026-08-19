using System.ComponentModel.DataAnnotations;
using FleetX.Api.Data;
using FleetX.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetX.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FuelController(FleetXDbContext context) : ControllerBase
{
    [HttpGet]
    public Task<List<FuelLog>> Get([FromQuery] int? vehicleId) => context.FuelLogs.Include(f => f.Vehicle).ThenInclude(v => v!.VehicleModel).Where(f => !vehicleId.HasValue || f.VehicleId == vehicleId).OrderByDescending(f => f.FilledAt).ToListAsync();
    [HttpPost]
    public async Task<ActionResult<FuelLog>> Create(FuelInput input)
    {
        if (!await context.Vehicles.AnyAsync(v => v.Id == input.VehicleId)) return BadRequest("Vehicle does not exist.");
        var item = new FuelLog { VehicleId = input.VehicleId, FilledAt = input.FilledAt, Litres = input.Litres, Cost = input.Cost, Odometer = input.Odometer, Station = input.Station ?? string.Empty, Notes = input.Notes ?? string.Empty };
        context.FuelLogs.Add(item); await context.SaveChangesAsync(); return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, FuelInput input) { var item = await context.FuelLogs.FindAsync(id); if (item is null) return NotFound(); item.VehicleId=input.VehicleId; item.FilledAt=input.FilledAt; item.Litres=input.Litres; item.Cost=input.Cost; item.Odometer=input.Odometer; item.Station=input.Station ?? string.Empty; item.Notes=input.Notes ?? string.Empty; await context.SaveChangesAsync(); return NoContent(); }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) { var item=await context.FuelLogs.FindAsync(id); if(item is null)return NotFound(); context.Remove(item); await context.SaveChangesAsync(); return NoContent(); }
}
public class FuelInput { [Range(1,int.MaxValue)] public int VehicleId { get; set; } public DateTime FilledAt { get; set; } [Range(0.01,999999)] public decimal Litres { get; set; } [Range(0,999999999)] public decimal Cost { get; set; } [Range(0,int.MaxValue)] public int Odometer { get; set; } [StringLength(100)] public string? Station { get; set; } [StringLength(1000)] public string? Notes { get; set; } }
