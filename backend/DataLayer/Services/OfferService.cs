using ServiceStack.Redis;
using DataLayer.DTOs.OfferDTOs;
using Newtonsoft.Json;

namespace DataLayer.Services
{
    public class OfferService
    {
        readonly RedisClient redis = new RedisClient(Config.SingleHost);

        public OfferService() { }

        public bool Set(string key, CreateOfferDTO offer)
        {
            string keyEdited = "offer:" + key;
            Offer o = new Offer(){
                ID = offer.ID,
                Price = offer.Price,
                OfferedAt = offer.OfferedAt
            };
            return redis.Set(keyEdited, JsonConvert.SerializeObject(o));
        }

        public Offer? Get(string key)
        {
            string keyEdited = "offer:" + key;
            string jsonData = redis.Get<string>(keyEdited);
            if(!string.IsNullOrEmpty(jsonData))
            {
                return JsonConvert.DeserializeObject<Offer>(jsonData);
            }
            else
            {
                return null;
            }
        }
    }
}