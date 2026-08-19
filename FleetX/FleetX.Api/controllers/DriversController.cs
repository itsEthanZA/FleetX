using FleetX.Api.Data;
using FleetX.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetX.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DriversController : ControllerBase
{
    private readonly FleetXDbContext _context;

    public DriversController(FleetXDbContext context)
    {
        _context = context;
    }

    // GET: api/drivers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Driver>>> GetDrivers()
    {
        var drivers = await _context.Drivers
            .Include(d => d.Vehicle)
            .ThenInclude(v => v!.VehicleModel)
            .ToListAsync();

        return Ok(drivers);
    }

    // GET: api/drivers/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Driver>> GetDriver(int id)
    {
        var driver = await _context.Drivers
            .Include(d => d.Vehicle)
            .ThenInclude(v => v!.VehicleModel)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (driver == null)
        {
            return NotFound();
        }

        return Ok(driver);
    }

    // POST: api/drivers
    [HttpPost]
    public async Task<ActionResult<Driver>> CreateDriver(Driver driver)
    {
        _context.Drivers.Add(driver);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetDriver),
            new { id = driver.Id },
            driver
        );
    }

    // PUT: api/drivers/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDriver(
        int id,
        Driver driver)
    {
        if (id != driver.Id)
        {
            return BadRequest();
        }

        _context.Entry(driver).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/drivers/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDriver(int id)
    {
        var driver = await _context.Drivers.FindAsync(id);

        if (driver == null)
        {
            return NotFound();
        }

        _context.Drivers.Remove(driver);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}