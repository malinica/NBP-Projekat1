using DataLayer.DTOs.OfferDTOs;

namespace DataLayer.Models
{
    public class Offer
    {
        [Key]
        public int ID {get;set;}
        public required int Price {get;set;}
        public required DateTime OfferedAt {get;set;}

        // [InverseProperty("OfferList")]
        // public Auction? DuringAuction {get;set;} 

        public Offer()
        {

        }

        public Offer(CreateOfferDTO offer)
        {
            ID = offer.ID;
            Price = offer.Price;
            OfferedAt = offer.OfferedAt;
        }

        public Offer(int id, int price, DateTime offeredAt)
        {
            ID = id;
            Price = price;
            OfferedAt = offeredAt;
        }

    }
}