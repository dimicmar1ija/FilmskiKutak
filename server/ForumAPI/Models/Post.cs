using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Post
{

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public required string Id { get; set; }

    public required string AuthorId { get; set; }

    public required string Title { get; set; }

    public required string Body { get; set; }

    public List<string> MediaUrls { get; set; }

    public List<string> TagsIds { get; set; } = new();

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public List<string> LikedByUserIds { get; set; } = new();

    public bool IsEdited => CreatedAt != UpdatedAt;

}