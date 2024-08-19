using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedModels
{
    public class Driver
    {
        public int DriverID { get; set; }
        public VerificationStatus Status { get; set; }
        public double Rating { get; set; }
        public int NumberOfRatings { get; set; }

    }

    public enum VerificationStatus
    {
        Pending,
        Approved,
        Rejected,
        Blocked
    }
}
