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

        private readonly AuctionService auctionService;

        public OfferService(ProjectContext context, AuctionService auctionService) 
        {
            this.context = context;
            this.auctionService = auctionService;
        }

        public bool Create(CreateOfferDTO offer)
        {
            string sortedSetKey = $"auction:{offer.AuctionId}:users";
            double? highestOffer = redis.GetRangeWithScoresFromSortedSetDesc(sortedSetKey, 0, 0)
                                    .FirstOrDefault().Value;

            Auction? auction = auctionService.Get(offer.AuctionId);

            if(auction == null)
                throw new Exception("Aukcija ne postoji.");

            if(auction.DueTo < DateTime.UtcNow)
                throw new Exception("Neuspešno kreiranje ponude. Aukcija je završena.");

            if(offer.Price <= auction.StartingPrice)
                throw new Exception("Ponuda mora biti veća od početne cene na aukciji.");

            if (highestOffer.HasValue && offer.Price <= highestOffer.Value)
                throw new Exception("Nova ponuda mora biti veća od trenutne najveće.");

            // sorted set pamti rangirane korisnike za odredjenu aukciju
            bool itemAdded = redis.AddItemToSortedSet(sortedSetKey, offer.UserId, offer.Price);
            
            // u posebnom key-value paru se pamti id aukcije i korisnika i offer koji je napravio
            string offerKey = $"auction:{offer.AuctionId}:user:{offer.UserId}";
            Offer o = new Offer{
                ID = Guid.NewGuid().ToString(),
                Price = offer.Price,
                OfferedAt = DateTime.UtcNow,
                UserId = offer.UserId
            };
            string offerSerialized = JsonConvert.SerializeObject(o);
            bool offerCreated = redis.Set(offerKey, offerSerialized);

            // azurira se i trenutna cena aukcije
            bool auctionPriceUpdated = auctionService.UpdateCurrentPrice(offer.AuctionId, offer.Price);
            
            redis.AddItemToSet("AuctionsBidedByUser:"+offer.UserId+":",offer.AuctionId);

            bool auctionBidExists = redis.SetContainsItem("AuctionsBidedByUser:"+offer.UserId+":",offer.AuctionId);


            return itemAdded && offerCreated && auctionPriceUpdated && auctionBidExists;
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