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

                return BadRequest("Neuspešno kreiranje aukcije.");
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

        [HttpGet("CanAddToFavorite/{auctionId}")]
        [Authorize]
        public async Task<ActionResult<bool>> CanAddAuctionToFavorite([FromRoute] string auctionId)
        {
            try
            {
                var user = await userService.GetCurrentUser(User);
                var result = auctionService.CanAddAuctionToFavorite(user?.Id ?? "", auctionId);
                return Ok(result);
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
        public async Task<ActionResult<PaginatedResponseDTO<AuctionResultDTO>>> GetFavoriteAuctions(
            [FromQuery] int? page = null, 
            [FromQuery] int? pageSize = null)
        {
            try
            {
                var user = await userService.GetCurrentUser(User);
                var favoriteAuctions = await auctionService.GetFavoriteAuctions(user?.Id ?? "", page ?? 1, pageSize ?? 10);
                return Ok(favoriteAuctions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAuctionsFromFilter")]
        public async Task<ActionResult<List<AuctionResultDTO>>> GetAuctionsFromFilter(
        [FromQuery] string? itemName = null,
        [FromQuery] ItemCategory[]? categories = null,
        [FromQuery] int? minprice = null,
        [FromQuery] int? maxprice = null)
        {
            try
            {
                categories ??= Array.Empty<ItemCategory>();
                var result = await auctionService.GetAuctionsFromFilter(itemName, categories, minprice, maxprice);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message, stackTrace = ex.StackTrace });
            }
        }


        [HttpGet("GetAuctionsCreatedBy/{username}")]
        [Authorize]
        public async Task<ActionResult<PaginatedResponseDTO<AuctionResultDTO>>> GetAuctionsCreatedByUser
        (
            string username, 
            [FromQuery] int? page = null, 
            [FromQuery] int? pageSize = null)
        {
            try
            {
                var createdAuctions = await auctionService.GetAuctionsCreatedByUser(username, page ?? 1, pageSize ?? 10);
                return Ok(createdAuctions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAuctionsBiddederedByUser/{username}")]
        public async Task<ActionResult<List<AuctionResultDTO>>> GetAuctionsBiddederedByUser(string username)
        {
            try
            {
                var result = await auctionService.GetAuctionsBidedByUser(username);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("CanBid/{auctionId}")]
        [Authorize]
        public async Task<ActionResult<bool>> CanBid([FromRoute] string auctionId)
        {
            try
            {
                var user = await userService.GetCurrentUser(User);
                var result = await auctionService.CanBidToAuction(user?.UserName ?? "", auctionId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{auctionId}")]
        [Authorize]
        public IActionResult DeleteAuction([FromRoute] string auctionId)
        {
            try
            {
                var isSuccessful = auctionService.DeleteAuction(auctionId);

                if (isSuccessful)
                {
                    return Ok("Aukcija uspešno obrisana.");
                }
                return BadRequest("Neuspešno brisanje aukcije.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}