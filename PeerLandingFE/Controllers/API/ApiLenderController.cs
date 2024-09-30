using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req;
using PeerLandingFE.DTO.Req.Loan;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLandingFE.Controllers.API
{
    public class ApiLenderController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiLenderController (HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetBalance(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("User ID cannot be null or empty!");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7267/rest/v1/user/GetUserById?id={id}");

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("Failed to fetch balance");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBorrowers(string status)
        {
            //var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            //_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7267/rest/v1/loan/GetAllLoans");

            if (response.IsSuccessStatusCode)
            {
                var responsedata = await response.Content.ReadAsStringAsync();
                return Ok(responsedata);
            }
            else
            {
                return BadRequest("Get data failed");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateBalance(string id, [FromBody] ReqUpdateBalanceDto reqUpdateBalanceDto)
        {
            if (reqUpdateBalanceDto == null)
            {
                return BadRequest("Invalid user data");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqUpdateBalanceDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"https://localhost:7267/rest/v1/user/UpdateBalance/{id}", content);

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("Failed to update user");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateStatusBorrower(string id, [FromBody] string status)
        {
            if (status != "requested" || status != "funded")
            {
                return BadRequest("Invalid status borrower");
            }

            var json = JsonSerializer.Serialize(status);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"https://localhost:7267/rest/v1/loan/UpdateLoan/{id}", content);

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("Failed to update user");
            }
        }

		[HttpGet]
		public async Task<IActionResult> GetHistoryBorrowers(string lenderId)
		{
			//var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
			//_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

			var response = await _httpClient.GetAsync($"https://localhost:7267/rest/v1/funding/GetHistoryLoans?lenderId={lenderId}");

			if (response.IsSuccessStatusCode)
			{
				var responsedata = await response.Content.ReadAsStringAsync();
				return Ok(responsedata);
			}
			else
			{
				return BadRequest("Get data failed");
			}
		}

		[HttpPost]
		public async Task<IActionResult> FundingLoan(string loanId, string lenderId)
		{
			if (loanId == null || lenderId == null)
			{
				return BadRequest("Invalid user data!");
			}

            //var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            //_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var newFundingData = new ReqFundingLoanDto
            {
                lenderId = lenderId,
                loanId = loanId
            };

			var json = JsonSerializer.Serialize(newFundingData);
			var content = new StringContent(json, Encoding.UTF8, "application/json");

			var response = await _httpClient.PostAsync($"https://localhost:7267/rest/v1/funding/ProcessFunding?loanId={loanId}&lenderId={lenderId}", content);

			if (response.IsSuccessStatusCode)
			{
				var jsonData = await response.Content.ReadAsStringAsync();
				return Ok(jsonData);
			}
			else
			{
				return BadRequest("Failed to register user.");
			}
		}
	}
}
