using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataLayer.DTOs;
using DataLayer.DTOs.OfferDTOs;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfferController : ControllerBase
    {
        private readonly OfferService offerService;

        public OfferController(OfferService offerService)
        {
            this.offerService = offerService;
        }

        [HttpPost("create")]
        public ActionResult<string> Create([FromBody] CreateOfferDTO offer)
        {
            try
            {
                bool result = offerService.Set(offer);

                if (result)
                    return Ok("Uspešno dodata ponuda.");
                
                return BadRequest("Greška prilikom dodavanja ponude.");
            }
            catch (Exception)
            {
                return BadRequest("Greška prilikom dodavanja ponude.");
            }
        }

        [HttpGet("{auctionId}/{count}")]
        public ActionResult<List<Offer>> Get(int auctionId, int count)
        {
            try
            {
                var offers = offerService.GetOffersForAuction(auctionId, count);

                return offers;
            }
            catch (Exception)
            {
                return BadRequest("Došlo je do greške prilikom učitavanja ponuda za aukciju.");
            }
        }

        [HttpDelete("{auctionId}")]
        public ActionResult Delete(int auctionId) {
            try
            {
                bool result = offerService.DeleteOffersForAuction(auctionId);

                if(result)
                    return Ok("Uspešno brisanje svih ponuda.");

                return BadRequest("Neuspešno brisanje ponuda.");
                
            }
            catch (Exception)
            {
                return BadRequest("Došlo je do greške prilikom brisanja ponuda.");
            }
        }
    }
}