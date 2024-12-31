using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Hubs;
using backend.Interfaces;
using DataLayer.DTOs;
using DataLayer.DTOs.AuctionDTOs;
using DataLayer.DTOs.OfferDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        private readonly AuctionService auctionService;
        private readonly OfferService offerService;
        private readonly UserService userService;
        private readonly IHubContext<AuctionHub, IAuctionClient> hubContext;

        public AuctionController(AuctionService auctionService, OfferService offerService, UserService userService, IHubContext<AuctionHub, IAuctionClient> hubContext)
        {
            this.auctionService = auctionService;
            this.offerService = offerService;
            this.userService = userService;
            this.hubContext = hubContext;
        }

        [HttpPost("set")]
        public ActionResult<string> Set([FromBody] CreateAuctionDTO auction, string username)
        {
            try
            {
                string auctionID = auctionService.Set(auction, username);

                if (!string.IsNullOrEmpty(auctionID))
                    return Ok(new {id = auctionID});

                return BadRequest("Auction's data has not been successfully saved.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet("{key}")]
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

        [HttpGet("AuctionWithItem/{auctionId}")]
        public async Task<ActionResult<Auction>> GetAuctionWithItem(string auctionId)
        {
            try
            {
                var auction = await auctionService.GetFullAuction(auctionId);

                return Ok(auction);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("LeaderboardMostPlacedAuctions")]
        public IActionResult LeaderboardMostPlacedAuctions()
        {
            try
            {
                var auctions = auctionService.LeaderboardMostPlacedAuctions();

                return Ok(auctions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("LeaderboardAuctionsBasedOnTimeExpiring/{fromPosition}/{N}")]
        public async Task<ActionResult<List<AuctionResultDTO>>> LeaderboardAuctionsBasedOnTimeExpiring(int fromPosition, int N)
        {
            try
            {
                var auctions = await auctionService.GetAuctionsBasedOnTimeExpiring(fromPosition, N);

                return Ok(auctions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("GetAuctionsBidedByUser/{username}")]
        public ActionResult<Auction[]> GetAuctionsBidedByUser(string username)
        {
            try
            {
                var auctions = auctionService.GetAuctionsBidedByUser(username);

                return Ok(auctions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("SubscribeToAuction/{auctionId}")]
        public ActionResult<string> SubscribeToAuction(string auctionId)
        {
            try
            {
                offerService.SubscribeToAuction(auctionId, async (channel, message) =>
                {
                    var offers = JsonConvert.DeserializeObject<List<OfferResultDTO>>(message);
                    await hubContext.Clients.Group(auctionId).ReceiveOffers(offers!);
                });
 
                return Ok("Uspešno praćenje aukcije.");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AddToFavorite/{auctionId}")]
        [Authorize]
        public async Task<IActionResult> AddAuctionToFavorite([FromRoute] string auctionId)
        {
            try
            {
                var user = await userService.GetCurrentUser(User);
                auctionService.AddAuctionToFavorite(user?.Id ?? "", auctionId);
                return Ok("Uspešno dodata aukcija u listu omiljenih.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("RemoveFromFavorite/{auctionId}")]
        [Authorize]
        public async Task<IActionResult> RemoveAuctionFromFavorite([FromRoute] string auctionId)
        {
            try
            {
                var user = await userService.GetCurrentUser(User);
                auctionService.RemoveAuctionFromFavorite(user?.Id ?? "", auctionId);
                return Ok("Uspešno uklonjena aukcija iz liste omiljenih.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetFavoriteAuctions")]
        [Authorize]
        public async Task<ActionResult<List<AuctionResultDTO>>> GetFavoriteAuctions()
        {
            try
            {
                var user = await userService.GetCurrentUser(User);
                var favoriteAuctions = await auctionService.GetFavoriteAuctions(user?.Id ?? "");
                return Ok(favoriteAuctions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //GetAuctionsFromFilter
        [HttpGet("GetAuctionsFromFilter")]
        [Authorize] // ne treba authorize ako je ona stranica pretrage dostupna i neulogovanom korisniku
       public async Task<ActionResult<List<AuctionResultDTO>>> GetAuctionsFromFilter(
    [FromQuery] string? itemName = null,
    [FromQuery] ItemCategory[]? categories = null,
    [FromQuery] int? pricemin = null,
    [FromQuery] int? pricemax = null)
{
    try
    {
        categories ??= Array.Empty<ItemCategory>();
        var result = await auctionService.GetAuctionsFromFilter(itemName, categories, pricemin, pricemax);
        return Ok(result);
    }
    catch (Exception ex)
    {
        return BadRequest(new { message = ex.Message, stackTrace = ex.StackTrace });
    }
}


        [HttpGet("GetAuctionsCreatedBy/{username}")]
        [Authorize]
        public async Task<ActionResult<List<AuctionResultDTO>>> GetAuctionsCreatedByUser(string username)
        {
            try
            {
                var createdAuctions = await auctionService.GetAuctionsCreatedByUser(username);
                return Ok(createdAuctions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}