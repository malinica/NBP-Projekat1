using DataLayer.Enums;
using Microsoft.AspNetCore.Http;

namespace DataLayer.DTOs.ItemDTOs
{
    public class UpdateItemDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set;}
        public ItemCategory? Category {get; set;}
        public List<IFormFile>? Pictures {get;set;}
    }
}