using AuthenticationService.Data;
using AuthenticationService.DTOs;
using AuthenticationService.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {

        private readonly AppDbContext _dbContext;
        private readonly IHttpClientFactory _clientFactory;

        public AuthenticationController(AppDbContext dbContext, IHttpClientFactory clientFactory)
        {
            _dbContext = dbContext;
            _clientFactory = clientFactory;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationDTO userDTO)
        {
            try
            {
                if(!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if(UsernameExists(userDTO.Username))
                {
                    return BadRequest(new { message = "Username already exists" });
                }

                var newCredentials = new Credentials
                {
                    Id = 1,
                    Username = userDTO.Username,
                    PasswordHash = userDTO.Password,
                    UserType = userDTO.UserType
                };

                
                //TODO: Osmisliti logiku da se ne ubacuje u bazu ako se ne uspesno posalje poruka UserProfile servisu
                _dbContext.Credentials.Add(newCredentials);
                _dbContext.SaveChanges();
                
                
                //Slanje podataka ne vezanih za samu autentifikaciiju drugom servisu
                var profileData = new UserProfileDTO
                {
                    UserID = newCredentials.Id,
                    FirstName = userDTO.FirstName,
                    LastName = userDTO.LastName,
                    Address = userDTO.Address,
                    DateOfBirth = userDTO.DateOfBirth,
                    Email = userDTO.Email,
                    Avatar = userDTO.Avatar
                };

                var client = _clientFactory.CreateClient();
                var response = await client.PostAsJsonAsync("http://localhost:8511/profile/create", profileData);
                
                
                if(response.IsSuccessStatusCode)
                {
                    return Ok(new { message = "User registered successfully" });
                }
                else
                {
                    return StatusCode((int)response.StatusCode, new { message = "Failed to create user profile" });
                }


            }
            catch(Exception e)
            {
                return StatusCode(500, new { message = $"Internal server error: {e.Message}" });
            }
        }


        private bool UsernameExists(string username) 
        {
            return _dbContext.Credentials.Any(u => u.Username == username);
        }


    }
}
