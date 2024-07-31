using AuthenticationService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace AuthenticationService.Data
{
    public class AppDbContext : DbContext
    {
        //protected readonly IConfiguration Configuration;

        //public AppDbContext(IConfiguration configuration)
        //{
        //    Configuration = configuration;
        //}

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseNpgsql(Configuration.GetConnectionString("DatabaseConnection"));
        //}

        //public DbSet<Credentials> Credentials { get; set; }

        public DbSet<Credentials> Credentials => Set<Credentials>();
        public AppDbContext() => Database.EnsureCreated();
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=UserCredentials;Username=postgres;Password=123");
        }

    }
}
