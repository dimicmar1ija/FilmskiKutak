using ForumApi.Services;
using ForumAPI.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ForumApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [Authorize()]
        [HttpGet("previews")]
        public async Task<IActionResult> GetUserPreviews()
        {
            var users = await _userService.GetAllAsync();

            var previews = users.Select(u => new UserPreviewDto
            {
                Id = u.Id,
                Username = u.Username,
                AvatarUrl = u.AvatarUrl
            });

            return Ok(previews);
        }

        // GET: api/user
        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllAsync();

            var userDtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt,
                Bio = u.Bio,
                AvatarUrl = u.AvatarUrl
            });

            return Ok(userDtos);
        }

        
        // GET: api/user/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            var userDto = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                Bio = user.Bio,
                AvatarUrl = user.AvatarUrl
            };

            return Ok(userDto);
        }

        // PUT: api/user/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            var currentUserId = User.FindFirst("id")?.Value ?? "0";
            var isAdmin = User.IsInRole("admin");

            if (currentUserId != id && !isAdmin)
                return Forbid();

            user.Email = updateUserDto.Email ?? user.Email;
            user.Username = updateUserDto.Username ?? user.Username;
            // Password updates should be separate

            await _userService.UpdateAsync(user);
            return Ok("User updated successfully.");
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserAsync(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            await _userService.DeleteAsync(id);
            return Ok("User deleted successfully.");
        }

    }
}