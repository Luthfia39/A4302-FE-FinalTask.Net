using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class LenderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ListBorrowers()
        {
            return View();
        }
    }
}
