namespace FleetX.Api.Models;

public class Driver
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string LicenseNumber { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string Status { get; set; } = "Active";

    public int? VehicleId { get; set; }

    public Vehicle? Vehicle { get; set; }

    public DateTime? LicenseExpiryDate { get; set; }

    public ICollection<DriverAssignment> Assignments { get; set; } = new List<DriverAssignment>();
}
