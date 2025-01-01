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

        public ItemService(ProjectContext context)
        {
            this.context = context;
        }

        public async Task<ItemResultDTO> Create(CreateItemDTO itemDTO, string authorId) {
            var author = await context.Users.FindAsync(authorId);
            if (author == null) 
                throw new Exception("Ne postoji korisnik sa zadatim ID-jem.");
            
            List<string> picturesPaths = new List<string>();
            foreach(var picture in itemDTO.Pictures) {

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

            Item item = new Item {
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
            var item = await context.Items.FindAsync(id);

            if (item == null)
                throw new Exception("Nije pronadjen željeni predmet.");

            List<string> picturesPaths = JsonConvert.DeserializeObject<List<string>>(item.Pictures) ?? new List<string>();
            ItemResultDTO itemResult = new ItemResultDTO {
                ID = item.ID,
                Name = item.Name,
                Description = item.Description,
                Category = item.Category,
                Pictures = picturesPaths
            };
            
            
            return itemResult;
        }

        public async Task<List<ItemResultDTO>> GetItemsByUser(string username) 
        {
        var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == username);

        if (user == null)
            throw new Exception("Korisnik nije pronađen.");

        var items = await context.Items
                                .Where(i => i.Author.Id == user.Id)
                                .ToListAsync();

        if (items == null || items.Count == 0)
            throw new Exception("Korisnik nema dostupnih predmeta.");

        List<ItemResultDTO> itemResults = items.Select(item => new ItemResultDTO
        {
            ID = item.ID,
            Name = item.Name,
            Description = item.Description,
            Category = item.Category,
            Pictures = JsonConvert.DeserializeObject<List<string>>(item.Pictures) ?? new List<string>()
        }).ToList();

        return itemResults;
        }


         public async Task<List<ItemResultDTO>> GetItemsByFilter(string name, ItemCategory[] categories)
{
    Console.Write("AAAAAAAAAAAAAAAAAAAAAA");
    foreach (var category in categories)
{
    Console.WriteLine(category);
}

    var items = await context.Items
        .Where(item => item.Name.ToLower().Contains(name.ToLower()) &&
                       ((categories.Length==0) || categories.Contains(item.Category)))
        .Select(item => new ItemResultDTO
        {
            ID = item.ID,
            Name = item.Name,
            Description=item.Description,
            Category = item.Category,
            Pictures = JsonConvert.DeserializeObject<List<string>>(item.Pictures) ?? new List<string>()

        })
        .ToListAsync();

    return items;
}


    }
}