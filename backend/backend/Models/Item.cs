namespace backend.Models
{
    public class Item
    {
        [Key]
        public int ID { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set;}
    }
}