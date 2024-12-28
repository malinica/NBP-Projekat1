using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataLayer.DTOs.AuctionDTOs
{
    public class SubscribeToAuctionDTO
    {
        public required string AuctionId { get; set; }
        public required string UserId { get; set; }
    }
}