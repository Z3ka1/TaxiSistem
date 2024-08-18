using Microsoft.ServiceFabric.Services.Remoting;
using RideModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Communication
{
    public interface IRideService : IService
    {
        Task<(int id, string message)> CreateRide(int userId, string startLocation, string endLocation, double price, int wait);
        Task<string> GetRideStatus(int rideId);
        Task<string> SetRideStatusAccepted(int rideId, int driverId);
        Task<string> SetRideStatusOngoing(int rideId);
        Task<string> SetRideStatusCompleted(int rideId);
        Task<List<Ride>> GetAllCreatedRides();
        Task<int> GetEstimatedDrive(int rideId);
        Task<(int time, int driverId)> GetEstimatedDriveAndDriverId(int rideId);
    }
}
