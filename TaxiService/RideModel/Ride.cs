namespace RideModel
{
    public class Ride
    {
        public int RideID { get; set; }
        public int UserID { get; set; }
        public int DriverID { get; set; }
        public string StartLocation { get; set; }
        public string EndLocation { get; set; }
        public double EstimatedPrice { get; set; }
        public RideStatus Status { get; set; }
        public int EstimatedWait { get; set; }  //sekunde
        public int EstimatedDrive { get; set; } //sekunde
    }

    public enum RideStatus
    {
        Created,
        Accepted,
        Ongoing,
        Completed
    }
}
