using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DataLayer.DTOs;
using DataLayer.DTOs.ItemDTOs;
using Microsoft.AspNetCore.Authorization;


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
        [Authorize]
        public async Task<ActionResult<ItemResultDTO>> Create([FromForm] CreateItemDTO itemDTO) {
            try {
                var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);//nece da procita id
                var item = await itemService.Create(itemDTO, userId ?? "");

                return Ok(item);
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