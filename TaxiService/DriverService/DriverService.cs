using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Communication;
using DriverService.Data;
using DriverService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;

namespace DriverService
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// </summary>
    internal sealed class DriverService : StatefulService, IDriverService
    {
        private readonly AppDbContext _dbContext;

        public DriverService(StatefulServiceContext context, AppDbContext dbContext)
            : base(context)
        {
            _dbContext = dbContext;
        }

        //METODE
        public async Task<string> GetServiceDetails()
        {
            var serviceName = this.Context.ServiceName.ToString();

            var partioionId = this.Context.PartitionId.ToString();

            return $"{serviceName} ::: {partioionId}";
        }

        public async Task<string> RegisterDriver(int id)
        {
            var newDriver = new Driver
            {
                DriverID = id,
                Status = VerificationStatus.Pending,
                Rating = 0,
                NumberOfRatings = 0
            };

            try
            {
                _dbContext.Drivers.Add(newDriver);
                await _dbContext.SaveChangesAsync();
                return "Driver successfully registered";
            }
            catch (Exception e)
            {
                return $"Error registering driver: {e.Message}";
            }
        }

        public async Task<List<int>> ReturnPendingIds()
        {
            var pendingDrivers = await _dbContext.Drivers
                .Where(d => d.Status == VerificationStatus.Pending)
                .Select(d => d.DriverID)
                .ToListAsync();

            return pendingDrivers;
        }

        public async Task<string> ApproveDriver(int id)
        {
            var driver = await _dbContext.Drivers.FirstOrDefaultAsync(d => d.DriverID == id);

            if(driver == null)
            {
                return "Driver not found";
            }

            driver.Status = VerificationStatus.Approved;

            await _dbContext.SaveChangesAsync();

            return "Driver approved!";
        }


        public async Task<string> RejectDriver(int id)
        {
            var driver = await _dbContext.Drivers.FirstOrDefaultAsync(d => d.DriverID == id);

            if (driver == null)
            {
                return "Driver not found";
            }

            driver.Status = VerificationStatus.Rejected;

            await _dbContext.SaveChangesAsync();

            return "Driver rejected!";
        }

        /// <summary>
        /// Optional override to create listeners (e.g., HTTP, Service Remoting, WCF, etc.) for this service replica to handle client or user requests.
        /// </summary>
        /// <remarks>
        /// For more information on service communication, see https://aka.ms/servicefabricservicecommunication
        /// </remarks>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return this.CreateServiceRemotingReplicaListeners();
        }

        /// <summary>
        /// This is the main entry point for your service replica.
        /// This method executes when this replica of your service becomes primary and has write status.
        /// </summary>
        /// <param name="cancellationToken">Canceled when Service Fabric needs to shut down this service replica.</param>
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            // TODO: Replace the following sample code with your own logic 
            //       or remove this RunAsync override if it's not needed in your service.

            var myDictionary = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, long>>("myDictionary");

            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();

                using (var tx = this.StateManager.CreateTransaction())
                {
                    var result = await myDictionary.TryGetValueAsync(tx, "Counter");

                    ServiceEventSource.Current.ServiceMessage(this.Context, "Current Counter Value: {0}",
                        result.HasValue ? result.Value.ToString() : "Value does not exist.");

                    await myDictionary.AddOrUpdateAsync(tx, "Counter", 0, (key, value) => ++value);

                    // If an exception is thrown before calling CommitAsync, the transaction aborts, all changes are 
                    // discarded, and nothing is saved to the secondary replicas.
                    await tx.CommitAsync();
                }

                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }
    }
}
