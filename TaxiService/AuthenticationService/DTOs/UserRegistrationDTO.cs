using System.Fabric.Management.ServiceModel;
using System.Text.Json.Serialization;

namespace AuthenticationService.DTOs
{
    public class UserRegistrationDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set;}
        public string Address { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Password2 { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public UserType UserType { get; set; }
        public string Avatar { get; set; }

        

    }

    public enum UserType
    {
        Admin,
        User,
        Driver
    }
}
