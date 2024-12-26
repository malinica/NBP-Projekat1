using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public sealed class AuctionHub : Hub<IAuctionClient>
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.All.ReceiveMessage($"{Context.ConnectionId} has joined");
        }

        public async Task SendMessage(string message) {
            await Clients.All.ReceiveMessage($"{Context.ConnectionId}: {message}");
        }
    }
}