using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req;
using PeerLandingFE.DTO.Req.Loan;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLandingFE.Controllers.API
{
    public class ApiBorrowerController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiBorrowerController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetLoanByBorrowerId(string borrowerId)
        {
            var response = await _httpClient.GetAsync($"https://localhost:7267/rest/v1/loan/GetLoansByBorrowerId?borrowerId={borrowerId}");

            if (response.IsSuccessStatusCode)
            {
                var responsedata = await response.Content.ReadAsStringAsync();
                return Ok(responsedata);
            }
            else
            {
                return BadRequest("Login failed");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddNewLoan([FromBody] ReqLoanDto reqLoanDto)
        {
            if (reqLoanDto == null)
            {
                return BadRequest("Invalid data!");
            }

            //var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            //_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqLoanDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://localhost:7267/rest/v1/loan/AddNewLoan", content);

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("Failed to add new loan.");
            }
        }

		[HttpGet]
		public async Task<IActionResult> GetPaymentById(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest("User ID cannot be null or empty!");
			}

			//var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
			//_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

			var response = await _httpClient.GetAsync($"https://localhost:7267/rest/v1/loan/GetLoanById?id={id}");

			if (response.IsSuccessStatusCode)
			{
				var jsonData = await response.Content.ReadAsStringAsync();
				return Ok(jsonData);
			}
			else
			{
				return BadRequest("Failed to get data");
			}
		}

		[HttpPost]
		public async Task<IActionResult> ProcessLoanPayment(string loanId, decimal amountOfPayment)
        {
			if (loanId == null || amountOfPayment == 0)
			{
				return BadRequest("Invalid data!");
			}

            //var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            //_httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var paymentData = new ReqLoanPayment
            {
                loanId = loanId,
                amountOfPayment = amountOfPayment
            };

			var json = JsonSerializer.Serialize(paymentData);
			var content = new StringContent(json, Encoding.UTF8, "application/json");

			var response = await _httpClient.PostAsync($"https://localhost:7267/rest/v1/loan/ProcessLoanPayment?loanId={loanId}&amountOfPayment={amountOfPayment}", content);

            Console.WriteLine($"response : {response}");

			if (response.IsSuccessStatusCode)
			{
                Console.WriteLine($"response : berhasil");
                var jsonData = await response.Content.ReadAsStringAsync();
				return Ok(jsonData);
			}
			else
			{
                Console.WriteLine($"response : gagal");
                return BadRequest("Failed to pay the loan.");
			}
		}
	}
}
