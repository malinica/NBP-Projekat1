using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataLayer.DTOs.UserDTOs
{
    public class RegistrationRequestDTO
    {
        [Required]
        public string? Email { get; set; }
        
        [Required]
        public string? Username { get; set; }
        
        [Required]
        public string? Password { get; set; }
    }
}