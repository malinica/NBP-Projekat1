namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TestController : ControllerBase
{
    private readonly TestService testService;

    public TestController(TestService testService)
    {
        this.testService = testService;
    }

    [HttpGet("test/{key}")]
    public string Get(string key)
    {
        string value = testService.Get(key);
        return value;
    }

    [HttpPost("test/{key}/{value}")]
    public string Set(string key, string value)
    {
        bool result = testService.Set(key, value);
        if(result)
            return "Uspesno sacuvan podatak";

        return "Neuspesno cuvanje podatka";
    }
}
