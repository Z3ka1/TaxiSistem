using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProfileService.Data;
using ProfileService.DTOs;
using ProfileService.Models;

namespace ProfileService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(ILogger<ProfileController> logger, AppDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpPost("create")]
        public IActionResult CreateUserProfile([FromBody] UserProfileDTO profileDTO)
        {
            try
            {
                var userProfile = new Profile
                {
                    Id = profileDTO.UserID,
                    FirstName = profileDTO.FirstName,
                    LastName = profileDTO.LastName,
                    Address = profileDTO.Address,
                    DateOfBirth = profileDTO.DateOfBirth.ToString(),
                    Email = profileDTO.Email,
                    Avatar = profileDTO.Avatar
                };

                

                _dbContext.Profiles.Add(userProfile);
                _dbContext.SaveChanges();
                
                return Ok(new { message = "User profile created successfully" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = $"Internal server error: {e.Message}" });
            }
        }

    }
}
