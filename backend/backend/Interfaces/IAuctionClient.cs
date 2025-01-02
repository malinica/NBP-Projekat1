using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataLayer.DTOs.OfferDTOs;

namespace backend.Interfaces
{
    public interface IAuctionClient
    {
        Task ReceiveMessage(string message, bool isSuccess);
        Task ReceiveOffers(List<OfferResultDTO> offers);
        Task UpdateAuctionCurrentPrice(int price);
    }
}