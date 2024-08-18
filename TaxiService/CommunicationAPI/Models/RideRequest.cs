namespace CommunicationAPI.Models
{
    public class RideRequest
    {
        public int UserId { get; set; }
        public string StartAddress { get; set; }
        public string EndAddress { get; set; }

        public double Price { get; set; }
        public int WaitTime { get; set; }
    }
}
