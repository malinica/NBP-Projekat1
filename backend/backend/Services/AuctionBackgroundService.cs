using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class AuctionBackgroundService : BackgroundService
    {
        private readonly IServiceProvider serviceProvider;

        public AuctionBackgroundService(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var auctionService = scope.ServiceProvider.GetRequiredService<AuctionService>();
                        await auctionService.ProcessExpiredAuctions();
                    }
                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
        }
    }
}