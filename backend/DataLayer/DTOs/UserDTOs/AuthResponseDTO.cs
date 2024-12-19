using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataLayer.Enums;

namespace DataLayer.DTOs.UserDTOs
{
    public class AuthResponseDTO
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Token { get; set; }
        public Role Role { get; set; }
    }
}