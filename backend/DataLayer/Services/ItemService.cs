using DataLayer.DTOs;
using ServiceStack.Redis;
using DataLayer.Context;
using DataLayer.DTOs.ItemDTOs;
using System.Text.Json;

namespace DataLayer.Services
{
    public class ItemService
    {
        private readonly ProjectContext context;

        public ItemService(ProjectContext context)
        {
            this.context = context;
        }

        public async Task<int> Create(CreateItemDTO itemDTO) {
            var author = await context.Users.FindAsync(itemDTO.AuthorID);
            if (author == null) 
                throw new Exception("Ne postoji korisnik sa zadatim ID-jem.");
            
            var pictures = JsonSerializer.Serialize(itemDTO.Pictures);

            Item item = new Item {
                Name = itemDTO.Name,
                Description = itemDTO.Description,
                Category = itemDTO.Category,
                Pictures = pictures
            };

            item.Author = author;

            await context.Items.AddAsync(item);
            await context.SaveChangesAsync();

            return item.ID;
        }
        
        // public bool Set(string key, ItemDTO item)
        // {
        //     string keyEdited="item:"+key;
        //     Item i=new Item() {
        //         ID=item.ID,
        //         Name=item.Name!,
        //         Description=item.Description!, 
        //         Category=item.Category!
        //     };

        //     return redis.Set(keyEdited, JsonConvert.SerializeObject(i));
        // }

        // public string Get(string key)
        // {
        //     return redis.Get<string>(key);
        // }
    }
}