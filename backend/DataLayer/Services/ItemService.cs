using Microsoft.EntityFrameworkCore;
using DataLayer.DTOs;
using ServiceStack.Redis;
using DataLayer.Context;
using DataLayer.DTOs.ItemDTOs;
using System.Text.Json;
using Newtonsoft.Json;
using DataLayer.Enums;


namespace DataLayer.Services
{
    public class ItemService
    {
        private readonly ProjectContext context;
        private readonly RedisClient redis = new RedisClient(Config.SingleHost);


        public ItemService(ProjectContext context)
        {
            this.context = context;
        }

        public async Task<ItemResultDTO> Create(CreateItemDTO itemDTO, string authorId)
        {
            var author = await context.Users.FindAsync(authorId);
            if (author == null)
                throw new Exception("Ne postoji korisnik sa zadatim ID-jem.");

            List<string> picturesPaths = new List<string>();
            foreach (var picture in itemDTO.Pictures)
            {

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(picture.FileName);
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var filePath = Path.Combine(path, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await picture.CopyToAsync(stream);
                }
                picturesPaths.Add(fileName);
            }


            var pictures = JsonConvert.SerializeObject(picturesPaths);

            Item item = new Item
            {
                Name = itemDTO.Name,
                Description = itemDTO.Description,
                Category = itemDTO.Category,
                Pictures = pictures
            };

            item.Author = author;

            await context.Items.AddAsync(item);
            await context.SaveChangesAsync();

            var result = await GetItem(item.ID);
            return result;
        }

        public async Task<ItemResultDTO> GetItem(int id)
        {
            var cacheKey = $"cache:item:{id}";

            var cachedData = redis.Get<string>(cacheKey);
            if (cachedData != null)
            {
                return JsonConvert.DeserializeObject<ItemResultDTO>(cachedData)!;
            }
            else
            {
                var item = await context.Items
                                        .Include(i => i.Author)
                                        .Include(i => i.AuctionWinner)
                                        .Where(i => i.ID == id)
                                        .FirstOrDefaultAsync();

                if (item == null)
                    throw new Exception("Nije pronadjen željeni predmet.");

                List<string> picturesPaths = JsonConvert.DeserializeObject<List<string>>(item.Pictures) ?? new List<string>();
                ItemResultDTO itemResult = new ItemResultDTO
                {
                    ID = item.ID,
                    Name = item.Name,
                    Description = item.Description,
                    Category = item.Category,
                    Pictures = picturesPaths,
                    Author = new User
                    {
                        Id = item.Author!.Id,
                        UserName = item.Author!.UserName,
                        Email = item.Author!.Email,
                        Role = item.Author!.Role
                    },
                    AuctionWinner = item.AuctionWinner != null ? new User
                    {
                        Id = item.AuctionWinner.Id,
                        UserName = item.AuctionWinner.UserName,
                        Email = item.AuctionWinner.Email,
                        Role = item.AuctionWinner.Role
                    } : null
                };

                redis.Set(cacheKey, JsonConvert.SerializeObject(itemResult), TimeSpan.FromSeconds(30));

                return itemResult;
            }
        }

