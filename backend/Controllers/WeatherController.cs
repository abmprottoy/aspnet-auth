using AspNetAuth.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AspNetAuth.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class WeatherController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    [HttpGet("forecast")]
    public IActionResult GetWeatherForecast()
    {
        var forecast = Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        }).ToArray();

        return Ok(forecast);
    }

    [HttpGet("current")]
    public IActionResult GetCurrentWeather()
    {
        var currentWeather = new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        };

        return Ok(currentWeather);
    }

    [HttpGet("cities")]
    public IActionResult GetCitiesWeather()
    {
        var cities = new[] { "New York", "London", "Tokyo", "Sydney", "Paris" };
        var citiesWeather = cities.Select(city => new
        {
            City = city,
            Weather = new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            }
        }).ToArray();

        return Ok(citiesWeather);
    }
} 