using AspNetAuth.Interfaces;
using AspNetAuth.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AspNetAuth.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Invalid model state",
                Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
            });
        }

        var result = await _authService.RegisterUserAsync(model);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Invalid model state",
                Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
            });
        }

        var result = await _authService.LoginUserAsync(model);
        
        if (result.Success && result.User != null)
        {
            // Generate JWT token
            var token = _authService.GenerateJwtToken(result.User.Id, result.User.Email);
            
            // Set HTTP-only cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Set to false for HTTP in development
                SameSite = SameSiteMode.Lax, // Changed to Lax for cross-origin requests
                Expires = DateTime.UtcNow.AddHours(24)
            };
            
            Response.Cookies.Append("auth-token", token, cookieOptions);
            
            return Ok(result);
        }

        return Unauthorized(result);
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("auth-token");
        
        return Ok(new AuthResponse
        {
            Success = true,
            Message = "Logged out successfully"
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new AuthResponse
            {
                Success = false,
                Message = "User not authenticated"
            });
        }

        var userInfo = await _authService.GetUserInfoAsync(userId);
        
        if (userInfo == null)
        {
            return NotFound(new AuthResponse
            {
                Success = false,
                Message = "User not found"
            });
        }

        return Ok(new AuthResponse
        {
            Success = true,
            Message = "User info retrieved successfully",
            User = userInfo
        });
    }

    [HttpGet("check")]
    public IActionResult CheckAuth()
    {
        var token = Request.Cookies["auth-token"];
        
        if (string.IsNullOrEmpty(token))
        {
            return Ok(new AuthResponse
            {
                Success = false,
                Message = "Not authenticated"
            });
        }

        return Ok(new AuthResponse
        {
            Success = true,
            Message = "Authenticated"
        });
    }
}