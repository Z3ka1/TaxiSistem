using Microsoft.ServiceFabric.Services.Remoting;

namespace Communication
{
    public interface IDriverService : IService
    {
        Task<string> GetServiceDetails();
        Task<string> RegisterDriver(int id);
    }
}
