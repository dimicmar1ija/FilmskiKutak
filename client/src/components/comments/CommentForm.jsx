import { useState } from "react";

export default function CommentForm({ postId, parentCommentId = null, onSubmit }) {
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    onSubmit({ postId, body, parentCommentId });
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "left", display: "grid", gap: 8 }}>
      <textarea
        rows={3}
        placeholder={parentCommentId ? "Odgovori na komentar…" : "Napiši komentar…"}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button type="submit">{parentCommentId ? "Odgovori" : "Objavi komentar"}</button>
    </form>
  );
}
