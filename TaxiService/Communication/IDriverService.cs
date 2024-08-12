using Microsoft.ServiceFabric.Services.Remoting;

namespace Communication
{
    public interface IDriverService : IService
    {
        Task<string> GetServiceDetails();
        Task<string> RegisterDriver(int id);

        Task<List<int>> ReturnPendingIds();
        Task<string> ApproveDriver(int id);
        Task<string> RejectDriver(int id);

    }
}
