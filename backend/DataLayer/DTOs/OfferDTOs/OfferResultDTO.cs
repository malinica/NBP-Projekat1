using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataLayer.DTOs.OfferDTOs
{
    public class OfferResultDTO
    {
        public required string ID {get;set;}
        public required int Price {get;set;}
        public required DateTime OfferedAt {get;set;}
        public User? User { get; set; }
    }
}