using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace PeerLandingFE.Controllers.API
{
    public class ApiLoginController : Controller
    {
        private readonly HttpClient _HttpClient;

        public ApiLoginController(HttpClient httpClient)
        {
            _HttpClient = httpClient;
        }

        [HttpPost]
        public async Task<IActionResult> Login ([FromBody] LoginRequest loginRequest)
        {
            var json = JsonSerializer.Serialize(loginRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _HttpClient.PostAsync("https://localhost:7267/rest/v1/user/Login", content);

            if (response.IsSuccessStatusCode) { 
                var responsedata = await response.Content.ReadAsStringAsync();
                return Ok(responsedata);
            }
            else
            {
                return BadRequest("Login failed");
            }
        }
    }
}
