using AspNetAuth.Interfaces;
using AspNetAuth.Entities;
using AspNetAuth.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AspNetAuth.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthService(
            UserManager<ApplicationUser> userManager, 
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        public async Task<AuthResponse> RegisterUserAsync(RegisterModel model)
        {
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "User already exists",
                    Errors = new List<string> { "A user with this email already exists" }
                };
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                DateOfBirth = model.DateOfBirth,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            
            if (result.Succeeded)
            {
                return new AuthResponse
                {
                    Success = true,
                    Message = "User registered successfully",
                    User = new UserInfo
                    {
                        Id = user.Id.ToString(),
                        Email = user.Email ?? string.Empty,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        DateOfBirth = user.DateOfBirth,
                        CreatedAt = user.CreatedAt
                    }
                };
            }

            return new AuthResponse
            {
                Success = false,
                Message = "Registration failed",
                Errors = result.Errors.Select(e => e.Description).ToList()
            };
        }

        public async Task<AuthResponse> LoginUserAsync(LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Invalid email or password",
                    Errors = new List<string> { "Invalid credentials" }
                };
            }

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
            
            if (result.Succeeded)
            {
                var token = GenerateJwtToken(user.Id.ToString(), user.Email ?? string.Empty);
                
                return new AuthResponse
                {
                    Success = true,
                    Message = "Login successful",
                    User = new UserInfo
                    {
                        Id = user.Id.ToString(),
                        Email = user.Email ?? string.Empty,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        DateOfBirth = user.DateOfBirth,
                        CreatedAt = user.CreatedAt
                    }
                };
            }

            return new AuthResponse
            {
                Success = false,
                Message = "Invalid email or password",
                Errors = new List<string> { "Invalid credentials" }
            };
        }

        public async Task<UserInfo?> GetUserInfoAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            return new UserInfo
            {
                Id = user.Id.ToString(),
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = user.DateOfBirth,
                CreatedAt = user.CreatedAt
            };
        }

        public string GenerateJwtToken(string userId, string email)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(jwtKey))
                throw new InvalidOperationException("JWT Key not configured");
            if (string.IsNullOrEmpty(jwtIssuer))
                throw new InvalidOperationException("JWT Issuer not configured");
            if (string.IsNullOrEmpty(jwtAudience))
                throw new InvalidOperationException("JWT Audience not configured");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}