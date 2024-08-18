using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Communication;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using RideModel;
using RideService.Data;
using RideService.Models;

namespace RideService
{
    /// <summary>
    /// An instance of this class is created for each service instance by the Service Fabric runtime.
    /// </summary>
    internal sealed class RideService : StatelessService, IRideService
    {
        private readonly AppDbContext _dbContext;

        public RideService(StatelessServiceContext context, AppDbContext dbContext)
            : base(context)
        {
            _dbContext = dbContext;
        }

        //METODE
        public async Task<(int id, string message)> CreateRide(int userId, string startLocation, string endLocation, double price, int wait)
        {
            int newRideId = _dbContext.Rides.Count() + 1;

            var newRide = new Ride
            {
                RideID = newRideId,
                UserID = userId,
                DriverID = -1,
                StartLocation = startLocation,
                EndLocation = endLocation,
                EstimatedPrice = price,
                Status = RideStatus.Created,
                EstimatedWait = wait,
                EstimatedDrive = -1
            };

            try
            {
                _dbContext.Rides.Add(newRide);
                await _dbContext.SaveChangesAsync();
                return (newRideId,"Ride created!");
            }
            catch (Exception e)
            {
                return (newRideId, $"Error in ride creation: {e.Message})");
            }

        }

        public async Task<string> GetRideStatus(int rideId)
        {
            var ride = await _dbContext.Rides.FindAsync(rideId);
            if(ride == null)
            {
                return "Ride not found";
            }

            switch (ride.Status)
            {
                case RideStatus.Created:
                    return "Created";
                case RideStatus.Accepted:
                    return "Accepted";
                case RideStatus.Ongoing:
                    return "Ongoing";
                default:
                    return "Complete";
            }

        }

        public async Task<string> SetRideStatusAccepted(int rideId, int driverId)
        {
            var ride = await _dbContext.Rides.FindAsync(rideId);
            if(ride == null)
            {
                return "Ride not found";
            }

            Random random = new Random();
            int randomDriveTime = random.Next(9, 60);

            ride.Status = RideStatus.Accepted;
            ride.DriverID = driverId;
            ride.EstimatedDrive = randomDriveTime;

            await _dbContext.SaveChangesAsync();

            return "Status -> Accepted";
        }

        public async Task<string> SetRideStatusOngoing(int rideId)
        {
            var ride = await _dbContext.Rides.FindAsync(rideId);
            if (ride == null)
            {
                return "Ride not found";
            }

            ride.Status = RideStatus.Ongoing;

            await _dbContext.SaveChangesAsync();

            return "Ride Status -> Ongoing";
        }

        public async Task<string> SetRideStatusCompleted(int rideId)
        {
            var ride = await _dbContext.Rides.FindAsync(rideId);
            if (ride == null)
            {
                return "Ride not found";
            }

            ride.Status = RideStatus.Completed;

            await _dbContext.SaveChangesAsync();

            return "Ride Status -> Completed";
        }

        public async Task<List<Ride>> GetAllCreatedRides()
        {
            var createdRides = await _dbContext.Rides.Where(r => r.Status == RideStatus.Created).ToListAsync();
            return createdRides;
        }

        public async Task<int> GetEstimatedDrive(int rideId)
        {
            int time = -1;
            var ride = await _dbContext.Rides.FindAsync(rideId);
            if(ride == null)
            {
                return time;
            }
            time = ride.EstimatedDrive;
            return time;
        }

        public async Task<(int time, int driverId)> GetEstimatedDriveAndDriverId(int rideId)
        {
            int time = -1;
            int driverId = -1;
            var ride = await _dbContext.Rides.FindAsync(rideId);
            if(ride == null)
            {
                return (time,driverId);
            }

            time = ride.EstimatedDrive;
            driverId = ride.DriverID;

            return (time, driverId);
        }




        /// <summary>
        /// Optional override to create listeners (e.g., TCP, HTTP) for this service replica to handle client or user requests.
        /// </summary>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }

        /// <summary>
        /// This is the main entry point for your service instance.
        /// </summary>
        /// <param name="cancellationToken">Canceled when Service Fabric needs to shut down this service instance.</param>
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            // TODO: Replace the following sample code with your own logic 
            //       or remove this RunAsync override if it's not needed in your service.

            long iterations = 0;

            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();

                ServiceEventSource.Current.ServiceMessage(this.Context, "Working-{0}", ++iterations);

                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }
    }
}
