namespace DataLayer.Models
{
    public class Auction
    {
        public int ID {get;set;}
        [Length(0,20)]
        public required string Title {get;set;}
        public required int StartingPrice {get;set;}
        public required int CurrentPrice {get;set;}
        public required string Status {get;set;}

        //public required DateTime PostedOnDate {get;set;}
        //public required DateTime DueTo {get;set;}

        //public User Author {get;set;}
        //public Item Item {get;set;}
        //public List<Offer> OfferList{get;set;}

        public override string ToString()
        {
            return $"Auction [ID={ID}, Title={Title}, StartingPrice={StartingPrice}, CurrentPrice={CurrentPrice}, Status={Status}]";
        }
    }
}