using DataLayer.DTOs.OfferDTOs;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;

namespace DataLayer.Models
{
    public class Offer
    {
        [Key]
        public required string ID {get;set;}
        public required int Price {get;set;}
        public required DateTime OfferedAt {get;set;}
        public required string UserId { get; set; }

        // [InverseProperty("OfferList")]
        // public Auction? DuringAuction {get;set;} 

        public Offer()
        {

        }

        public Offer(CreateOfferDTO offer)
        {
            Price = offer.Price;
            OfferedAt = offer.OfferedAt;
        }

        public Offer(int id, int price, DateTime offeredAt)
        {
            Price = price;
            OfferedAt = offeredAt;
        }

    }
}