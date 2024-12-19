using DataLayer.DTOs;
using Newtonsoft.Json;
using System;

namespace DataLayer.Models
{
    public  class Item
    {
        [Key]
        public int ID { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set;}
        public required string Category {get; set;}

        //public required List<string> Pictures {get;set;}

        //public User Author {get;set;}
        public Item()
        {
            
        }
        public Item(ItemDTO item)
        {
            ID = item.ID;
            Name = item.Name ?? string.Empty;  
            Description = item.Description ?? string.Empty;  
            Category = item.Category ?? string.Empty; 
        }
        public Item(int id, string name, string description, string category)
        {
            ID = id;
            Name = name;
            Description = description;
            Category = category;
        }
    }
}