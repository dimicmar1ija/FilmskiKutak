import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Mock data for demonstration
const mockComments = [
  { 
    id: 1, 
    author: "Korisnik 1", 
    text: "Odličan post! Sviđa mi se tema.", 
    createdAt: new Date(), 
    likedByUserIds: [], 
    replies: [] 
  },
  { 
    id: 2, 
    author: "Korisnik 2", 
    text: "Da li planirate da dodate još ovakvih postova?", 
    createdAt: new Date(Date.now() - 3600000), 
    likedByUserIds: ['user1'],
    replies: [
      {
        id: 3,
        author: "Korisnik 3",
        text: "Ja se nadam! Volim ovu vrstu sadržaja.",
        createdAt: new Date(Date.now() - 1800000),
        likedByUserIds: [],
        replies: []
      }
    ]
  },
];

// Helper function to find a comment and its parent by ID
const findComment = (comments, id) => {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === id) {
      return { comment: comments[i], parent: null };
    }
    if (comments[i].replies.length > 0) {
      const found = findComment(comments[i].replies, id);
      if (found) {
        return { comment: found.comment, parent: comments[i] };
      }
    }
  }
  return null;
};

// Component for a single Comment, including its replies
function Comment({ comment, onAddReply, onToggleLike }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [newReplyText, setNewReplyText] = useState("");

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (newReplyText.trim() === "") return;
    onAddReply(comment.id, newReplyText);
    setNewReplyText("");
    setShowReplyForm(false);
  };

  const commentCardStyle = {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    marginBottom: '0.75rem'
  };

  const commentActionStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem'
  };
  
  const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: '#6b7280',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    fontWeight: '500',
    fontSize: '0.75rem',
    transition: 'color 0.3s ease',
  };

  const replyFormStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
  };

  const replyInputStyle = {
    flexGrow: 1,
    padding: '0.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    outline: 'none',
  };

  const replyButtonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
  };
  
  const likeButtonStyle = {
    ...actionButtonStyle,
    ':hover': {
      color: '#ef4444' 
    }
  };

  const replyButtonStyle_hover = {
    ...actionButtonStyle,
    ':hover': {
      color: '#4f46e5' 
    }
  };

  return (
    <div style={commentCardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{comment.author}</span>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{dayjs(comment.createdAt).fromNow()}</span>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>{comment.text}</p>
      
      <div style={commentActionStyle}>
        <button 
          onClick={() => onToggleLike(comment.id)} 
          style={likeButtonStyle}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={comment.likedByUserIds.length > 0 ? "text-red-500" : "text-gray-400"}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
          <span style={{ fontSize: '0.75rem' }}>{comment.likedByUserIds.length} Likes</span>
        </button>
        <button 
          onClick={() => setShowReplyForm(!showReplyForm)} 
          style={replyButtonStyle_hover}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9.32 9.32 0 0 1 4 16c0-4.64 3.5-8.41 8-8.41s8 3.77 8 8.41c0 2.22-.84 4.31-2.42 5.86L19 23l-2-4.38a9.32 9.32 0 0 1-9.1 1.38Z"/></svg>
          <span style={{ fontSize: '0.75rem' }}>Reply</span>
        </button>
      </div>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} style={replyFormStyle}>
          <input
            type="text"
            value={newReplyText}
            onChange={(e) => setNewReplyText(e.target.value)}
            placeholder="Napišite odgovor..."
            style={replyInputStyle}
          />
          <button type="submit" style={replyButtonStyle}>
            Objavi
          </button>
        </form>
      )}

      {comment.replies.length > 0 && (
        <div style={{ paddingLeft: '1rem', marginTop: '1rem', borderLeft: '2px solid #e5e7eb' }}>
          {comment.replies.map((reply) => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              onAddReply={onAddReply} 
              onToggleLike={onToggleLike} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostView({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const newCommentObject = {
      id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
      author: "Trenutni Korisnik",
      text: newComment,
      createdAt: new Date(),
      likedByUserIds: [],
      replies: []
    };
    setComments([...comments, newCommentObject]);
    setNewComment("");
  };

  const handleAddReply = (parentId, text) => {
    const newReply = {
      id: Math.random(), 
      author: "Trenutni Korisnik",
      text: text,
      createdAt: new Date(),
      likedByUserIds: [],
      replies: []
    };
    
    const updatedComments = [...comments];
    const target = findComment(updatedComments, parentId);

    if (target && target.comment) {
      target.comment.replies.push(newReply);
      setComments(updatedComments);
    }
  };

  const handleToggleLike = (commentId) => {
    const updatedComments = [...comments];
    const target = findComment(updatedComments, commentId);
    
    if (target && target.comment) {
      const isLiked = target.comment.likedByUserIds.includes('Trenutni Korisnik'); 
      if (isLiked) {
        target.comment.likedByUserIds = target.comment.likedByUserIds.filter(id => id !== 'Trenutni Korisnik');
      } else {
        target.comment.likedByUserIds.push('Trenutni Korisnik');
      }
      setComments(updatedComments);
    }
  };

  // Navigation functions for the media carousel
  const handlePrevMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : post.mediaUrls.length - 1
    );
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex < post.mediaUrls.length - 1 ? prevIndex + 1 : 0
    );
  };

  const postCardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    marginBottom: '1rem',
    transition: 'all 0.3s ease-in-out',
  };

  const postContentStyle = {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  };

  const actionContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '1.5rem',
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e2e8f0',
  };

  const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#6b7280',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  };

  const commentsSectionStyle = {
    padding: '1.5rem',
    backgroundColor: '#f7f7f7',
    borderTop: '1px solid #e2e8f0',
    borderRadius: '0 0 0.75rem 0.75rem',
  };

  const commentFormStyle = {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  };

  const commentInputStyle = {
    flexGrow: 1,
    padding: '0.75rem',
    borderRadius: '0.75rem',
    border: '1px solid #d1d5db',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  const commentButtonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const likeButtonStyle = {
    ...actionButtonStyle,
    ':hover': {
      color: '#ef4444' 
    }
  };

  const commentLikeButtonStyles = {
    ...actionButtonStyle,
    ':hover': {
      color: '#4f46e5' 
    }
  }

  const carouselContainerStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '12rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    marginBottom: '0.75rem'
  };

  const carouselNavButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'background-color 0.2s',
  };

  const mediaPreviewStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  };

  const currentMedia = post.mediaUrls[currentMediaIndex];

  return (
    <div style={postCardStyle}>
      {/* Glavni Sadržaj Posta */}
      <div style={postContentStyle}>
        <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1f2937' }}>{post.title}</h2>
        
        {/* Tagovi (ažurirano) */}
        {post.tagsIds.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginTop: '-0.25rem' }}>
            {post.tagsIds.map((tag, i) => (
              <button
                key={i}
                onClick={() => console.log(`Kliknuli ste na tag: ${tag}`)}
                style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: '#f0f4f8', 
                  color: '#4b5563', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '9999px',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease',
                  fontWeight: '500',
                  outline: 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f0f4f8'; }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        
        <p style={{ color: '#4b5563' }}>{post.body}</p>
        
        {/* Mediji Carousel */}
        {post.mediaUrls.length > 0 && (
          <div style={carouselContainerStyle}>
            {/* Previous Button */}
            {post.mediaUrls.length > 1 && (
              <button
                type="button"
                onClick={handlePrevMedia}
                style={{ ...carouselNavButtonStyle, left: '0.5rem' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
            )}
            
            {/* Current Media */}
            {(() => {
              try {
                const parsedUrl = new URL(currentMedia);
                if (parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be")) {
                  let videoId = "";
                  if (parsedUrl.hostname.includes("youtube.com")) {
                    videoId = parsedUrl.searchParams.get("v");
                  } else if (parsedUrl.hostname.includes("youtu.be")) {
                    videoId = parsedUrl.pathname.slice(1);
                  }
                  return (
                    <iframe
                      key={currentMediaIndex}
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ aspectRatio: '16 / 9', borderRadius: '0.5rem' }}
                    ></iframe>
                  );
                }
              } catch (err) {
                // Fallback to image if URL is not a valid video
              }
              return (
                <img
                  key={currentMediaIndex}
                  src={currentMedia}
                  alt="media preview"
                  style={mediaPreviewStyle}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/600x360/E2E8F0/1A202C?text=Broken`;
                  }}
                />
              );
            })()}

            {/* Next Button */}
            {post.mediaUrls.length > 1 && (
              <button
                type="button"
                onClick={handleNextMedia}
                style={{ ...carouselNavButtonStyle, right: '0.5rem' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lajkovi i Komentari Sekcija */}
      <div style={actionContainerStyle}>
        <button style={likeButtonStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.04.24-4.5 2-1.46-1.76-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          <span style={{ fontSize: '0.875rem' }}>{post.likedByUserIds.length} Likes</span>
        </button>
        <button style={commentLikeButtonStyles} onClick={handleToggleComments}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9.32 9.32 0 0 1 4 16c0-4.64 3.5-8.41 8-8.41s8 3.77 8 8.41c0 2.22-.84 4.31-2.42 5.86L19 23l-2-4.38a9.32 9.32 0 0 1-9.1 1.38Z"/></svg>
          <span style={{ fontSize: '0.875rem' }}>{comments.length} Comments</span>
        </button>
      </div>

      {/* Komentari Sekcija (prikazuje se na klik) */}
      {showComments && (
        <div style={commentsSectionStyle}>
          {/* Forma za novi komentar */}
          <form onSubmit={handleAddComment} style={commentFormStyle}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Napišite komentar..."
              style={commentInputStyle}
            />
            <button type="submit" style={commentButtonStyle}>
              Objavi
            </button>
          </form>

          {/* Lista komentara */}
          {comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {comments.map((comment) => (
                <Comment 
                  key={comment.id} 
                  comment={comment} 
                  onAddReply={handleAddReply} 
                  onToggleLike={handleToggleLike} 
                />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
              Nema još komentara. Budite prvi!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
