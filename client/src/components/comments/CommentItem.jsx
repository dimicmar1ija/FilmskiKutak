import { useState } from "react";
import CommentForm from "./CommentForm";

export default function CommentItem({
  node,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onDislike,
  onUnlike,
  onUndislike,
}) {
  const { comment, replies } = node;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.body);
  const [showReply, setShowReply] = useState(false);

  const canEdit = currentUserId && currentUserId === comment.authorId;

  const likes = comment.likedByUserIds?.length ?? 0;
  const dislikes = comment.dislikedByUserIds?.length ?? 0;
  const userLiked = comment.likedByUserIds?.includes(currentUserId);
  const userDisliked = comment.dislikedByUserIds?.includes(currentUserId);

  return (
    <div style={{ borderLeft: "2px solid #ddd", paddingLeft: 12, margin: "12px 0", textAlign: "left" }}>
      {!editing ? (
        <>
          <div style={{ fontSize: 12, color: "#666" }}>Autor: {comment.authorId}</div>
          <div style={{ whiteSpace: "pre-wrap" }}>{comment.body}</div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {new Date(comment.createdAt).toLocaleString()}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
            <button onClick={() => (userLiked ? onUnlike(comment.id) : onLike(comment.id))}>
              👍 {likes}
            </button>
            <button onClick={() => (userDisliked ? onUndislike(comment.id) : onDislike(comment.id))}>
              👎 {dislikes}
            </button>
            <button onClick={() => setShowReply((s) => !s)}>Odgovori</button>
            {canEdit && (
              <>
                <button onClick={() => setEditing(true)}>Izmeni</button>
                <button onClick={() => onDelete(comment.id)} style={{ color: "#e11d48" }}>
                  Obriši
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          <textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                onEdit(comment.id, { body: draft });
                setEditing(false);
              }}
            >
              Sačuvaj
            </button>
            <button onClick={() => { setDraft(comment.body); setEditing(false); }}>
              Otkaži
            </button>
          </div>
        </div>
      )}

      {showReply && (
        <div style={{ marginTop: 8 }}>
          <CommentForm
            postId={comment.postId}
            parentCommentId={comment.id}
            onSubmit={(payload) => {
              onReply(payload);
              setShowReply(false);
            }}
          />
        </div>
      )}

      {replies?.length > 0 && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 12 }}>
          {replies.map((child) => (
            <CommentItem
              key={child.comment.id}
              node={child}
              currentUserId={currentUserId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onDislike={onDislike}
              onUnlike={onUnlike}
              onUndislike={onUndislike}
            />
          ))}
        </div>
      )}
    </div>
  );
}
