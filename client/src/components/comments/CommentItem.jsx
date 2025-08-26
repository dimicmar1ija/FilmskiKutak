import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { getUserById } from "../../api/userApi"; 

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
  const [authorName, setAuthorName] = useState("Učitavanje...");

  // Dohvatanje username na osnovu authorId
  useEffect(() => {
    if (comment.authorId) {
      getUserById(comment.authorId)
        .then((user) => setAuthorName(user.username))
        .catch(() => setAuthorName("Nepoznat korisnik"));
    }
  }, [comment.authorId]);

  const canEdit = currentUserId && currentUserId === comment.authorId;

  const likes = comment.likedByUserIds?.length ?? 0;
  const dislikes = comment.dislikedByUserIds?.length ?? 0;
  const userLiked = comment.likedByUserIds?.includes(currentUserId);
  const userDisliked = comment.dislikedByUserIds?.includes(currentUserId);

  return (
    <div className="border-l-2 border-zinc-700 pl-3 mt-3" style={{ textAlign: "left" }}>
      {!editing ? (
        <>
          {/* Autor */}
          <div className="text-sm text-yellow-500">Autor: {authorName}</div>

          {/* Tekst komentara */}
          <div className="whitespace-pre-wrap text-gray-200">{comment.body}</div>

          {/* Datum */}
          <div className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </div>

          {/* Akcije */}
          <div className="flex gap-3 mt-2 items-center">
            {/* Lajk */}
            <button
              onClick={() => (userLiked ? onUnlike(comment.id) : onLike(comment.id))}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors ${
                userLiked
                  ? "bg-green-600 text-white"
                  : "bg-zinc-700 text-gray-300 hover:bg-green-500 hover:text-white"
              }`}
            >
              <FaThumbsUp /> {likes}
            </button>

            {/* Dislajk */}
            <button
              onClick={() => (userDisliked ? onUndislike(comment.id) : onDislike(comment.id))}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors ${
                userDisliked
                  ? "bg-red-600 text-white"
                  : "bg-zinc-700 text-gray-300 hover:bg-red-500 hover:text-white"
              }`}
            >
              <FaThumbsDown /> {dislikes}
            </button>

            {/* Odgovori */}
            <button
              onClick={() => setShowReply((s) => !s)}
              className="px-2 py-1 rounded-full text-sm bg-zinc-700 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors"
            >
              Odgovori
            </button>

            {/* Izmeni i Obriši (samo za autora) */}
            {canEdit && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="px-2 py-1 rounded-full text-sm bg-zinc-700 text-gray-300 hover:bg-yellow-500 hover:text-black transition-colors"
                >
                  Izmeni
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="px-2 py-1 rounded-full text-sm bg-red-600 text-white hover:bg-red-500 transition-colors"
                >
                  Obriši
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        // Forma za editovanje
        <div className="grid gap-2 mt-2">
          <textarea
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full p-3 rounded-xl placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            style={{
              backgroundColor: "#111827",
              color: "#facc15",
              caretColor: "#fbbf24",
              border: "1px solid #374151",
            }}
            placeholder="Napiši komentar..."
          />

          <div className="flex gap-2">
            <button
              onClick={() => {
                onEdit(comment.id, { body: draft });
                setEditing(false);
              }}
              className="px-3 py-1 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
            >
              Sačuvaj
            </button>
            <button
              onClick={() => {
                setDraft(comment.body);
                setEditing(false);
              }}
              className="px-3 py-1 bg-zinc-700 text-white rounded-full hover:bg-zinc-600 transition-colors"
            >
              Otkaži
            </button>
          </div>
        </div>
      )}

      {/* Forma za reply */}
      {showReply && (
        <div className="mt-2">
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

      {/* Rekurzivno renderovanje ugnježdenih odgovora */}
      {replies?.length > 0 && (
        <div className="mt-2 flex flex-col gap-3">
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
