namespace FleetX.Api.Models;

using System.Text.Json.Serialization;

public class MaintenanceRecord
{
    public int Id { get; set; }

    public int VehicleId { get; set; }

    [JsonIgnore]
    public Vehicle? Vehicle { get; set; }

    public string ServiceType { get; set; } = string.Empty;

    public string Vendor { get; set; } = string.Empty;

    public DateTime ServiceDate { get; set; }

    public DateTime? DueDate { get; set; }

    public int Mileage { get; set; }

    public decimal Cost { get; set; }

    public string Notes { get; set; } = string.Empty;

    public string Status { get; set; } = "Completed";
}