using ServiceStack.Redis;
using DataLayer.DTOs.AuctionDTOs;
using Newtonsoft.Json;
using System.Text;
using DataLayer.Enums;
using Microsoft.EntityFrameworkCore;
using ServiceStack;


namespace DataLayer.Services
{
    public class AuctionService
    {
        private readonly RedisClient redis = new RedisClient(Config.SingleHost);

        private readonly ItemService itemService;

        public AuctionService(ItemService itemService)
        {
            this.itemService = itemService;
        }

        public string Set(CreateAuctionDTO auctionDto, string username)
        {
            var existingAuctionId = redis.Get<string>("AuctionIDForItemID:" + auctionDto.ItemId);
            
            if(!string.IsNullOrEmpty(existingAuctionId))
                throw new Exception("Predmet se može postaviti na aukciju samo jednom.");

            Auction auction = new Auction()
            {
                ID = Guid.NewGuid().ToString(),
                Title = auctionDto.Title,
                StartingPrice = auctionDto.StartingPrice,
                CurrentPrice = auctionDto.CurrentPrice,
                Status = auctionDto.Status,
                PostedOnDate = auctionDto.PostedOnDate,
                DueTo = auctionDto.DueTo,
                // DueTo = DateTime.UtcNow.AddMinutes(3),
                ItemId = auctionDto.ItemId
            };
            string keyEdited = $"auction:" + auction.ID;
            bool status1 = redis.Set(keyEdited, JsonConvert.SerializeObject(auction));
            if (status1)
            {
                redis.IncrementItemInSortedSet("auctionLeaderboard:", username, 1);//za najaktivnije korisnike
                double auctionEndTime = new DateTimeOffset(auction.DueTo).ToUnixTimeSeconds();
                var status2 =redis.AddItemToSortedSet("sortedAuctions:", auction.ID, auctionEndTime);//za prikupljanje aukcija na stranici aukcija
                var status3=redis.Set("AuctionIDForItemID:" + auctionDto.ItemId, auction.ID);// za pretragu aukcija po filterima jer se krece iz relacione baze Item pa treba veza do aukcije u redis
                var status4=redis.AddItemToSortedSet("user:" + username + ":createdAuctions", auction.ID, 0);
                var status5=redis.Set("AuthorForAuction:"+auction.ID,username);//za brisanje itema iz set-a linije iznad
                return auction.ID;
            }

            throw new Exception("Neuspešno kreiranje aukcije.");

        }

        public Auction? Get(string auctionId)
        {
            string keyEdited = "auction:" + auctionId;
            string jsonData = redis.Get<string>(keyEdited);


            if (!string.IsNullOrEmpty(jsonData))
            {
                return JsonConvert.DeserializeObject<Auction>(jsonData);
            }
            return null;
        }

        public async Task<AuctionResultDTO?> GetFullAuction(string auctionId)
        {
            var auction = Get(auctionId);
            if (auction != null)
            {
                var item = await itemService.GetItem(auction.ItemId);
                AuctionResultDTO auctionResult = new AuctionResultDTO
                {
                    ID = auction.ID,
                    Title = auction.Title,
                    StartingPrice = auction.StartingPrice,
                    CurrentPrice = auction.CurrentPrice,
                    Status = auction.Status,
                    PostedOnDate = auction.PostedOnDate,
                    DueTo = auction.DueTo,
                    Item = item
                };
                return auctionResult;
            }
            return null;
        }

        public Dictionary<string, double> LeaderboardMostPlacedAuctions()
        {
            var allEntries = redis.GetRangeWithScoresFromSortedSetDesc("auctionLeaderboard:", 0, 9);

            return new Dictionary<string, double>(allEntries);
        }

        public async Task<List<AuctionResultDTO>> GetAuctionsBasedOnTimeExpiring (int fromPosition, int N)
        {

            var auctionsIds = redis.GetRangeFromSortedSet("sortedAuctions:", fromPosition, fromPosition + N - 1);
            List<AuctionResultDTO> auctions = new List<AuctionResultDTO>();
            foreach (var auctionId in auctionsIds)
            {
                var auction = await GetFullAuction(auctionId);
                if (auction != null)
                    auctions.Add(auction);
            }
            return auctions;
        }

        public void AddAuctionToFavorite(string userId, string auctionId)
        {
            string key = $"user:{userId}:favoriteAuctions";
            if (redis.Lists[key].Contains(auctionId))
            {
                return;
            }
            redis.PrependItemToList(key, auctionId);
            redis.AddItemToSet("UsersWhoFavorisedAuction:"+auctionId+":",userId);
        }

