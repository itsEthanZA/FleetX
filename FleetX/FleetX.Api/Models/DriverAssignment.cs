namespace FleetX.Api.Models;

public class DriverAssignment
{
    public int Id { get; set; }
    public int DriverId { get; set; }
    public Driver? Driver { get; set; }
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    public DateTime AssignedFrom { get; set; }
    public DateTime? AssignedTo { get; set; }
    public string Notes { get; set; } = string.Empty;
}
