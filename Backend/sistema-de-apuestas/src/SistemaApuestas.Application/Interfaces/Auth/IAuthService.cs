using SistemaApuestas.Application.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Text;

namespace SistemaApuestas.Application.Interfaces.Auth
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDto request);
        Task<string> LoginAsync(LoginDto request);
    }
}