        public bool CanAddAuctionToFavorite(string userId, string auctionId)
        {
            string key = $"user:{userId}:favoriteAuctions";
            if (redis.Lists[key].Contains(auctionId))
            {
                return false;
            }
            return true;
        }

        public void RemoveAuctionFromFavorite(string userId, string auctionId)
        {
            string key = $"user:{userId}:favoriteAuctions";
            redis.RemoveItemFromList(key, auctionId);
            redis.RemoveItemFromSet("UsersWhoFavorisedAuction:"+auctionId+":",userId);

        }

        public async Task<PaginatedResponseDTO<AuctionResultDTO>> GetFavoriteAuctions(string userId, int page = 1, int pageSize = 10)
        {
            string cacheKey = $"cache:user:{userId}:favoriteAuctions:page:{page}:pageSize:{pageSize}";
            var cachedData = redis.Get<string>(cacheKey);
            if (cachedData != null)
            {
                return JsonConvert.DeserializeObject<PaginatedResponseDTO<AuctionResultDTO>>(cachedData)!;
            }
            else {
                string key = $"user:{userId}:favoriteAuctions";

                var auctionsIds = redis.GetRangeFromList(key, (page - 1) * pageSize, page * pageSize - 1);
                List<AuctionResultDTO> auctions = new List<AuctionResultDTO>();
                foreach (var auctionId in auctionsIds)
                {
                    var auction = await GetFullAuction(auctionId);
                    if (auction != null)
                        auctions.Add(auction);
                }

                var result = new PaginatedResponseDTO<AuctionResultDTO>
                {
                    Data = auctions,
                    TotalLength = redis.GetListCount(key)
                }; 

                redis.Set(cacheKey, JsonConvert.SerializeObject(result), TimeSpan.FromSeconds(30));

                return result;
            }
        }

        public async Task<List<AuctionResultDTO>> GetAuctionsFromFilter(string? itemName, ItemCategory[] categories, int? pricemin, int? pricemax)
        {
            string cacheKey = $"cache:auctionsFiltered:itemName:{itemName}:"+
                                                      $"categories:{JsonConvert.SerializeObject(categories)}:"+
                                                      $"pricemin:{pricemin}"+
                                                      $"pricemax:{pricemax}";

            var cachedData = redis.Get<string>(cacheKey);
            if (cachedData != null)
            {
                return JsonConvert.DeserializeObject<List<AuctionResultDTO>>(cachedData)!;
            }
            else {
                if (string.IsNullOrEmpty(itemName))
                {
                    itemName = "";
                }

                if (categories == null || categories.Length == 0)
                {
                    categories = new ItemCategory[] { };
                }

                var items = await itemService.GetItemsByFilter(itemName, categories);
                var auctionList = new List<AuctionResultDTO>();

                if (items != null)
                {
                    foreach (var x in items)
                    {
                        var auctionID = redis.Get<string>("AuctionIDForItemID:" + x.ID);
                        var auction = await GetFullAuction(auctionID);

                if (auction != null && 
                (pricemin == null || auction.CurrentPrice >= pricemin) &&
                (pricemax == null || auction.CurrentPrice <= pricemax))
                            auctionList.Add(auction);
            
                    }
                }
                redis.Set(cacheKey, JsonConvert.SerializeObject(auctionList), TimeSpan.FromSeconds(30));
                return auctionList;
            }
        }

        public async Task<PaginatedResponseDTO<AuctionResultDTO>> GetAuctionsCreatedByUser(string username, int page = 1, int pageSize = 10)
        {
            string cacheKey = $"cache:username:{username}:createdAuctions:page:{page}:pageSize:{pageSize}";
            var cachedData = redis.Get<string>(cacheKey);
            if (cachedData != null)
            {
                return JsonConvert.DeserializeObject<PaginatedResponseDTO<AuctionResultDTO>>(cachedData)!;
            }
            else {
                string key = $"user:{username}:createdAuctions";
                var auctionsIds = redis.GetRangeFromSortedSet(key, (page - 1) * pageSize, page * pageSize - 1);
                List<AuctionResultDTO> auctions = new List<AuctionResultDTO>();
                foreach (var auctionId in auctionsIds)
                {
                    var auction = await GetFullAuction(auctionId);
                    if (auction != null)
                        auctions.Add(auction);
                }
                var result = new PaginatedResponseDTO<AuctionResultDTO> {
                    Data = auctions,
                    TotalLength = redis.GetSortedSetCount(key)
                };

                redis.Set(cacheKey, JsonConvert.SerializeObject(result), TimeSpan.FromSeconds(30));
                return result;
            }
        }

