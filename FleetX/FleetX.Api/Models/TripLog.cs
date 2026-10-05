namespace FleetX.Api.Models;

public class TripLog
{
    public int Id { get; set; }
    public int DriverId { get; set; }
    public Driver? Driver { get; set; }
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime EndedAt { get; set; }
    public int StartOdometer { get; set; }
    public int EndOdometer { get; set; }
    public decimal FuelUsedLitres { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}
