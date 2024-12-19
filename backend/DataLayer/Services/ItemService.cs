using DataLayer.DTOs;
using ServiceStack.Redis;
using Newtonsoft.Json;

namespace DataLayer.Services
{
    public class ItemService
    {
        readonly RedisClient redis = new RedisClient(Config.SingleHost);

        public ItemService() { }

        public bool Set(string key, ItemDTO item)
        {
            string keyEdited="item:"+key;
            Item i=new Item() {
                ID=item.ID,
                Name=item.Name!,
                Description=item.Description!, 
                Category=item.Category!
            };

            return redis.Set(keyEdited, JsonConvert.SerializeObject(i));
        }

        // public string Get(string key)
        // {
        //     return redis.Get<string>(key);
        // }
    }
}