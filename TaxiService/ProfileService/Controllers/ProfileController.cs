using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProfileService.Data;
using ProfileService.DTOs;
using ProfileService.Models;
using System.Net.Mail;
using System.Net;
using Microsoft.EntityFrameworkCore.Storage.Json;

namespace ProfileService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<ProfileController> _logger;
        private readonly IHttpClientFactory _clientFactory;

        public ProfileController(ILogger<ProfileController> logger, AppDbContext dbContext, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _dbContext = dbContext;
            _clientFactory = clientFactory;
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

                string fileName = Path.GetFileName(profileDTO.Avatar);

                profile.FirstName = profileDTO.FirstName ?? profile.FirstName;
                profile.LastName = profileDTO.LastName ?? profile.LastName;
                profile.Address = profileDTO.Address ?? profile.Address;
                profile.DateOfBirth = profileDTO.DateOfBirth.ToShortDateString() ?? profile.DateOfBirth;
                profile.Email = profileDTO.Email ?? profile.Email;
                profile.Avatar = fileName ?? profile.Avatar;

                _dbContext.SaveChanges();
                return Ok(new { message = "Profile updated!", user = profile });
            }
            catch(Exception e)
            {
                return StatusCode(500, new { message = $"Internal server error: {e.Message}" });
            }
        }

        [HttpPost("returnPendingDrivers")]
        public async  Task<IActionResult> ReturnPendingDrivers()
        {
            var client = _clientFactory.CreateClient();
            var response = await client.GetAsync("http://localhost:8246/communication/returnPending");

            if(!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Failed to retrieve IDs of Drivers that have status = Pending");
            }

            var ids = await response.Content.ReadFromJsonAsync<List<int>>();

            if(ids == null)
            {
                return NotFound("No profiles found with provided IDs.");
            }

            var profiles = _dbContext.Profiles
                .Where(p => ids.Contains(p.Id))
                .ToList();

            if (profiles == null)
            {
                return NotFound("No profiles found with provided IDs.");
            }

            return Ok(profiles);
        }

        [HttpPost("sendEmail")]
        public async Task<IActionResult> SendEmail([FromBody] int id)
        {
            bool isSent = true;
            var profile = _dbContext.Profiles.FirstOrDefault(p => p.Id == id); ;

            if (profile == null)
                return NotFound(new {message = "Email failed to send, profile not found"});

            //isSent = SendEmail(profile.Email, "Taxi system", "Your driver profile is successfully approved! Now you can start driving for our company.");

            if(!isSent)
                return StatusCode(500, new { message = "Email unable to send" });
            return Ok(new {message = "Email sent"});
        }

        public bool SendEmail(string toAddress, string subject, string body)
        {
            try
            {
                using (SmtpClient smtpClient = new SmtpClient("smtp.office365.com", 587))
                {
                    smtpClient.Credentials = new NetworkCredential("sistemrazmene@outlook.com", "razmenanovca123");
                    smtpClient.EnableSsl = true;

                    MailMessage mailMessage = new MailMessage
                    {
                        From = new MailAddress("sistemrazmene@outlook.com"),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = false
                    };

                    mailMessage.To.Add(toAddress);

                    smtpClient.Send(mailMessage);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while sending the email: " + ex.Message);
                return false;
            }
        }


    }
}
