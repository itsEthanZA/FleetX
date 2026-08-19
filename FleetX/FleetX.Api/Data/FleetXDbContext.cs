using FleetX.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FleetX.Api.Data;

public class FleetXDbContext : DbContext
{
    public FleetXDbContext(DbContextOptions<FleetXDbContext> options)
        : base(options)
    {
    }

    public DbSet<VehicleModel> VehicleModels { get; set; }

    public DbSet<Vehicle> Vehicles { get; set; }

    public DbSet<Driver> Drivers { get; set; }

    public DbSet<MaintenanceRecord> MaintenanceRecords { get; set; }

    public DbSet<FuelLog> FuelLogs { get; set; }

    public DbSet<DriverAssignment> DriverAssignments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MaintenanceRecord>().Property(m => m.Cost).HasPrecision(18, 2);
        modelBuilder.Entity<FuelLog>().Property(f => f.Cost).HasPrecision(18, 2);
        modelBuilder.Entity<FuelLog>().Property(f => f.Litres).HasPrecision(18, 2);
        modelBuilder.Entity<DriverAssignment>()
            .HasOne(a => a.Vehicle).WithMany().HasForeignKey(a => a.VehicleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
