namespace FleetX.Api.Models;

public class FuelLog
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    public DateTime FilledAt { get; set; }
    public decimal Litres { get; set; }
    public decimal Cost { get; set; }
    public int Odometer { get; set; }
    public string Station { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}
