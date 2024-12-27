using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using DataLayer.DTOs.OfferDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    [Authorize]
    public sealed class AuctionHub : Hub<IAuctionClient>
    {
        private readonly OfferService offerService;
 
        public AuctionHub(OfferService offerService) {
            this.offerService = offerService;
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.All.ReceiveMessage($"{Context.ConnectionId} has joined");
        }

        public async Task SendMessage(string message) {
            await Clients.All.ReceiveMessage($"{Context.ConnectionId}: {message}");
        }

        public async Task CreateOffer(CreateOfferDTO offerDTO) {
            offerService.Create(offerDTO);
            await Clients.All.ReceiveMessage($"{Context.ConnectionId} je napravio ponudu za aukciju {offerDTO.AuctionId} u iznosu od {offerDTO.Price}");
        }
    }
}