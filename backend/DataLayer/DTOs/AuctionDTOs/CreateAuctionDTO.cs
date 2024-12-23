using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataLayer.Enums;

namespace DataLayer.DTOs.AuctionDTOs
{
    public class CreateAuctionDTO
    {
        public required string Title {get;set;}
        public required int StartingPrice {get;set;}
        public required int CurrentPrice {get;set;}
        public required AuctionStatus Status {get;set;}
        public required DateTime PostedOnDate {get;set;}
        public required DateTime DueTo {get;set;}
    }
}