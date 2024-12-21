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

        [HttpPost("offer/{key}")]
        public string Set(string key, [FromBody]CreateOfferDTO offer)
        {
            bool result = offerService.Set(key, offer);
            if(result)
            {
                return "Uspesno dodat offer";
            }
            else
            {
                return "Greska prilikom dodavanja offera";
            }
        }

        [HttpGet("offer/{key}")]
        public IActionResult Get(string key)
        {
            var offer = offerService.Get(key);
            if(offer != null)
            {
                return Ok(offer);
            }
            else
            {
                return NotFound("Offer sa zadatim kljucem nije pronadjen");
            }
        }
    }
}