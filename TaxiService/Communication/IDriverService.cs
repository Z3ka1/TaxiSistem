using Microsoft.ServiceFabric.Services.Remoting;
using SharedModels;
using System.Runtime.InteropServices.Marshalling;

namespace Communication
{
    public interface IDriverService : IService
    {
        Task<string> GetServiceDetails();
        Task<string> RegisterDriver(int id);

        Task<List<int>> ReturnPendingIds();
        Task<string> ApproveDriver(int id);
        Task<string> RejectDriver(int id);

        Task<string> RateDriver(int id, int rating);
        Task<string> GetVerificationStatus(int id);
        Task<List<Driver>> GetAllDrivers();
        Task<string> BlockDriver(int id);
        Task<string> UnblockDriver(int id);
    }
}
