using MongoDB.Driver;

public class PostRepository : IPostRepository
{
    private readonly IMongoCollection<Post> _posts;

    public PostRepository(IMongoDatabase database)

    {
        _posts = database.GetCollection<Post>("Posts");
    }

    public async Task CreateAsync(Post post)
    {
        await _posts.InsertOneAsync(post);
    }

    public async Task DeleteAsync(Post post)
    {
        if (post==null || string.IsNullOrEmpty(post.Id))
        await _posts.DeleteOneAsync(p => p.Id == post.Id);
    }

    public async Task<IEnumerable<Post>> GetAllAsync()
    {
       return await _posts.Find(_=>true).ToListAsync();
    }

    public async Task<IEnumerable<Post>> GetByAuthorAsync(string authorId)
    {
        return await _posts.Find(post => post.AuthorId == authorId).ToListAsync();
    }

    public async Task<Post> GetByIdAsync(string id)
    {
         return await _posts.Find(post=>post.Id==id).FirstOrDefaultAsync();
    }

    public Task<IEnumerable<Post>> GetByTagAsync(string tagId)
    {
        throw new NotImplementedException();
    }

    public async Task UpdateAsync(Post post)
    {
        await _posts.ReplaceOneAsync(p => p.Id == post.Id, post);
    }
}