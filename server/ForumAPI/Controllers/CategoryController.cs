using ForumAPI.Models;
using ForumAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ForumAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _service;

        public CategoryController(CategoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var cats = await _service.GetAllAsync();
            return Ok(cats);
        }

        [HttpPost]
        // [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] CategoryCreateDto dto)
        {
            var category = new Category
            {
                Name = dto.Name
                // Id se generiše automatski u bazi ili u repozitorijumu
            };

            await _service.CreateAsync(category);
            return Ok(category);
        }
    }
}
