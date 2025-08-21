import React, { useState } from "react";

export default function CreatePostForm({ onPost }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mediaUrls, setMediaUrls] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      authorId: "currentUser",
      title,
      body,
      mediaUrls: mediaUrls
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== ""),
      link: link.trim() || null,
      tagsIds: tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      likedByUserIds: [],
    };

    onPost(newPost);
    // Reset form
    setTitle("");
    setBody("");
    setMediaUrls("");
    setLink("");
    setTags([]);
    setTagInput("");
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const formStyle = {
    width: '100%',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxSizing: 'border-box'
  };

  const inputStyle = {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '0.75rem',
    padding: '0.5rem 1rem',
    outline: 'none',
    boxSizing: 'border-box'
  };
  
  const submitButtonStyle = {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: '600',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const saveDraftButtonStyle = {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#e5e7eb',
    color: '#4b5563',
    fontWeight: '600',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const tagStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '1rem' }}>
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ ...inputStyle, outline: 'none', boxShadow: '0 0 0 2px #bfdbfe' }}
        />

        {/* Body (Text) */}
        <textarea
          placeholder="Text (optional)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ ...inputStyle, minHeight: '8rem', outline: 'none', boxShadow: '0 0 0 2px #bfdbfe', resize: 'vertical' }}
        />

        {/* Media */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Image/Video URLs (comma separated)"
            value={mediaUrls}
            onChange={(e) => setMediaUrls(e.target.value)}
            style={{ ...inputStyle, outline: 'none', boxShadow: '0 0 0 2px #bfdbfe' }}
          />
          {/* Image Preview */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {mediaUrls
              .split(",")
              .map((url) => url.trim())
              .filter((url) => url !== "")
              .map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="media preview"
                  style={{ width: '5rem', height: '5rem', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/80x80/E2E8F0/1A202C?text=Broken`;
                  }}
                />
              ))}
          </div>
        </div>

        {/* Link */}
        <input
          type="text"
          placeholder="Link to a page (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={{ ...inputStyle, outline: 'none', boxShadow: '0 0 0 2px #bfdbfe' }}
        />

        {/* Tags */}
        <div>
          <input
            type="text"
            placeholder="Add a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            style={{ ...inputStyle, outline: 'none', boxShadow: '0 0 0 2px #bfdbfe' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={tagStyle}
                onClick={() => removeTag(tag)}
              >
                {tag} &times;
              </span>
            ))}
          </div>
        </div>
        
        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', paddingTop: '1rem' }}>
          <button
            type="button"
            style={{ ...saveDraftButtonStyle, '&:hover': { backgroundColor: '#d1d5db' } }}
          >
            Save Draft
          </button>
          <button
            type="submit"
            style={{ ...submitButtonStyle, '&:hover': { backgroundColor: '#2563eb' } }}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
