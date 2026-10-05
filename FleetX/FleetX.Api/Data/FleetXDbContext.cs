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

    public DbSet<TripLog> TripLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MaintenanceRecord>().Property(m => m.Cost).HasPrecision(18, 2);
        modelBuilder.Entity<FuelLog>().Property(f => f.Cost).HasPrecision(18, 2);
        modelBuilder.Entity<FuelLog>().Property(f => f.Litres).HasPrecision(18, 2);
        modelBuilder.Entity<Vehicle>().HasIndex(v => v.RegistrationNumber).IsUnique();
        modelBuilder.Entity<Vehicle>().HasIndex(v => v.VIN).IsUnique();
        modelBuilder.Entity<Driver>().HasIndex(d => d.LicenseNumber).IsUnique();
        modelBuilder.Entity<TripLog>().Property(t => t.FuelUsedLitres).HasPrecision(18, 2);
        modelBuilder.Entity<TripLog>().HasOne(t => t.Driver).WithMany().HasForeignKey(t => t.DriverId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<TripLog>().HasOne(t => t.Vehicle).WithMany().HasForeignKey(t => t.VehicleId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<DriverAssignment>()
            .HasOne(a => a.Vehicle).WithMany().HasForeignKey(a => a.VehicleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
