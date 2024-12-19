namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuctionController : ControllerBase
{
    private readonly TestService testService;

    public AuctionController(TestService testService)
    {
        this.testService = testService;
    }

    [HttpGet("test/{key}")]
    public string GetAuction(string key)
    {
        string value = testService.Get(key);
        return value;
    }

    [HttpPost("test/{key}/{TitleD}/{StartingPriceD}")]
    public string SetAuction(string key, string TitleD,[FromBody] string DescriptionD,int StartingPriceD)//,DateTime DueToD, DateTime CreatedOnDateD )
    {
    Auction a = new Auction
    {
        Title = TitleD,
        Description = DescriptionD,
        StartingPrice=StartingPriceD,
        CurrentPrice=0,
        //DueTo=DueToD,
        //PostedOnDate=CreatedOnDateD
    };
        bool result = testService.Set(key, a.ToString());
        if(result)
            return "Uspesno sacuvan podatak o Aukciji";

        return "Neuspesno cuvanje podatka o Aukciji";
    }
}
