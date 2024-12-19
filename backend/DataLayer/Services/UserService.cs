using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using DataLayer.Context;
using DataLayer.DTOs.UserDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DataLayer.Services
{
    public class UserService
    {
        private readonly UserManager<User> userManager;
        private readonly ProjectContext context;
        private readonly TokenService tokenService;

        public UserService(UserManager<User> userManager, ProjectContext context, TokenService tokenService)
        {
            this.userManager = userManager;
            this.context = context;
            this.tokenService = tokenService;
        }

        public async Task<AuthResponseDTO> Register(RegistrationRequestDTO request)
        {
            var appUser = new User { 
                UserName = request.Username,
                Email = request.Email, 
                Role = Enums.Role.User 
            };

            var result = await userManager.CreateAsync(
                appUser,
                request.Password!
            );

            if (result.Succeeded)
            {
                request.Password = "";
                return new AuthResponseDTO
                {
                    Username = appUser.UserName,
                    Email = appUser.Email,
                    Token = tokenService.CreateToken(appUser),
                    Role=appUser.Role
                };
            }

            if(result.Errors.Count() > 0)
                throw new Exception(result.Errors.ToList()[0].Description);

            throw new Exception("Došlo je do greške prilikom kreiranja naloga.");
        }


        public async Task<AuthResponseDTO> Login(LoginRequestDTO request)
        {
            var managedUser = await userManager.FindByEmailAsync(request.Email!);
            if (managedUser == null)
                throw new Exception("Neispravan email ili lozinka");

            var isPasswordValid = await userManager.CheckPasswordAsync(managedUser, request.Password!);
            if (!isPasswordValid)
                throw new Exception("Neispravan email ili lozinka");

            var userInDb = context.Users.FirstOrDefault(u => u.Email == request.Email);

            if (userInDb is null)
            {
                throw new Exception("Ne postoji zadati korisnik.");
                // return Unauthorized();
            }

            var accessToken = tokenService.CreateToken(userInDb);

            return new()
            {
                Username = userInDb.UserName,
                Email = userInDb.Email,
                Token = accessToken,
                Role=userInDb.Role  
            };
        }
    }
}