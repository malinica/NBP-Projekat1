using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataLayer.DTOs.UserDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService userService;

        public UserController(UserService userService)
        {
            this.userService = userService;
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<AuthResponseDTO>> Register(RegistrationRequestDTO request)
        {
            try {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                AuthResponseDTO response = await userService.Register(request);

                return Ok(response);
            }
            catch(Exception e) {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login([FromBody] LoginRequestDTO request)
        {
            try {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                AuthResponseDTO response = await userService.Login(request);

                return Ok(response);
            }
            catch(Exception e) {
                return BadRequest(e.Message);
            }

        }
    }
}