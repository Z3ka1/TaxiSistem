using Microsoft.AspNetCore.Mvc;

namespace RegistrationService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RegistrationController : ControllerBase
    {
        //Metode i logika
        [HttpGet]
        [Route("get")]
        public async Task Get()
        {
            await Task.Delay(TimeSpan.FromSeconds(1));
        }
    }
}
