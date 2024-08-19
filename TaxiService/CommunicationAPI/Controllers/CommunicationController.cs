using Communication;
using CommunicationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace CommunicationAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommunicationController : ControllerBase
    {
        [HttpGet]
        [Route("test")]
        public async Task<string> TestGet([FromQuery] int driverId)
        {
            var partitionId = driverId % 1; //1 za partition count iz TaxiService->StartupServices

            var statefulProxy = ServiceProxy.Create<IDriverService>(
                new Uri("fabric:/TaxiService/DriverService"),
                new Microsoft.ServiceFabric.Services.Client.ServicePartitionKey(partitionId));

            var serviceName = await statefulProxy.GetServiceDetails();

            return serviceName;
        }

        [HttpPost]
        [Route("addDriver")]
        public async Task<IActionResult> AddDriver([FromBody] int id)
        {
            var partitionId = id % 1;

            var statefulProxy = ServiceProxy.Create<IDriverService>(
                new Uri("fabric:/TaxiService/DriverService"),
                new Microsoft.ServiceFabric.Services.Client.ServicePartitionKey(partitionId));

            var response = await statefulProxy.RegisterDriver(id);

            if (response == "Driver successfully registered")
            {
                return Ok(new { message = response });
            }
            else
            {
                return StatusCode(500, new { message = response });
            }
        }

        [HttpGet]
        [Route("returnPending")]
        public async Task<IActionResult> ReturnPendingIds()
        {
            var statefulProxy = ServiceProxy.Create<IDriverService>(
                new Uri("fabric:/TaxiService/DriverService"),
                new Microsoft.ServiceFabric.Services.Client.ServicePartitionKey(0));

            var response = await statefulProxy.ReturnPendingIds();

            return Ok(response);
        }

        [HttpPost]
        [Route("approveDriver")]
        public async Task<IActionResult> ApproveDriver([FromBody] int id)
        {
            var partitionId = id % 1;

            var statefulProxy = ServiceProxy.Create<IDriverService>(
                new Uri("fabric:/TaxiService/DriverService"),
                new Microsoft.ServiceFabric.Services.Client.ServicePartitionKey(partitionId));

            var response = await statefulProxy.ApproveDriver(id);

            if (response == "Driver approved!")
            {
                return Ok(new { message = response });
            }
            else
            {
                return NotFound(new { message = response });
            }
        }

        [HttpPost]
        [Route("rejectDriver")]
        public async Task<IActionResult> RejectDriver([FromBody] int id)
        {
            var partitionId = id % 1;

            var statefulProxy = ServiceProxy.Create<IDriverService>(
                new Uri("fabric:/TaxiService/DriverService"),
                new Microsoft.ServiceFabric.Services.Client.ServicePartitionKey(partitionId));

            var response = await statefulProxy.RejectDriver(id);

            if (response == "Driver rejected!")
            {
                return Ok(new { message = response });
            }
            else
            {
                return NotFound(new { message = response });
            }
        }

        [HttpPost]
        [Route("createRide")]
        public async Task<IActionResult> CreateRide([FromBody] RideRequest request)
        {
            var statelessProxy = ServiceProxy.Create<IRideService>(
                new Uri("fabric:/TaxiService/RideService"));

            var response = await statelessProxy.CreateRide(request.UserId, request.StartAddress, request.EndAddress, request.Price, request.WaitTime);

            var (rideId, message) = response;

            if (message == "Ride created!")
                return Ok(new
                {
                    rideId,
                    message
                });
            else
                return StatusCode(500, new { message });
        }

        [HttpGet]
        [Route("rideStatus/{rideId}")]
        public async Task<IActionResult> GetRideStatus(int rideId)
        {
            var statelessProxy = ServiceProxy.Create<IRideService>(
                new Uri("fabric:/TaxiService/RideService"));

            var response = await statelessProxy.GetRideStatus(rideId);

            if (response == "Ride not found")
                return NotFound(new { message = response });

            return Ok(response);
        }

        [HttpPost]
        [Route("acceptRide/{rideId}")]
        public async Task<IActionResult> AcceptRide(int rideId, [FromBody] int driverId)
        {
            var statelessProxy = ServiceProxy.Create<IRideService>(
                new Uri("fabric:/TaxiService/RideService"));

            var response = await statelessProxy.SetRideStatusAccepted(rideId, driverId);

            if (response == "Ride not found")
                return NotFound(new { message = response });

            return Ok(response);
        }

        [HttpPost]
        [Route("setRideOngoing/{rideId}")]
        public async Task<IActionResult> SetRideOngoing(int rideId)
        {
            var statelessProxy = ServiceProxy.Create<IRideService>(
                new Uri("fabric:/TaxiService/RideService"));

            var response = await statelessProxy.SetRideStatusOngoing(rideId);

            if (response == "Ride not found")
                return NotFound(new { message = response });

            return Ok(response);
        }

        [HttpPost]
        [Route("setRideCompleted/{rideId}")]
        public async Task<IActionResult> SetRideCompleted(int rideId)
        {
            var statelessProxy = ServiceProxy.Create<IRideService>(
                new Uri("fabric:/TaxiService/RideService"));

            var response = await statelessProxy.SetRideStatusCompleted(rideId);

            if (response == "Ride not found")
                return NotFound(new { message = response });

            return Ok(response);
        }

        [HttpGet]
        [Route("getCreatedRides")]
        public async Task<IActionResult> GetCreatedRides()
        {
            var statelessProxy = ServiceProxy.Create<IRideService>(
                new Uri("fabric:/TaxiService/RideService"));

            var response = await statelessProxy.GetAllCreatedRides();

            return Ok(response);
        }

        [HttpGet]
        [Route("getEstimatedDrive/{rideId}")]
        public async Task<IActionResult> GetEstimatedDrive(int rideId)
        {
            var statelessProxy = ServiceProxy.Create<IRideService>(
                new Uri("fabric:/TaxiService/RideService"));

            var response = await statelessProxy.GetEstimatedDrive(rideId);

            if (response == -1)
            {
                return NotFound(new { message = "Estimated drive not available" });
            }
            return Ok(response);
        }

        [HttpGet]
        [Route("getEstimatedDriveAndDriverId/{rideId}")]
        public async Task<IActionResult> GetEstimatedDriveAndDriverId(int rideId)
        {
            var statelessProxy = ServiceProxy.Create<IRideService>(
                new Uri("fabric:/TaxiService/RideService"));

            var (time, driverId) = await statelessProxy.GetEstimatedDriveAndDriverId(rideId);

            if (time == -1 || driverId == -1)
            {
                return NotFound(new { message = "Estimated drive or driverId not available" });
            }

            return Ok(new { Time = time, DriverId = driverId });
        }

        [HttpPost]
        [Route("rateDriver/{driverId}")]
        public async Task<IActionResult> RateDriver(int driverId, [FromBody] int rating)
        {
            var partitionId = driverId % 1;

            var statefulProxy = ServiceProxy.Create<IDriverService>(
                new Uri("fabric:/TaxiService/DriverService"),
                new Microsoft.ServiceFabric.Services.Client.ServicePartitionKey(partitionId));

            var response = await statefulProxy.RateDriver(driverId, rating);

            if (response == "Driver not found")
            {
                return NotFound(new { message = response });
            }

            return Ok(new { message = response });
        }

        [HttpGet]
        [Route("getPreviousRides/{userId}")]
        public async Task<IActionResult> GetPreviousRides(int userId)
        {
            var statelessProxy = ServiceProxy.Create<IRideService>(
                new Uri("fabric:/TaxiService/RideService"));

            var response = await statelessProxy.GetPreviousRides(userId);

            return Ok(response);
        }

        [HttpGet]
        [Route("getPreviousDrives/{driverId}")]
        public async Task<IActionResult> GetPreviousDrives(int driverId)
        {
            var statelessProxy = ServiceProxy.Create<IRideService>(
                new Uri("fabric:/TaxiService/RideService"));

            var response = await statelessProxy.GetPreviousDrives(driverId);

            return Ok(response);
        }

        [HttpGet]
        [Route("getVerificationStatus/{driverId}")]
        public async Task<IActionResult> GetVerificationStatus(int driverId)
        {
            var partitionId = driverId % 1;

            var statefulProxy = ServiceProxy.Create<IDriverService>(
                new Uri("fabric:/TaxiService/DriverService"),
                new Microsoft.ServiceFabric.Services.Client.ServicePartitionKey(partitionId));

            var response = await statefulProxy.GetVerificationStatus(driverId);

            if (response == "Driver not found")
                return NotFound(response);

            return Ok(response);
        }

        [HttpGet]
        [Route("getAllRides")]
        public async Task<IActionResult> GetAllRides()
        {
            var statelessProxy = ServiceProxy.Create<IRideService>(
                new Uri("fabric:/TaxiService/RideService"));

            var response = await statelessProxy.GetAllRides();

            return Ok(response);
        }

        [HttpGet]
        [Route("getAllDrivers")]
        public async Task<IActionResult> GetAllDrivers()
        {
            var partitionId = 1 % 1;

            var statefulProxy = ServiceProxy.Create<IDriverService>(
                new Uri("fabric:/TaxiService/DriverService"),
                new Microsoft.ServiceFabric.Services.Client.ServicePartitionKey(partitionId));

            var response = await statefulProxy.GetAllDrivers();

            if (response == null)
                return NotFound(new { message = "No drivers found" });

            return Ok(response);
        }

        [HttpPost]
        [Route("blockDriver")]
        public async Task<IActionResult> BlockDriver([FromBody] int id)
        {
            var partitionId = id % 1;

            var statefulProxy = ServiceProxy.Create<IDriverService>(
                new Uri("fabric:/TaxiService/DriverService"),
                new Microsoft.ServiceFabric.Services.Client.ServicePartitionKey(partitionId));

            var response = await statefulProxy.BlockDriver(id);

            if (response == "Driver not found")
                return NotFound(new { message = response });

            return Ok(response);
        }

        [HttpPost]
        [Route("unblockDriver")]
        public async Task<IActionResult> UnBlockDriver([FromBody] int id)
        {
            var partitionId = id % 1;

            var statefulProxy = ServiceProxy.Create<IDriverService>(
                new Uri("fabric:/TaxiService/DriverService"),
                new Microsoft.ServiceFabric.Services.Client.ServicePartitionKey(partitionId));

            var response = await statefulProxy.UnblockDriver(id);

            if (response == "Driver not found")
                return NotFound(new { message = response });

            return Ok(response);
        }
    }
}
