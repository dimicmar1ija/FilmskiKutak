namespace ForumApi.Services
{
    public class PostService
    {
        private readonly IPostRepository _repo;
        public PostService(IPostRepository repo)
        {
            _repo = repo;
        }

        public Task<Post> GetByIdAsync(string id) => _repo.GetByIdAsync(id);

        public Task<IEnumerable<Post>> GetAllAsync() => _repo.GetAllAsync();

        public Task<IEnumerable<Post>> GetByTagAsync(string tagId) => _repo.GetByTagAsync(tagId);

        public Task<IEnumerable<Post>> GetByAuthorAsync(string authorId) => _repo.GetByAuthorAsync(authorId);

        public Task CreateAsync(Post post) => _repo.CreateAsync(post);

        public Task UpdateAsync(Post post) => _repo.UpdateAsync(post);

        public Task DeleteAsync(Post post) => _repo.DeleteAsync(post);



    }
}