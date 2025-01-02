using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataLayer.Enums;

namespace DataLayer.DTOs.ItemDTOs
{
    public class ItemResultDTO
    {
        public required int ID { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set;}
        public required ItemCategory Category {get; set;}
        public required List<string> Pictures {get;set;}
        public User? Author { get; set; }
        public User? AuctionWinner { get; set; }
    }
}