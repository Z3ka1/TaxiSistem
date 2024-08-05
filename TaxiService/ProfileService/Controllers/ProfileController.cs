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
                    DateOfBirth = profileDTO.DateOfBirth.ToShortDateString(),
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

        [HttpGet("{id}")]
        public IActionResult GetUserProfileById(int id)
        {
            try
            {
                var userProfile = _dbContext.Profiles.FirstOrDefault(p => p.Id == id);

                if (userProfile == null) 
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(new
                {
                    Data = new
                    {
                        userProfile.FirstName,
                        userProfile.LastName,
                        userProfile.Address,
                        userProfile.DateOfBirth,
                        userProfile.Email,
                        userProfile.Avatar
                    }
                });
            }
            catch(Exception e)
            {
                return StatusCode(500, new { message = $"Internal server error: {e.Message}" });
            }
        }

        [HttpPost("update")]
        public IActionResult UpdateProfileInfo([FromBody] UserProfileDTO profileDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var profile = _dbContext.Profiles.FirstOrDefault(p => p.Id == profileDTO.UserID);
                if (profile == null)
                {
                    return NotFound(new { message = "User profile not found" });
                }

                profile.FirstName = profileDTO.FirstName ?? profile.FirstName;
                profile.LastName = profileDTO.LastName ?? profile.LastName;
                profile.Address = profileDTO.Address ?? profile.Address;
                profile.DateOfBirth = profileDTO.DateOfBirth.ToShortDateString() ?? profile.DateOfBirth;
                profile.Email = profileDTO.Email ?? profile.Email;
                profile.Avatar = profileDTO.Avatar ?? profile.Avatar;

                _dbContext.SaveChanges();
                return Ok(new { message = "Profile updated!", user = profile });
            }
            catch(Exception e)
            {
                return StatusCode(500, new { message = $"Internal server error: {e.Message}" });
            }
        }

    }
}
