using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FleetX.Api.Data;

/// <summary>Lets EF create migrations without starting the web host.</summary>
public class FleetXDbContextFactory : IDesignTimeDbContextFactory<FleetXDbContext>
{
    public FleetXDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();
        var options = new DbContextOptionsBuilder<FleetXDbContext>()
            .UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
            .Options;
        return new FleetXDbContext(options);
    }
}