        public async Task<PaginatedResponseDTO<ItemResultDTO>> GetItemsByUser(string username, string? type, int page = 1, int pageSize = 10)
        {
            var cacheKey = $"cache:user:{username}:items:page:{page}:pageSize:{pageSize}:type:{type}";
            var cachedData = redis.Get<string>(cacheKey);
            if (cachedData != null)
            {
                return JsonConvert.DeserializeObject<PaginatedResponseDTO<ItemResultDTO>>(cachedData)!;
            }
            else
            {
                var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == username);

                if (user == null)
                    throw new Exception("Korisnik nije pronađen.");

                IQueryable<Item> query = context.Items
                                        .Include(i => i.Author)
                                        .Include(i => i.AuctionWinner);

                if (type == "my")
                {
                    query = query.Where(i => i.Author!.Id == user.Id);
                }
                else if (type == "won")
                {
                    query = query.Where(i => i.AuctionWinner != null && i.AuctionWinner.Id == user.Id);
                }
                else
                {
                    throw new Exception("Nepoznat tip predmeta.");
                }

                var items = await query
                                    .Skip((page - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();

                List<ItemResultDTO> itemResults = items.Select(item => new ItemResultDTO
                {
                    ID = item.ID,
                    Name = item.Name,
                    Description = item.Description,
                    Category = item.Category,
                    Pictures = JsonConvert.DeserializeObject<List<string>>(item.Pictures) ?? new List<string>(),
                    Author = new User
                    {
                        Id = item.Author!.Id,
                        UserName = item.Author!.UserName,
                        Email = item.Author!.Email,
                        Role = item.Author!.Role
                    },
                    AuctionWinner = item.AuctionWinner != null ? new User
                    {
                        Id = item.AuctionWinner.Id,
                        UserName = item.AuctionWinner.UserName,
                        Email = item.AuctionWinner.Email,
                        Role = item.AuctionWinner.Role
                    } : null
                }).ToList();

                var result = new PaginatedResponseDTO<ItemResultDTO>
                {
                    Data = itemResults,
                    TotalLength = type == "my" ?
                                 await context.Items.CountAsync(i => i.Author!.Id == user.Id) :
                                 await context.Items.CountAsync(i => i.AuctionWinner != null && i.AuctionWinner.Id == user.Id)
                };

                redis.Set(cacheKey, JsonConvert.SerializeObject(result), TimeSpan.FromSeconds(30));

                return result;
            }
        }


        public async Task<List<ItemResultDTO>> GetItemsByFilter(string name, ItemCategory[] categories)
        {
            var items = await context.Items
                .Include(i => i.Author)
                .Include(i => i.AuctionWinner)
                .Where(item => item.Name.ToLower().Contains(name.ToLower()) &&
                            ((categories.Length == 0) || categories.Contains(item.Category)))
                .Select(item => new ItemResultDTO
                {
                    ID = item.ID,
                    Name = item.Name,
                    Description = item.Description,
                    Category = item.Category,
                    Pictures = JsonConvert.DeserializeObject<List<string>>(item.Pictures) ?? new List<string>(),
                    Author = new User
                    {
                        Id = item.Author!.Id,
                        UserName = item.Author!.UserName,
                        Email = item.Author!.Email,
                        Role = item.Author!.Role
                    },
                    AuctionWinner = item.AuctionWinner != null ? new User
                    {
                        Id = item.AuctionWinner.Id,
                        UserName = item.AuctionWinner.UserName,
                        Email = item.AuctionWinner.Email,
                        Role = item.AuctionWinner.Role
                    } : null
                })
                .ToListAsync();

            return items;
        }

        public async Task<bool> SetAuctionWinner(int itemId, string userId)
        {
            var item = await context.Items.FindAsync(itemId);
            if (item == null)
                throw new Exception("Predmet nije pronađen.");

            var user = await context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("Korisnik nije pronađen.");

            item.AuctionWinner = user;
            await context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteItem(int itemId, string userId)
        {
            var item = await context.Items.Include(i => i.Author).FirstOrDefaultAsync(i => i.ID == itemId);
            if (item == null)
            {
                throw new Exception("Predmet nije pronađen.");
            }

            if (item.Author?.Id != userId)
            {
                throw new UnauthorizedAccessException("Nemate dozvolu za brisanje ovog predmeta.");
            }

            var picturesPaths = JsonConvert.DeserializeObject<List<string>>(item.Pictures) ?? new List<string>();
            foreach (var picturePath in picturesPaths)
            {
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", picturePath);
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
            }

            context.Items.Remove(item);
            await context.SaveChangesAsync();

            var cacheKey = $"cache:item:{itemId}";
            redis.Remove(cacheKey);

            return true;
        }

        public async Task<ItemResultDTO> Update(int itemId, UpdateItemDTO itemDTO, string authorId)
        {
            var item = await context.Items.Include(i => i.Author).FirstOrDefaultAsync(i => i.ID == itemId);
            if (item == null)
                throw new Exception("Predmet nije pronađen.");

            if (item.Author?.Id != authorId)
                throw new UnauthorizedAccessException("Nemate dozvolu za izmenu ovog predmeta.");

            if(itemDTO.Name != null)
                item.Name = itemDTO.Name;   
            
            if(itemDTO.Description != null)
                item.Description = itemDTO.Description;

            if(itemDTO.Category != null)
                item.Category = (ItemCategory)itemDTO.Category;

            if (itemDTO.Pictures != null && itemDTO.Pictures.Any())
            {
                if (!string.IsNullOrEmpty(item.Pictures))
                {
                    var existingPictures = JsonConvert.DeserializeObject<List<string>>(item.Pictures);
                    var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                    foreach (var existingPicture in existingPictures!)
                    {
                        var filePath = Path.Combine(wwwrootPath, existingPicture);
                        if (File.Exists(filePath))
                        {
                            File.Delete(filePath);
                        }
                    }
                }

                List<string> newPicturesPaths = new List<string>();
                foreach (var picture in itemDTO.Pictures)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(picture.FileName);
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    var filePath = Path.Combine(path, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await picture.CopyToAsync(stream);
                    }
                    newPicturesPaths.Add(fileName);
                }

                item.Pictures = JsonConvert.SerializeObject(newPicturesPaths);
            }

            await context.SaveChangesAsync();

            var cacheKey = $"cache:item:{itemId}";
            redis.Remove(cacheKey);

            var result = await GetItem(item.ID);
            return result;
        }
    }
}