export default function TagChips({ tags = [] }) {
  if (!tags?.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {tags.map((t) => (
        <span key={t.id || t} style={{ padding: "2px 8px", borderRadius: 999, background: "#eee", fontSize: 12 }}>
          {t.name || t}
        </span>
      ))}
    </div>
  );
}
