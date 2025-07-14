namespace TekProvider.Auth.DTOs;

public class AuthResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Token { get; set; }
    public UserInfoDto? User { get; set; }
}

public class UserInfoDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string RFC { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string ProviderCode { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}