using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

public class Post
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("title")]
    public string Title { get; set; }

    [BsonElement("body")]
    public string Body { get; set; }

    [BsonElement("authorId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string AuthorId { get; set; }

    [BsonElement("tags")]
    public List<string> Tags { get; set; } = new List<string>();

    [BsonElement("createdAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime CreatedAt { get; set; }

    [BsonElement("updatedAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime UpdatedAt { get; set; }

    [BsonElement("commentsCount")]
    public int CommentsCount { get; set; }
}
