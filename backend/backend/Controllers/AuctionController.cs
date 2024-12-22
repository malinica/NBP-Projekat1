using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataLayer.DTOs;
using DataLayer.DTOs.AuctionDTOs;
namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        private readonly AuctionService auctionService;
        public AuctionController(AuctionService auctionService)
        {
            this.auctionService = auctionService;
        }

        [HttpPost("auction/{key}")]
        public string Set(string key, [FromBody]CreateAuctionDTO auction)
        {
            bool result = auctionService.Set(key, auction);
            if(result)
                return "Auction's data has been successfully saved.";
            return "Auction's data has not been successfully saved.";
        }

        [HttpGet("auction/{key}")]
        public IActionResult Get(string key)
        {
            var auction = auctionService.Get(key);

            if (auction != null)
            {
                return Ok(auction);
            }
            return NotFound("Auction with the specified key is not found.");
        }

        [HttpGet("auction/LeaderboardMostPlacedAuctions")]
        public IActionResult LeaderboardMostPlacedAuctions()
        {
            var auctions = auctionService.LeaderboardMostPlacedAuctions();

            if (auctions != null && auctions.Any())
            {
                return Ok(auctions);
            }
            return NotFound("Error in loading Leaderboard for users with the highest auction");
        }
        [HttpGet("auction/LeaderboardAuctionsBasedOnTimeExpiring")]
        public IActionResult LeaderboardAuctionsBasedOnTimeExpiring()
        {
            var auctions = auctionService.LeaderboardAuctionsBasedOnTimeExpiring();

            if (auctions != null && auctions.Any())
            {
                return Ok(auctions);
            }
            return NotFound("Error in loading Leaderboard for auctions based on time expiring");
        }
    }
}