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
            // Check if the current highest offer is greater than or equal to the new offer
            string sortedSetKey = $"auction:{offer.AuctionId}:users";
            double? highestOffer = redis.GetRangeWithScoresFromSortedSetDesc(sortedSetKey, 0, 0)
                                    .FirstOrDefault().Value;

            if (highestOffer.HasValue && highestOffer.Value >= offer.Price)
                throw new Exception("Nova ponuda mora biti veća od trenutne najveće.");

            // sorted set pamti rangirane korisnike za odredjenu aukciju
            bool itemAdded = redis.AddItemToSortedSet(sortedSetKey, offer.UserId, offer.Price);
            
            // u posebnom key-value paru se pamti id aukcije i korisnika i offer koji je napravio
            string offerKey = $"auction:{offer.AuctionId}:user:{offer.UserId}";
            Offer o = new Offer{
                ID = Guid.NewGuid().ToString(),
                Price = offer.Price,
                OfferedAt = DateTime.Now,
                UserId = offer.UserId
            };
            string offerSerialized = JsonConvert.SerializeObject(o);
            bool offerCreated = redis.Set(offerKey, offerSerialized);
            
            redis.AddItemToSet("AuctionsBidedByUser:"+offer.UserId+":", "auction:"+offer.AuctionId);
            bool auctionBidExists = redis.SetContainsItem("AuctionsBidedByUser:"+offer.UserId+":", "auction:"+offer.AuctionId);


            return itemAdded && offerCreated && auctionBidExists;
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

        public void PublishNewOffers(string auctionId, List<OfferResultDTO> offers) {
            string auctionChannel = $"auction:{auctionId}";
            string offersSerialized = JsonConvert.SerializeObject(offers);
            redis.PublishMessage(auctionChannel, offersSerialized);
        }

        public void SubscribeToAuction(string auctionId, Action<string, string> action) {
            string auctionChannel = $"auction:{auctionId}";

            var clientsManager = new PooledRedisClientManager();
            var redisPubSub = new RedisPubSubServer(clientsManager, auctionChannel) {
                OnMessage = action
            }.Start();
        }
    }
}