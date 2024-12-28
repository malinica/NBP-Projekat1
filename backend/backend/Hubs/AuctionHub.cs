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

        public override async Task OnConnectedAsync()
        {
            await Clients.All.ReceiveMessage($"{Context.ConnectionId} has joined");
            var userId = Context.UserIdentifier;
        }

        public void SubscribeToAuction(SubscribeToAuctionDTO auctionDTO) {
            offerService.SubscribeToAuction(auctionDTO.AuctionId, async (channel, message) =>
            {
                var offers = JsonConvert.DeserializeObject<List<OfferResultDTO>>(message);
                await Clients.All.ReceiveOffers(offers!);
            });
        }

        public async Task SendMessage(string message) {
            await Clients.All.ReceiveMessage($"{Context.ConnectionId}: {message}");
        }

        public async Task CreateOffer(CreateOfferDTO offerDTO) {
            offerService.Create(offerDTO);
            List<OfferResultDTO> topOffers = await offerService.GetOffersForAuction(offerDTO.AuctionId, 10);
            offerService.PublishNewOffers(offerDTO.AuctionId, topOffers);
            //await Clients.All.ReceiveMessage($"{Context.ConnectionId} je napravio ponudu za aukciju {offerDTO.AuctionId} u iznosu od {offerDTO.Price}");
        }
    }
}