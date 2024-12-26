using ServiceStack.Redis;
using DataLayer.DTOs.OfferDTOs;
using Newtonsoft.Json;
using DataLayer.Context;

namespace DataLayer.Services
{
    public class OfferService
    {
        readonly RedisClient redis = new RedisClient(Config.SingleHost);
        private readonly ProjectContext context;

        public OfferService(ProjectContext context) 
        {
            this.context = context;
        }

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

        public async Task<List<OfferResultDTO>> GetOffersForAuction(string auctionId, int count)
        {
            string sortedSetKey = $"auction:{auctionId}:offers";

            var offersDescending = redis.GetRangeFromSortedSetDesc(sortedSetKey, 0, count-1);

            List<OfferResultDTO> result = new List<OfferResultDTO>();

            foreach (var offer in offersDescending) {
                Offer o = JsonConvert.DeserializeObject<Offer>(offer)!;
                User? u = await context.Users.FindAsync(o.UserId);
                OfferResultDTO offerResult = new OfferResultDTO {
                    ID = o.ID,
                    OfferedAt = o.OfferedAt,
                    Price = o.Price,
                    User = u
                };
                result.Add(offerResult);
            }

            return result;
        }

        public bool DeleteOffersForAuction(int auctionId) {
            string sortedSetKey = $"auction:{auctionId}:offers";
            return redis.Remove(sortedSetKey);
        }
    }
}