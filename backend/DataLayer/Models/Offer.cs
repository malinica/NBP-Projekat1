namespace DataLayer.Models
{
    public class Offer
    {
        [Key]
        public int ID {get;set;}
        public required int Price {get;set;}
        public required DateTime OfferedAt {get;set;}

        // [InverseProperty("OfferList")]
        // public Auction? DuringAuction {get;set;} 

    }
}