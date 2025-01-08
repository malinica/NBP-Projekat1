using DataLayer.Enums;

namespace DataLayer.DTOs.AuctionDTOs
{
    public class UpdateAuctionDTO
    {
        public required string Title {get;set;}
        public required int StartingPrice {get;set;}
        public required DateTime DueTo {get;set;}
    }
}