using SistemaApuestas.Application.DTOs.Auth.LogIn;
using SistemaApuestas.Application.DTOs.Auth.Regiser;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.Interfaces.Auth
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDto request);
        Task<AuthResponseDto> LoginAsync(LoginDto request);
    }
}
