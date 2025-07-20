using ForumAPI.Models;
using ForumAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ForumAPI.Dtos;
using ForumApi.Services;

namespace ForumAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _service;
        private readonly PostService _postService;


        public CommentController(CommentService service, PostService postService)
        {
            _service = service;
            _postService = postService;
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

        [HttpDelete("{commentId}")]
        [Authorize] 
        public async Task<IActionResult> DeleteComment(string commentId)
        {
            string userId = User.FindFirst("sub")?.Value; 
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var comment = await _service.GetByIdAsync(commentId);
            if (comment == null)
                return NotFound("Komentar nije pronađen.");

            if (comment.AuthorId == userId)
            {
                await _service.DeleteAsync(commentId);
                return NoContent();
            }

            // Ako nije vlasnik komentara, proveri da li je vlasnik posta
            var post = await _postService.GetByIdAsync(comment.PostId);
            if (post == null)
                return NotFound("Post nije pronađen.");

            if (post.AuthorId == userId)
            {
                await _service.DeleteAsync(commentId);
                return NoContent();
            }

            // Ako nije ni vlasnik komentara ni vlasnik posta, zabranjeno
            return Forbid("Nemate dozvolu za brisanje ovog komentara.");
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateComment(string id, [FromBody] CommentUpdateDto dto)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null)
                return NotFound();
            
            //id korisnika
            var userId = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            
            //da li je korisnik autor komentara
            if (existing.AuthorId != userId)
                return Forbid();

            //azuriranje
            existing.Body = dto.Body;
            existing.UpdatedAt = DateTime.UtcNow;

            await _service.UpdateComment(existing);
            return NoContent();
        }

        [HttpPost("{commentId}/like/{userId}")]
        public async Task<IActionResult> LikeComment(string commentId, string userId)
        {
            var result = await _service.LikeComment(commentId, userId);
            if (result)
                return Ok();
            else
                return BadRequest("User has already liked this comment.");
        }

        [HttpPost("{commentId}/dislike/{userId}")]
        public async Task<IActionResult> DislikeComment(string commentId, string userId)
        {
            var result = await _service.DislikeComment(commentId, userId);
            if (result)
                return Ok();
            else
                return BadRequest("User has already disliked this comment.");
        }

        [HttpPost("{commentId}/unlike/{userId}")]
        public async Task<IActionResult> UnlikeComment(string commentId, string userId)
        {
            var result = await _service.UnlikeComment(commentId, userId);
            if (result)
                return Ok();
            else
                return BadRequest("User hasn't liked this comment yet.");
        }

        [HttpPost("{commentId}/undislike/{userId}")]
        public async Task<IActionResult> UndislikeComment(string commentId, string userId)
        {
            var result = await _service.UndislikeComment(commentId, userId);
            if (result)
                return Ok();
            else
                return BadRequest("User hasn't disliked this comment yet.");
        }

    }

}
