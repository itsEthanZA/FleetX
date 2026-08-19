using FleetX.Api.Data;
using FleetX.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetX.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly FleetXDbContext _context;

    public VehiclesController(FleetXDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles()
    {
        var vehicles = await _context.Vehicles
            .Include(v => v.VehicleModel)
            .ToListAsync();

        return Ok(vehicles);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Vehicle>> GetVehicle(int id)
    {
        var vehicle = await _context.Vehicles
            .Include(v => v.VehicleModel)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (vehicle == null)
        {
            return NotFound();
        }

        return Ok(vehicle);
    }

    [HttpPost]
    public async Task<ActionResult<Vehicle>> CreateVehicle(Vehicle vehicle)
    {
        _context.Vehicles.Add(vehicle);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetVehicle),
            new { id = vehicle.Id },
            vehicle
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVehicle(
        int id,
        Vehicle vehicle)
    {
        if (id != vehicle.Id)
        {
            return BadRequest();
        }

        _context.Entry(vehicle).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);

        if (vehicle == null)
        {
            return NotFound();
        }

        _context.Vehicles.Remove(vehicle);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}