        public bool UpdateCurrentPrice(string auctionId, int price)
        {
            string key = "auction:" + auctionId;
            var auction = Get(auctionId);
            if (auction != null)
            {
                auction.CurrentPrice = price;
                return redis.Set(key, JsonConvert.SerializeObject(auction));
            }
            return false;
        }

        public async Task<List<AuctionResultDTO>> GetAuctionsBidedByUser(string userID)
        {
            string key = $"AuctionsBidedByUser:{userID}:";
            var auctionsIds = redis.GetAllItemsFromSet(key);
            List<AuctionResultDTO> auctions = new List<AuctionResultDTO>();
            foreach (var auctionId in auctionsIds)
            {
                
                var auction = await GetFullAuction(auctionId);
                if (auction != null)
                    auctions.Add(auction);
            }
            return auctions.OrderByDescending(a => a.DueTo).ToList(); 
        }

        public async Task<bool> CanBidToAuction(string username, string auctionId)
        {
            string key = $"user:{username}:createdAuctions";
            //ako je autor aukcije, ne moze da licitira
            if (redis.SortedSets[key].Contains(auctionId))
            {
                return false;
            }

            // provera da item nije vec osvojen na nekoj aukciji
            var auction = Get(auctionId);
            if (auction != null)
            {
                var item = await itemService.GetItem(auction.ItemId);
                if (item != null && item.AuctionWinner != null)
                {
                    return false;
                }
            }

            return true;
        }

        public async Task ProcessExpiredAuctions() {
            string key = "sortedAuctions:";
            string lastCheckKey = "lastCheck";
            var lastCheck = redis.Get<long?>(lastCheckKey);

            redis.Set(lastCheckKey, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString());

            var expiredAuctionsIds = redis.GetRangeFromSortedSetByLowestScore(
                                    key, 
                                    lastCheck ?? 0, 
                                    DateTimeOffset.UtcNow.ToUnixTimeSeconds());

            foreach (var auctionId in expiredAuctionsIds)
            {
                string sortedSetKey = $"auction:{auctionId}:users";
                string? userIdWithHighestOffer = redis.GetRangeWithScoresFromSortedSetDesc(sortedSetKey, 0, 0)
                                                      .FirstOrDefault().Key;
                
                var auction = Get(auctionId);
                
                if (userIdWithHighestOffer != null && auction != null)
                {
                    var itemId = auction.ItemId;
                    await itemService.SetAuctionWinner(itemId, userIdWithHighestOffer);
                }

                // auction.Status = AuctionStatus.Closed;
                // redis.Set("auction:" + auctionId, JsonConvert.SerializeObject(auction));
                DeleteAuction(auctionId);
            }
        }

        public bool DeleteAuction(string auctionId)
        {
            var auction = Get(auctionId);
            if (auction != null)
            {
                redis.RemoveItemFromSortedSet("sortedAuctions:", auctionId);
                redis.Remove("AuctionIDForItemID:" + auction.ItemId);
                var authorUsername = redis.Get<string>("AuthorForAuction:" + auctionId);
                redis.Remove("AuthorForAuction:" + auctionId);
                redis.RemoveItemFromSortedSet("user:" + authorUsername + ":createdAuctions", auctionId);

                var usersFavIds = redis.GetAllItemsFromSet("UsersWhoFavorisedAuction:" + auctionId + ":");
                foreach (var userId in usersFavIds)
                    RemoveAuctionFromFavorite(userId, auctionId);

                var usersIds = redis.GetAllItemsFromSortedSet($"auction:{auctionId}:users");
                foreach (var userId in usersIds)
                {
                    redis.RemoveItemFromSet("AuctionsBidedByUser:" + userId + ":", auctionId);
                    redis.Remove($"auction:{auctionId}:user:{userId}");
                }

                redis.Remove("auction:" + auctionId);
                return true;
            }
            return false;
        }

        public async Task<AuctionResultDTO?> Update(string auctionId, UpdateAuctionDTO auctionDTO)
        {
            Auction? auction = Get(auctionId);

            if(auction != null) {
                auction.Title = auctionDTO.Title;
                auction.StartingPrice = auctionDTO.StartingPrice;
                auction.DueTo = auctionDTO.DueTo;
                string keyEdited = $"auction:" + auctionId;
                bool status1 = redis.Set(keyEdited, JsonConvert.SerializeObject(auction));
                if (status1)
                {
                    double auctionEndTime = new DateTimeOffset(auctionDTO.DueTo).ToUnixTimeSeconds();
                    redis.AddItemToSortedSet("sortedAuctions:", auctionId, auctionEndTime);//za prikupljanje aukcija na stranici aukcija
                    return await GetFullAuction(auctionId);
                }
            }

            return null;
        }
    }   
}