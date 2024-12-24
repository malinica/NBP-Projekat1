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
        private readonly UserManager<User> _userManager;
        private readonly UserService userService;

        public UserController(UserService userService, UserManager<User> userManager)
        {
            this.userService = userService;
            this._userManager = userManager;
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

        [HttpGet("ProveriUsername/{username}")]
        public async Task<ActionResult> ProveriUsername([FromRoute]string username){
            try{
                var korisnik = await _userManager.FindByNameAsync(username);
                bool postoji = korisnik!=null;
                return Ok(postoji);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("ProveriEmail/{email}")]
        public async Task<ActionResult> ProveriEmail([FromRoute]string email){
            try{
                var korisnik = await _userManager.FindByEmailAsync(email);
                bool postoji = korisnik!=null;
                return Ok(postoji);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}