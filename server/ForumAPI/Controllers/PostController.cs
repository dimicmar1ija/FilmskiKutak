using ForumApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ForumAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly PostService _postService;

        public PostController(PostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetAll()
        {
            var posts = await _postService.GetAllAsync();
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetById(string id)
        {
            var post = await _postService.GetByIdAsync(id);
            if (post == null)
                return NotFound();
            return Ok(post);
        }

        [HttpPost]
        public async Task<ActionResult> Create(Post post)
        {
            await _postService.CreateAsync(post);
            return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
        }

        [HttpPut]
public async Task<ActionResult> Update(Post updatedPost)
{
    if (updatedPost == null || string.IsNullOrWhiteSpace(updatedPost.Id))
        return BadRequest("Post ili ID nedostaje.");

    var existingPost = await _postService.GetByIdAsync(updatedPost.Id);
    if (existingPost == null)
        return NotFound();

    await _postService.UpdateAsync(updatedPost);
    return Ok(updatedPost);
}




        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var post = await _postService.GetByIdAsync(id);
            if (post == null)
                return NotFound();

            await _postService.DeleteAsync(post);
            
            return NoContent();
        }

        [HttpGet("by-author/{authoorId}")]
        public async Task<ActionResult<IEnumerable<Post>>> GetByAuthor(string authorId)
        {
            var post = await _postService.GetByAuthorAsync(authorId);
            return Ok(post);
        }

        [HttpGet("by-tag/{tagId}")]
        public async Task<ActionResult<IEnumerable<Post>>> GetByTag(string tagId)
        {
            var posts = await _postService.GetByTagAsync(tagId);
            return Ok(posts);
        }
    }
}