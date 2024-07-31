using AuthenticationService.DTOs;

namespace AuthenticationService.Models
{
    public class Credentials
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public UserType UserType { get; set; }

    }

}
