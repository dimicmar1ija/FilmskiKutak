using ForumAPI.Models;
using MongoDB.Driver;

namespace ForumAPI.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly IMongoCollection<Comment> _comments;

        public CommentRepository(IMongoDatabase database)
        {
            _comments = database.GetCollection<Comment>("Comments");
        }

        public async Task<List<Comment>> GetByPostIdAsync(string postId)
        {
            return await _comments.Find(c => c.PostId == postId).ToListAsync();
        }

        public async Task<Comment> GetByIdAsync(string id)
        {
            return await _comments.Find(c => c.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(Comment comment)
        {
            await _comments.InsertOneAsync(comment);
        }

        public async Task UpdateAsync(Comment comment)
        {
            await _comments.ReplaceOneAsync(c => c.Id == comment.Id, comment);
        }

        public async Task DeleteAsync(string id)
        {
            await _comments.DeleteOneAsync(c => c.Id == id);
        }
    }
}
