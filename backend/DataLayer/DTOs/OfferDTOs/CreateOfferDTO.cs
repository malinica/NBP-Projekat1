using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataLayer.DTOs.OfferDTOs
{
    public class CreateOfferDTO
    {
        public int ID {get;set;}
        public required int Price {get;set;}
        public required DateTime OfferedAt {get;set;}
    }
}