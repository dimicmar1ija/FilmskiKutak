using ForumAPI.Models;
using ForumAPI.Repositories;

namespace ForumAPI.Services
{
    public class ThreadedComment
    {
        public Comment Comment { get; set; }
        public List<ThreadedComment> Replies { get; set; } = new();
    }

    public class CommentService
    {
        private readonly ICommentRepository _repo;

        public CommentService(ICommentRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<ThreadedComment>> GetThreadedCommentsForPost(string postId)
        {
            var all = await _repo.GetByPostIdAsync(postId);
            var lookup = all.ToDictionary(c => c.Id, c => new ThreadedComment { Comment = c });

            List<ThreadedComment> roots = new();

            foreach (var c in all)
            {
                if (string.IsNullOrEmpty(c.ParentCommentId))
                    roots.Add(lookup[c.Id]);
                else if (lookup.ContainsKey(c.ParentCommentId))
                    lookup[c.ParentCommentId].Replies.Add(lookup[c.Id]);
            }

            return roots;
        }

        public async Task CreateComment(Comment comment)
        {
            await _repo.CreateAsync(comment);
        }
    }
}
