using ServiceStack.Redis;
using DataLayer.DTOs.AuctionDTOs;
using Newtonsoft.Json;

namespace DataLayer.Services
{
    public class AuctionService
    {
        readonly RedisClient redis = new RedisClient(Config.SingleHost);

        public AuctionService() { }

        public bool Set(string key, CreateAuctionDTO auction)
        {
            string keyEdited="auction:"+key;
            Auction i=new Auction() {
                ID=auction.ID,  
                Title=auction.Title,
                StartingPrice=auction.StartingPrice,
                CurrentPrice=auction.CurrentPrice,
                Status=auction.Status,
                PostedOnDate=auction.PostedOnDate,
                DueTo=auction.DueTo,
            };
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
    }
}