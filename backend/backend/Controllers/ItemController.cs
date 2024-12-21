using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataLayer.DTOs;
using DataLayer.DTOs.ItemDTOs;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly ItemService itemService;

        public ItemController(ItemService itemService)
        {
            this.itemService = itemService;
        }

        [HttpPost("create")]
        public async Task<ActionResult<int>> Create([FromBody] CreateItemDTO itemDTO) {
            try {
                var itemID = await itemService.Create(itemDTO);

                return Ok(itemID);
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

        // [HttpGet("item/{key}")]
        // public string Get(string key)
        // {
        //     string value = itemService.Get(key);
        //     return value;
        // }

        // [HttpPost("item/{key}")]
        // public string Set(string key, [FromBody]ItemDTO item)
        // {
        //     bool result = itemService.Set(key, item);
        //     if(result)
        //         return "Uspesno sacuvan podatak o Item-u.";

        //     return "Neuspesno cuvanje podatka o Item-u.";
        // }
    }
}