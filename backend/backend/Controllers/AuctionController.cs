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

        [HttpPost("set")]
        public ActionResult<string> Set([FromBody] CreateAuctionDTO auction, string username)
        {
            try
            {
                bool result = auctionService.Set(auction, username);

                if (result)
                    return Ok("Auction's data has been successfully saved.");

                return BadRequest("Auction's data has not been successfully saved.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("auction/{key}")]
        public ActionResult<Auction> Get(string key)
        {
            try
            {
                var auction = auctionService.Get(key);

                if (auction != null)
                {
                    return Ok(auction);
                }
                return NotFound("Auction with the specified key is not found.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("auction/LeaderboardMostPlacedAuctions")]
        public IActionResult LeaderboardMostPlacedAuctions()
        {
            try
            {
                var auctions = auctionService.LeaderboardMostPlacedAuctions();

                if (auctions != null && auctions.Any())
                {
                    return Ok(auctions);
                }
                return NotFound("Error in loading Leaderboard for users with the highest auction");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("auction/LeaderboardAuctionsBasedOnTimeExpiring/{fromPosition}/{N}")]
        public IActionResult LeaderboardAuctionsBasedOnTimeExpiring(int fromPosition, int N)
        {
            try
            {
                var auctions = auctionService.LeaderboardAuctionsBasedOnTimeExpiring(fromPosition, N);

                if (auctions != null && auctions.Any())
                {
                    return Ok(auctions);
                }
                return NotFound("Error in loading Leaderboard for auctions based on time expiring");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}