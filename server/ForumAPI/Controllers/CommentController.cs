using ForumAPI.Models;
using ForumAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ForumAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _service;

        public CommentController(CommentService service)
        {
            _service = service;
        }

        [HttpGet("post/{postId}/threaded")]
        public async Task<IActionResult> GetThreadedComments(string postId)
        {
            var result = await _service.GetThreadedCommentsForPost(postId);
            return Ok(result);
        }

        [HttpPost]
        //[Authorize]
        public async Task<IActionResult> CreateComment([FromBody] CommentCreateDto dto)
        {
            var comment = new Comment
            {
                PostId = dto.PostId,
                AuthorId = dto.AuthorId,
                ParentCommentId = dto.ParentCommentId,
                Body = dto.Body,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _service.CreateComment(comment);
            return Ok(comment);
        }
    }
}
