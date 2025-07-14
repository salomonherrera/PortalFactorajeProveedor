using TekProvider.Auth.DTOs;

namespace TekProvider.Auth.Services;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<bool> ValidateTokenAsync(string token);
    Task<UserInfoDto?> GetUserInfoAsync(int userId);
}