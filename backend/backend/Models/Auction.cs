namespace backend.Models
{
    public class Auction
    {
        public int ID {get;set;}

        [Length(0,20)]
        public required string Title {get;set;}
        
        //public required DateTime PostedOnDate {get;set;}
       // public required DateTime DueTo {get;set;}

        //public required List<string> Pictures {get;set;}
        public required string Description {get;set;}
        [Required]
        public required int StartingPrice {get;set;}
        public required int CurrentPrice {get;set;}

        //public User Author {get;set;}
        //public List<Offer> OfferList{get;set;}

        public override string ToString()
        {
           // string picturesList = Pictures.Count > 0 ? string.Join(", ", Pictures) : "No pictures available";

            return $"Auction [ID={ID}, Title={Title}, Description={Description}, StartingPrice={StartingPrice}, CurrentPrice={CurrentPrice}]";//, PostedOnDate={PostedOnDate},DueTo={DueTo}]";

        }
    }
}