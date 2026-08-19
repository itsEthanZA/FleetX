using System.Text.Json.Serialization;

namespace FleetX.Api.Models;

public class VehicleModel
{
    public int Id { get; set; }

    public string Make { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public string Variant { get; set; } = string.Empty;

    public int Year { get; set; }

    public string FuelType { get; set; } = string.Empty;

    public int Horsepower { get; set; }

    public int Torque { get; set; }

    public string Transmission { get; set; } = string.Empty;

    public string ThreeDModelUrl { get; set; } = string.Empty;

    [JsonIgnore]
    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}