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
        public async Task<ActionResult<int>> Create([FromForm] CreateItemDTO itemDTO) {
            try {
                var itemID = await itemService.Create(itemDTO);

                return Ok(itemID);
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ItemResultDTO>> Get(int id) {
            try {
                var item = await itemService.GetItem(id);
                return Ok(item);
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }
    }
}