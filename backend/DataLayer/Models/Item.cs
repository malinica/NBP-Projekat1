using DataLayer.DTOs;
using DataLayer.Enums;
using Newtonsoft.Json;
using System;

namespace DataLayer.Models
{
    public class Item
    {
        [Key]
        public int ID { get; set; }

        [Length(2,50)]
        public required string Name { get; set; }
        [Length(2,1000)]
        public required string Description { get; set;}
        public required ItemCategory Category {get; set;}

        // json string sa putanjama
        public required string Pictures {get;set;}

        [InverseProperty("CreatedItems")]
        public User? Author {get;set;}

        [InverseProperty("WonItems")]
        public User? AuctionWinner {get;set;}

        //[InverseProperty("AuctionItem")]
        //public Auction? OnAuction{get;set;}

        // public Item()
        // {
            
        // }
        // public Item(ItemDTO item)
        // {
        //     ID = item.ID;
        //     Name = item.Name ?? string.Empty;  
        //     Description = item.Description ?? string.Empty;  
        //     Category = item.Category ?? string.Empty; 
        // }
        // public Item(int id, string name, string description, string category)
        // {
        //     ID = id;
        //     Name = name;
        //     Description = description;
        //     Category = category;
        // }
    }
}