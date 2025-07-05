using AspNetAuth.Models;
using Microsoft.AspNetCore.Identity;

namespace AspNetAuth.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterUserAsync(RegisterModel model);
    Task<AuthResponse> LoginUserAsync(LoginModel model);
    Task<UserInfo?> GetUserInfoAsync(string userId);
    string GenerateJwtToken(string userId, string email);
} 