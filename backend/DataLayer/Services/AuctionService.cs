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
            Auction i=new Auction() {
                ID = Guid.NewGuid().ToString(),
                Title=auction.Title,
                StartingPrice=auction.StartingPrice,
                CurrentPrice=auction.CurrentPrice,
                Status=auction.Status,
                PostedOnDate=auction.PostedOnDate,
                DueTo=auction.DueTo,
            };
            string keyEdited = $"auction:" + i.ID;
            bool status= redis.Set(keyEdited, JsonConvert.SerializeObject(i));
            if (status)
            {
            redis.IncrementValueInHash("auctionLeaderboard", username, 1);
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



public List<Auction> LeaderboardAuctionsBasedOnTimeExpiring(int fromPosition, int N)
{
    var sortedEntries = redis.GetRangeFromSortedSet("auctionLeaderboard", fromPosition, fromPosition + N - 1);
    
    List<Auction> auctions = new List<Auction>();
    
    foreach (var entry in sortedEntries)
    {
        var auction = JsonConvert.DeserializeObject<Auction>(entry);
        auctions.Add(auction);
    }

    return auctions;
}



       public Dictionary<string, string> LeaderboardMostPlacedAuctions()
{
      var allEntries = redis.GetAllEntriesFromHash("auctionLeaderboard");
    return allEntries;
}


        
}
}