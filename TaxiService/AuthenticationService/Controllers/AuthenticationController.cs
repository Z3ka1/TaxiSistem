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

        public AuthenticationController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        public IActionResult RegisterUser([FromBody] UserRegistrationDTO userDTO)
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

                _dbContext.Credentials.Add(newCredentials);
                _dbContext.SaveChanges();

                return Ok(new { message = "User registered successfully" });
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
