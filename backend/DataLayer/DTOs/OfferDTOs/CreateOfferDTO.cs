using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataLayer.DTOs.OfferDTOs
{
    public class CreateOfferDTO
    {
        public required int Price { get; set; }
        public required DateTime OfferedAt { get; set; }
        public required string UserId { get; set; }
        public required string AuctionId { get; set; }
    }
}