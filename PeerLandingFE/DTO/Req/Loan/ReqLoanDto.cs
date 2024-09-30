using System.ComponentModel.DataAnnotations;

namespace PeerLandingFE.DTO.Req.Loan
{
    public class ReqLoanDto
    {
        [Required(ErrorMessage = "BorrowerId is required")]
        public string BorrowerId { get; set; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Amount must be a positive value")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Interest rate is required")]
        public decimal InterestRate { get; set; }

        [Required(ErrorMessage = "Duration is required")]
        public int Duration { get; set; } = 12;
    }
}
