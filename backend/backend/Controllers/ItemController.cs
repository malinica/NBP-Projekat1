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
        private readonly UserService userService;

        public ItemController(ItemService itemService, UserService userService)
        {
            this.itemService = itemService;
            this.userService = userService;
        }

        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult<ItemResultDTO>> Create([FromForm] CreateItemDTO itemDTO) {
            try {
                var user = await userService.GetCurrentUser(User);
                var item = await itemService.Create(itemDTO, user?.Id ?? "");

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

        [HttpGet("GetItemsFromUser/{username}")]
        public async Task<ActionResult<PaginatedResponseDTO<ItemResultDTO>>> GetItemsFromUser(
            string username,
            [FromQuery] int? page = null, 
            [FromQuery] int? pageSize = null
        ) {
            try {
                var items = await itemService.GetItemsByUser(username, page ?? 1, pageSize ?? 10);
                return Ok(items);
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var user = await userService.GetCurrentUser(User);

                var isDeleted = await itemService.DeleteItem(id, user?.Id ?? "");
                if (isDeleted)
                {
                    return NoContent(); 
                }
                return BadRequest("Neuspešno brisanje predmeta.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
    }
}