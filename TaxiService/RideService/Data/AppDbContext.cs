using Microsoft.EntityFrameworkCore;
using RideModel;
using RideService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RideService.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Ride> Rides => Set<Ride>();
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=RideData;Username=postgres;Password=123");
        }
    }
}
