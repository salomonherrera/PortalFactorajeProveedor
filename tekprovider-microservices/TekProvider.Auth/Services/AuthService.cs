using AutoMapper;
using TekProvider.Auth.DTOs;
using TekProvider.Shared.Entities;
using TekProvider.Shared.Interfaces;

namespace TekProvider.Auth.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AuthService(IUnitOfWork unitOfWork, ITokenService tokenService, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _mapper = mapper;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        // For demo purposes, we'll use simple validation
        // In production, you should hash passwords
        if (loginDto.Username == "admin" && loginDto.Password == "admin")
        {
            var user = await _unitOfWork.Users.FirstOrDefaultAsync(u => u.Email == "admin@serviciosempresariales.com");
            
            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Usuario no encontrado"
                };
            }

            var token = _tokenService.GenerateToken(user);
            var userInfo = _mapper.Map<UserInfoDto>(user);

            return new AuthResponseDto
            {
                Success = true,
                Token = token,
                User = userInfo,
                Message = "Login exitoso"
            };
        }

        return new AuthResponseDto
        {
            Success = false,
            Message = "Credenciales inválidas"
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        // Check if user already exists
        var existingUser = await _unitOfWork.Users.FirstOrDefaultAsync(u => 
            u.Email == registerDto.Email || u.RFC == registerDto.RFC);

        if (existingUser != null)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "El usuario ya existe"
            };
        }

        var user = new User
        {
            CompanyName = registerDto.CompanyName,
            RFC = registerDto.RFC,
            Email = registerDto.Email,
            Phone = registerDto.Phone,
            ProviderCode = $"PROV-{DateTime.Now.Ticks.ToString().Substring(0, 6)}",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);
        var userInfo = _mapper.Map<UserInfoDto>(user);

        return new AuthResponseDto
        {
            Success = true,
            Token = token,
            User = userInfo,
            Message = "Registro exitoso"
        };
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        return _tokenService.ValidateToken(token);
    }

    public async Task<UserInfoDto?> GetUserInfoAsync(int userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        return user != null ? _mapper.Map<UserInfoDto>(user) : null;
    }
}