using TekProvider.Shared.Entities;

namespace TekProvider.Auth.Services;

public interface ITokenService
{
    string GenerateToken(User user);
    bool ValidateToken(string token);
    int? GetUserIdFromToken(string token);
}