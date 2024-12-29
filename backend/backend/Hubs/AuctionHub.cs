using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using DataLayer.DTOs.AuctionDTOs;
using DataLayer.DTOs.OfferDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace backend.Hubs
{
    public sealed class AuctionHub : Hub<IAuctionClient>
    {
        private readonly OfferService offerService;
 
        public AuctionHub(OfferService offerService) {
            this.offerService = offerService;
        }

        public async Task JoinAuctionGroup(string auctionId) {
            await Groups.AddToGroupAsync(Context.ConnectionId, auctionId);
        }

        public async Task LeaveAuctionGroup(string auctionId) {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, auctionId);
        }

        public async Task CreateOffer(CreateOfferDTO offerDTO) {
            try {
                offerService.Create(offerDTO);
                List<OfferResultDTO> topOffers = await offerService.GetOffersForAuction(offerDTO.AuctionId, 10);
                offerService.PublishNewOffers(offerDTO.AuctionId, topOffers);
                await Clients.Groups(offerDTO.AuctionId).ReceiveMessage("Kreirana je nova ponuda.", true);
            } catch(Exception ex) {
                await Clients.Caller.ReceiveMessage(ex.Message, false);
            }
        }
    }
}