using ServiceStack.Redis;
using DataLayer.DTOs.OfferDTOs;
using Newtonsoft.Json;

namespace DataLayer.Services
{
    public class OfferService
    {
        readonly RedisClient redis = new RedisClient(Config.SingleHost);

        public OfferService() { }

        public bool Set(CreateOfferDTO offer)
        {
            string sortedSetKey = $"auction:{offer.AuctionId}:offers";
            Offer o = new Offer{
                ID = Guid.NewGuid().ToString(),
                Price = offer.Price,
                OfferedAt = offer.OfferedAt,
                UserId = offer.UserId
            };
            string member = JsonConvert.SerializeObject(o);

            return redis.AddItemToSortedSet(sortedSetKey, member, offer.Price);
        }

        public List<Offer> GetOffersForAuction(int auctionId, int count)
        {
            string sortedSetKey = $"auction:{auctionId}:offers";

            var offersDescending = redis.GetRangeFromSortedSetDesc(sortedSetKey, 0, count-1);

            List<Offer> result = new List<Offer>();

            foreach (var offer in offersDescending) {
                result.Add(JsonConvert.DeserializeObject<Offer>(offer)!);
            }

            return result;
        }

        public bool DeleteOffersForAuction(int auctionId) {
            string sortedSetKey = $"auction:{auctionId}:offers";
            return redis.Remove(sortedSetKey);
        }
    }
}