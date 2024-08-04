using AuthenticationService.Data;
using AuthenticationService.DTOs;
using AuthenticationService.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;

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

                #region Obrada za autentifikaciju
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if(UsernameExists(userDTO.Username))
                {
                    return BadRequest(new { message = "Username already exists" });
                }

                int newUserId = _dbContext.Credentials.Count() + 1;
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDTO.Password);

                var newCredentials = new Credentials
                {
                    Id = newUserId,
                    Username = userDTO.Username,
                    PasswordHash = hashedPassword,
                    UserType = userDTO.UserType
                };
                
                
                _dbContext.Credentials.Add(newCredentials);
                _dbContext.SaveChanges();
                #endregion

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
                    //Brisanje podataka o kredencijalima ukoliko nisu sacuvani podaci o profilu kroz drugi servis
                    _dbContext.Credentials.Remove(newCredentials);
                    _dbContext.SaveChanges();
                    return StatusCode((int)response.StatusCode, new { message = "Failed to create user profile" });
                }


            }
            catch(Exception e)
            {
                return StatusCode(500, new { message = $"Internal server error: {e.Message}" });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO loginDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var creds = _dbContext.Credentials.FirstOrDefault(c => c.Username == loginDTO.Username);
                if (creds == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Password, creds.PasswordHash))
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                return Ok(new
                {
                    User = new
                    {
                        creds.Id,
                        creds.Username,
                        creds.UserType
                    }
                });
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
