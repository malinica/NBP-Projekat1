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

        public string Set(CreateAuctionDTO auction, string username)
        {
            Auction i = new Auction()
            {
                ID = Guid.NewGuid().ToString(),
                Title = auction.Title,
                StartingPrice = auction.StartingPrice,
                CurrentPrice = auction.CurrentPrice,
                Status = auction.Status,
                PostedOnDate = auction.PostedOnDate,
                DueTo = auction.DueTo,
                ItemId = auction.ItemId
            };
            string keyEdited = $"auction:" + i.ID;
            bool status = redis.Set(keyEdited, JsonConvert.SerializeObject(i));
            if (status)
            {
                redis.IncrementItemInSortedSet("auctionLeaderboard", username, 1);//za najaktivnije korisnike
                double auctionEndTime = new DateTimeOffset(auction.DueTo).ToUnixTimeSeconds();
                redis.AddItemToSortedSet("sortedAuctions:", i.ID, auctionEndTime);//za prikupljanje aukcija na stranici aukcija
                redis.Set("AuctionIDForItemID:" + auction.ItemId, i.ID);
                redis.AddItemToSet("user:" + username + ":createdAuctions", i.ID);
                
                return i.ID;
            }

            return "Error in set function for auction";

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
            var allEntries = redis.GetRangeWithScoresFromSortedSetDesc("auctionLeaderboard", 0, 9);

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
            redis.AddItemToList(key, auctionId);
        }

        public void RemoveAuctionFromFavorite(string userId, string auctionId)
        {
            string key = $"user:{userId}:favoriteAuctions";
            redis.RemoveItemFromList(key, auctionId);
        }

        public async Task<List<AuctionResultDTO>> GetFavoriteAuctions(string userId)
        {
            string key = $"user:{userId}:favoriteAuctions";
            var auctionsIds = redis.GetAllItemsFromList(key);
            List<AuctionResultDTO> auctions = new List<AuctionResultDTO>();
            foreach (var auctionId in auctionsIds)
            {
                var auction = await GetFullAuction(auctionId);
                if (auction != null)
                    auctions.Add(auction);
            }
    return auctions.OrderByDescending(a => a.DueTo).ToList(); 
        }

        public async Task<List<AuctionResultDTO>> GetAuctionsFromFilter(string? itemName, ItemCategory[] categories, int? pricemin,int? pricemax)
        {
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

            return auctionList;
        }

        public async Task<List<AuctionResultDTO>> GetAuctionsCreatedByUser(string username)
        {
            string key = $"user:{username}:createdAuctions";
            var auctionsIds = redis.GetAllItemsFromSet(key);
            List<AuctionResultDTO> auctions = new List<AuctionResultDTO>();
            foreach (var auctionId in auctionsIds)
            {
                var auction = await GetFullAuction(auctionId);
                if (auction != null)
                    auctions.Add(auction);
            }
            return auctions;
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

        //AuctionsBidedByUser

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
    }   
}