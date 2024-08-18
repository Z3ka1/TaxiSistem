﻿using Microsoft.ServiceFabric.Services.Remoting;
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

    }
}
