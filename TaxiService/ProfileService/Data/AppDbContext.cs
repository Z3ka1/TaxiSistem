using Microsoft.EntityFrameworkCore;
using ProfileService.Models;
using System.Collections.Generic;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace ProfileService.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Profile> Profiles => Set<Profile>();
        public AppDbContext() => Database.EnsureCreated();
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=UserProfiles;Username=postgres;Password=123");
        }
    }
}
