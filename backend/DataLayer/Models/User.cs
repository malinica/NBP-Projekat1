using DataLayer.Enums;
using Microsoft.AspNetCore.Identity;

namespace DataLayer.Models
{
    public class User : IdentityUser
    {
        public Role Role { get; set; }

        [InverseProperty("Author")]
        public List<Item>? CreatedItems { get; set; }
        
        [InverseProperty("AuctionWinner")]
        public List<Item>? WonItems { get; set; }
    }
}