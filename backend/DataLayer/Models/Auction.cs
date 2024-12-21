using DataLayer.DTOs.AuctionDTOs;
using DataLayer.Enums;

namespace DataLayer.Models
{
    public class Auction
    {
        [Key]
        public int ID {get;set;}
        [Length(2,20)]
        public required string Title {get;set;}
        public required int StartingPrice {get;set;}
        public required int CurrentPrice {get;set;}
        public required AuctionStatus Status {get;set;}
        public required DateTime PostedOnDate {get;set;}
        public required DateTime DueTo {get;set;}

        //[InverseProperty("OnAuction")]
        //public required Item AuctionItem {get;set;}

        //[InverseProperty("DuringAuction")]
        //public List<Offer> OfferList{get;set;}

        public Auction()
        {
            
        }

        public Auction(CreateAuctionDTO auction)
        {
            ID = auction.ID;    
            Title = auction.Title;  
            StartingPrice = auction.StartingPrice;  
            CurrentPrice = auction.CurrentPrice;    
            Status = auction.Status;    
            PostedOnDate = auction.PostedOnDate;
            DueTo = auction.DueTo;      
        }

        public Auction(int id, string title,  int startingPrice, int currentPrice, AuctionStatus status, DateTime postedOn, DateTime dueTo)
        {
            ID = id;
            Title = title;
            StartingPrice = startingPrice;
            CurrentPrice = currentPrice;
            Status = status;
            PostedOnDate = postedOn;
            DueTo = dueTo;
        }
    }
}