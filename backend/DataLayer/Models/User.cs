using DataLayer.Enums;
using Microsoft.AspNetCore.Identity;

namespace DataLayer.Models
{
    public class User : IdentityUser
    {
          public Role Role { get; set; }
    }
}