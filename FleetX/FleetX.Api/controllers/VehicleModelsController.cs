using FleetX.Api.Data;
using FleetX.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetX.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehicleModelsController : ControllerBase
{
    private readonly FleetXDbContext _context;

    public VehicleModelsController(FleetXDbContext context)
    {
        _context = context;
    }

    // GET: api/vehiclemodels
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VehicleModel>>> GetVehicleModels()
    {
        var models = await _context.VehicleModels
            .ToListAsync();

        return Ok(models);
    }

    // GET: api/vehiclemodels/1
    [HttpGet("{id}")]
    public async Task<ActionResult<VehicleModel>> GetVehicleModel(int id)
    {
        var model = await _context.VehicleModels
            .FirstOrDefaultAsync(m => m.Id == id);

        if (model == null)
        {
            return NotFound();
        }

        return Ok(model);
    }

    // POST: api/vehiclemodels
    [HttpPost]
    public async Task<ActionResult<VehicleModel>> CreateVehicleModel(
        VehicleModel model)
    {
        _context.VehicleModels.Add(model);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetVehicleModel),
            new { id = model.Id },
            model
        );
    }

    // PUT: api/vehiclemodels/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVehicleModel(
        int id,
        VehicleModel model)
    {
        if (id != model.Id)
        {
            return BadRequest();
        }

        _context.Entry(model).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/vehiclemodels/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicleModel(int id)
    {
        var model = await _context.VehicleModels.FindAsync(id);

        if (model == null)
        {
            return NotFound();
        }

        _context.VehicleModels.Remove(model);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}