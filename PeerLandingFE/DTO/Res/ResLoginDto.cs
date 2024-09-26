namespace PeerLandingFE.DTO.Res
{
    public class ResLoginDto
    {
        public class LoginResponse
        {
            public bool Success { get; set; }
            public string Message { get; set; }
            public UserData data { get; set; }
        }
        public class UserData
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public string Role { get; set; }
            public string jwtToken { get; set; }
        }
    }
}
