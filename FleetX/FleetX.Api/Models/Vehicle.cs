using System.Text.Json.Serialization;

namespace FleetX.Api.Models;

public class Vehicle
{
    public int Id { get; set; }

    public string RegistrationNumber { get; set; } = string.Empty;

    public string VIN { get; set; } = string.Empty;

    public int Mileage { get; set; }

    public string Status { get; set; } = "Active";

    public int VehicleModelId { get; set; }

    public VehicleModel? VehicleModel { get; set; }

    [JsonIgnore]
    public ICollection<MaintenanceRecord> MaintenanceRecords { get; set; } = new List<MaintenanceRecord>();

    [JsonIgnore]
    public ICollection<FuelLog> FuelLogs { get; set; } = new List<FuelLog>();
}
