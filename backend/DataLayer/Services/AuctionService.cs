using ServiceStack.Redis;
using DataLayer.DTOs.AuctionDTOs;
using Newtonsoft.Json;
using System.Text;
using DataLayer.Enums;


namespace DataLayer.Services
{
    public class AuctionService
    {
        readonly RedisClient redis = new RedisClient(Config.SingleHost);
        
        public AuctionService() { }

        public bool Set(CreateAuctionDTO auction, string username)
        {
            Auction i = new Auction()
            {
                ID = Guid.NewGuid().ToString(),
                Title = auction.Title,
                StartingPrice = auction.StartingPrice,
                CurrentPrice = auction.CurrentPrice,
                Status = auction.Status,
                PostedOnDate = auction.PostedOnDate,
                DueTo = auction.DueTo,
            };
            string keyEdited = $"auction:" + i.ID;
            bool status = redis.Set(keyEdited, JsonConvert.SerializeObject(i));
            if (status)
            {
                
                redis.IncrementItemInSortedSet("auctionLeaderboard", username, 1);
                redis.Increment("auctionCounter",1);
                double auctionEndTime = new DateTimeOffset(auction.DueTo).ToUnixTimeSeconds();
                redis.AddItemToSortedSet("sortedAuctions", keyEdited, auctionEndTime);
            }
            return status;

        }

        public Auction? Get(string key)
        {
            string keyEdited = "auction:" + key;
            string jsonData = redis.Get<string>(keyEdited);
            

            if (!string.IsNullOrEmpty(jsonData))
            {
                return JsonConvert.DeserializeObject<Auction>(jsonData);
            }
            return null;
        }

        public Dictionary<string, double> LeaderboardMostPlacedAuctions()
        {
            var allEntries = redis.GetRangeWithScoresFromSortedSetDesc("auctionLeaderboard",0,9);
            
            return new Dictionary<string, double>(allEntries);
        }


       public int GetAuctionCounter()
       {
        var result=redis.Get<int>("auctionCounter");
        return result;
       }

public List<Auction> LeaderboardAuctionsBasedOnTimeExpiring(int fromPosition, int N)
{
    var sortedEntries = redis.GetRangeFromSortedSetDesc("sortedAuctions", fromPosition, fromPosition + N - 1);

    List<Auction> auctions = new List<Auction>();

    foreach (var auctionKey in sortedEntries)
    {
         Console.WriteLine($"Found {auctionKey} auctions in sortedAuctions:");

        var auctionData = redis.Get<String>(auctionKey);

        if (auctionData != null)
        {

            var auction = JsonConvert.DeserializeObject<Auction>(auctionData);
            auctions.Add(auction);
        }

    }
    return auctions;
}



    }
}