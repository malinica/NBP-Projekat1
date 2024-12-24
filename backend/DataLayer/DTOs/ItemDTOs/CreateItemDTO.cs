using DataLayer.Enums;
using Microsoft.AspNetCore.Http;

namespace DataLayer.DTOs.ItemDTOs
{
    public class CreateItemDTO
    {
        public required string Name { get; set; }
        public required string Description { get; set;}
        public required ItemCategory Category {get; set;}
        public required List<IFormFile> Pictures {get;set;}
    }
}