using Communication;
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

    }
}
