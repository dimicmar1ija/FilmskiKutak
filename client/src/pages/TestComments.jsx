import { useState } from "react";
import CommentThread from "../components/comments/CommentThread";

export default function TestComments() {
  const [postId, setPostId] = useState("");
  const [activeId, setActiveId] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setActiveId(postId.trim());
  };

  return (
    <div style={{ textAlign: "left", display: "grid", gap: 16 }}>
      <h2>Test komentara po PostId</h2>

      <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Nalepi PostId (24-hex ObjectId)"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Učitaj</button>
      </form>

      {!activeId && (
        <div style={{ color: "#666" }}>
          Nalepi PostId gore i klikni “Učitaj”.
          (Bar jedan Post mora postojati u bazi – možeš ga napraviti kroz Swagger.)
        </div>
      )}

      {activeId && (
        <div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
            Trenutni PostId: <code>{activeId}</code>
          </div>
          <CommentThread postId={activeId} />
        </div>
      )}
    </div>
  );
}
