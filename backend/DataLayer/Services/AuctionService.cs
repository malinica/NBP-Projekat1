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

        public bool Set(CreateAuctionDTO auction)
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
            return redis.Set(keyEdited, JsonConvert.SerializeObject(i));
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

        public List<Auction> LeaderboardMostPlacedAuctions()
        {
            var scanResult = redis.Keys(pattern: "auction:*");
            List<Auction> list = new List<Auction>();

            foreach (var key in scanResult)
            {
                string keyStringFormat = Encoding.UTF8.GetString(key);

                string jsonData = redis.Get<string>(keyStringFormat);

                if (!string.IsNullOrEmpty(jsonData))
                {
                    list.Add(JsonConvert.DeserializeObject<Auction>(jsonData));
                }
            }

            return list;
        }

        public List<Auction> LeaderboardAuctionsBasedOnTimeExpiring()
        {
            var scanResult = redis.Keys(pattern: "auction:*");
            List<Auction> list = new List<Auction>();

            foreach (var key in scanResult)
            {
                string keyStringFormat = Encoding.UTF8.GetString(key);
                string jsonData = redis.Get<string>(keyStringFormat);

                if (!string.IsNullOrEmpty(jsonData))
                {
                    var auctionDeserialized=(JsonConvert.DeserializeObject<Auction>(jsonData));
                    if (auctionDeserialized.Status==AuctionStatus.Active)
                        list.Add(auctionDeserialized);
                }
            }

            return list.OrderBy(a => a.DueTo).ToList();
        }

    }
}