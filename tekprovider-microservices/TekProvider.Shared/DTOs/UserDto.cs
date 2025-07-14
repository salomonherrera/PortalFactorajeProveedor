namespace TekProvider.Shared.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string RFC { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? BankAccount { get; set; }
    public string? BankName { get; set; }
    public string ProviderCode { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateUserDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string RFC { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? BankAccount { get; set; }
    public string? BankName { get; set; }
    public string ProviderCode { get; set; } = string.Empty;
}

public class UpdateUserDto
{
    public string? CompanyName { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? BankAccount { get; set; }
    public string? BankName { get; set; }
}