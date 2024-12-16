using ServiceStack.Redis;

namespace DataLayer.Services
{
    public class TestService
    {
        readonly RedisClient redis = new RedisClient(Config.SingleHost);

        public TestService() { }

        public bool Set(string key, string value)
        {
            return redis.Set(key, value);
        }

        public string Get(string key)
        {
            return redis.Get<string>(key);
        }
    }
}