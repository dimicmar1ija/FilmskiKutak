import React, { useState, useEffect, useContext } from "react";
import { getAllCategories, createCategory } from "../api/categoryApi"; 
import { createPost as apiCreatePost } from "../api/postApi";           
import { AuthContext } from "../context/AuthContext";                   
import { jwtDecode } from "jwt-decode";
import http from "../api/axiosInstance";


export default function CreatePostForm({ onPost }) {
  const { token } = useContext(AuthContext);                            
  const authorId = token ? (jwtDecode(token)?.sub ?? null) : null; 

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mediaUrls, setMediaUrls] = useState("");
  const [categories, setCategories] = useState([]);     // { id, name } iz baze
  const [selectedTagIds, setSelectedTagIds] = useState([]); // niz ObjectId stringova
  const [tagInput, setTagInput] = useState("");         // koristi se kao "Novi tag"
  const [loadingCats, setLoadingCats] = useState(false);
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState(null);
  
  useEffect(() => {
    const load = async () => {
      setLoadingCats(true);
      try {
        const data = await getAllCategories();
        setCategories(data);
      } 
      finally {
        setLoadingCats(false);
      }
    };
    load();
  }, []);

  const toggleTag = (id) => {
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // helper: pronađi kategoriju po imenu (case-insensitive)
  const byName = (arr, name) =>
    arr.find((c) => c.name.toLowerCase() === name.toLowerCase());

  // kreiraj tag ako ne postoji; vrati njegov ID; auto-selektuj ga
  const ensureTagCreated = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return null;

    // 1) Ako postoji u već učitanim kategorijama — selektuj i gotovo
    const existing = byName(categories, trimmed);
    if (existing) {
      setSelectedTagIds((prev) =>
        prev.includes(existing.id) ? prev : [...prev, existing.id]
      );
      return existing.id;
    }

    // 2) Probaj da ga kreiraš
    try {
      const created = await createCategory({ name: trimmed });
      setCategories((prev) => [...prev, created]);
      setSelectedTagIds((prev) => [...prev, created.id]);
      return created.id;
    } catch (err) {
      // 409 = već postoji u bazi (nismo ga imali u state-u) -> refetch & selektuj
      if (err?.response?.status === 409) {
        const latest = await getAllCategories();
        setCategories(latest || []);
        const cat = byName(latest || [], trimmed);
        if (cat) {
          setSelectedTagIds((prev) =>
            prev.includes(cat.id) ? prev : [...prev, cat.id]
          );
          return cat.id;
        }
      }
      throw err;
    }
  };

const handleAddTag = async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (!tagInput.trim()) return;

    try {
      await ensureTagCreated(tagInput);
      setTagInput("");
    } catch {
      alert("Greška pri dodavanju taga.");
    }
  };

  const removeTag = (id) => {
    setSelectedTagIds(prev => prev.filter(x => x !== id));
  };

function generateObjectId() {
  const hex = [];
  for (let i = 0; i < 24; i++) {
    hex.push(Math.floor(Math.random() * 16).toString(16));
  }
  return hex.join("");
}

const handleSubmit = async (e) => {
  e.preventDefault();
  setPosting(true);
  setErr(null);

  // validacija
  if (!token) {
    setPosting(false);
    setErr("Niste ulogovani.");
    return;
  }

  let sub;
  try {
    sub = jwtDecode(token)?.sub;
  } catch { /* no-op */ }

  if (!sub || !String(sub).trim()) {
    setPosting(false);
    setErr("Ne mogu da očitam authorId iz tokena.");
    return;
  }

  if (!title.trim()) {
    setPosting(false);
    setErr("Naslov (title) je obavezan.");
    return;
  }

  const urls = mediaUrls
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);

  const tagIdsClean = (selectedTagIds || [])
    .map((x) => (x ?? "").toString().trim())
    .filter(Boolean);

  try {
    const nowIso = new Date().toISOString();
    const payload = {
      id: generateObjectId(),       // backend traži i id
      authorId: String(sub).trim(), // iz JWT-a
      title: title.trim(),
      body: body?.trim() || "",
      mediaUrls: urls,
      tagsIds: tagIdsClean,
      createdAt: nowIso,
      updatedAt: nowIso,
      likedByUserIds: []
    };

    const created = await apiCreatePost(payload, token);
    onPost?.(created);

    // reset forme
    setTitle("");
    setBody("");
    setMediaUrls("");
    setSelectedTagIds([]);
    setTagInput("");
  } catch (ex) {
    const data = ex?.response?.data;
    console.error("POST /post error:", data || ex);
    const msg =
      (data?.errors &&
        Object.entries(data.errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" | ")) ||
      data?.title ||
      data?.detail ||
      "Nisam uspeo da sačuvam post.";
    setErr(msg);
  } finally {
    setPosting(false);
  }
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

  const tagPill = (active) => ({
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: active ? '#dbeafe' : '#f4f4f5',
    color: active ? '#1e40af' : '#111827',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    border: '1px solid #d1d5db',
    cursor: 'pointer'
  });

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

        {/* TAGOVI iz baze */}
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ fontWeight: 600 }}>Tagovi</div>
          {loadingCats ? (
            <div>Učitavanje tagova…</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categories.map(c => {
                const active = selectedTagIds.includes(c.id);
                return (
                  <span
                    key={c.id}
                    onClick={() => toggleTag(c.id)}
                    style={tagPill(active)}
                    title={active ? "Ukloni" : "Dodaj"}
                  >
                    {c.name} {active ? "✓" : ""}
                  </span>
                );
              })}
              {!categories.length && <div>Nema postojećih tagova.</div>}
            </div>
          )}

          {/* Novi tag – Enter za kreiranje i auto-selekt */}
          <input
            type="text"
            placeholder="Dodaj novi tag i pritisni Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            style={{ ...inputStyle, boxShadow: '0 0 0 2px #bfdbfe' }}
          />
        </div>

        {err && <div style={{ color: "#e11d48" }}>{err}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', paddingTop: '1rem' }}>
          <button type="button" style={saveDraftButtonStyle}>Save Draft</button>
          <button type="submit" style={submitButtonStyle} disabled={posting}>
            {posting ? "Post..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
