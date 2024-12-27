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

        public bool Create(CreateOfferDTO offer)
        {
            // sorted set pamti rangirane korisnike za odredjenu aukciju
            string sortedSetKey = $"auction:{offer.AuctionId}:users";
            bool itemAdded = redis.AddItemToSortedSet(sortedSetKey, offer.UserId, offer.Price);
            
            // u posebnom key-value paru se pamti id aukcije i korisnika i offer koji je napravio
            string offerKey = $"auction:{offer.AuctionId}:user:{offer.UserId}";
            Offer o = new Offer{
                ID = Guid.NewGuid().ToString(),
                Price = offer.Price,
                OfferedAt = new DateTime(),
                UserId = offer.UserId
            };
            string offerSerialized = JsonConvert.SerializeObject(o);
            bool offerCreated = redis.Set(offerKey, offerSerialized);

            return itemAdded && offerCreated;
        }

        public async Task<List<OfferResultDTO>> GetOffersForAuction(string auctionId, int count)
        {
            string sortedSetKey = $"auction:{auctionId}:users";

            var usersIdsDescending = redis.GetRangeFromSortedSetDesc(sortedSetKey, 0, count-1);

            List<OfferResultDTO> result = new List<OfferResultDTO>();

            foreach (var userId in usersIdsDescending) {
                string offerKey = $"auction:{auctionId}:user:{userId}";
                string offerSerialized = redis.Get<string>(offerKey);

                Offer o = JsonConvert.DeserializeObject<Offer>(offerSerialized)!;
                User? u = await context.Users.FindAsync(userId);
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
            string sortedSetKey = $"auction:{auctionId}:users";
            
            var userIds = redis.GetAllItemsFromSortedSet(sortedSetKey);

            if (userIds != null && userIds.Any())
            {
                var keysToDelete = userIds.Select(userId => $"auction:{auctionId}:user:{userId}").ToList();

                redis.RemoveAll(keysToDelete);
            }

            return redis.Remove(sortedSetKey);
        }
    }
}