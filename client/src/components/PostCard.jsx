import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentThread from "../components/comments/CommentThread";
import useCategoriesMap from "../hooks/useCategoriesMap";
import { deletePost } from "../api/postApi";
import { getUserById } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import CreatePostForm from "./CreatePostForm";

dayjs.extend(relativeTime);

export default function PostView({ post, onEdit, onDelete }) {
  const { map: categoriesMap } = useCategoriesMap();
  const { user: currentUser } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  const [author, setAuthor] = useState(null);
  const [loadingAuthor, setLoadingAuthor] = useState(true);
  const [authorError, setAuthorError] = useState(null);

  const mediaUrls = Array.isArray(post?.mediaUrls) ? post.mediaUrls : [];
  const tagsIds = Array.isArray(post?.tagsIds) ? post.tagsIds : [];
  const likedByUserIds = Array.isArray(post?.likedByUserIds) ? post.likedByUserIds : [];

  const isEdited = post?.updatedAt && post?.updatedAt !== post?.createdAt;

  const canEditOrDelete =
    currentUser &&
    (String(currentUser.id) === String(post.authorId) || currentUser.role === "admin");

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!post?.authorId) {
        setLoadingAuthor(false);
        return;
      }
      try {
        setLoadingAuthor(true);
        const user = await getUserById(post.authorId);
        setAuthor(user);
      } catch (err) {
        console.error("Greška pri učitavanju autora:", err);
        setAuthorError("Ne mogu da učitam podatke o autoru.");
      } finally {
        setLoadingAuthor(false);
      }
    };
    fetchAuthor();
  }, [post?.authorId]);

  const handleToggleComments = () => setShowComments(!showComments);

  const handlePrevMedia = () => {
    if (!mediaUrls.length) return;
    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaUrls.length - 1));
  };

  const handleNextMedia = () => {
    if (!mediaUrls.length) return;
    setCurrentMediaIndex((prev) => (prev < mediaUrls.length - 1 ? prev + 1 : 0));
  };

  const handleDelete = async () => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj post?")) return;
    try {
      await deletePost(post.id);
      onDelete?.(post.id);
    } catch (err) {
      console.error(err);
      alert("Greška pri brisanju posta.");
    }
  };

  if (loadingAuthor) return <div className="p-4 text-gray-500">Učitavanje autora...</div>;
  if (authorError) return <div className="p-4 text-red-500">{authorError}</div>;

  const currentMedia = mediaUrls[currentMediaIndex] || null;

  return (
    <div className="bg-zinc-950 rounded-3xl shadow-xl border border-zinc-800 mb-8 transform hover:scale-[1.01] transition-all duration-300 ease-in-out">
      
      {/* Zaglavlje */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <img
            src={author?.avatarUrl ?? "https://placehold.co/56x56/1e293b/d4d4d8?text=U"}
            alt="Avatar"
            className="w-14 h-14 rounded-full object-cover border-2 border-yellow-500 shadow-md"
          />
          <div>
            <p className="font-bold text-xl text-white">{author?.username ?? "Anonymous"}</p>
            <p className="text-xs text-gray-400">
              {post?.createdAt ? dayjs(post.createdAt).format("DD.MM.YYYY HH:mm") : "Nepoznat datum"}
              {isEdited && post?.updatedAt && (
                <span className="ml-2 text-gray-500">(Izmenjeno: {dayjs(post.updatedAt).fromNow()})</span>
              )}
            </p>
          </div>
        </div>

        {/* Dugmad za Edit/Delete */}
        {canEditOrDelete && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(post)}
              className="px-4 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-500 transition"
            >
              Izmeni
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-500 transition"
            >
              Obriši
            </button>
          </div>
        )}
      </div>

      {/* Sadržaj */}
      <div className="p-6 flex flex-col gap-5">
        <h2 className="text-4xl font-extrabold text-red-500">{post?.title ?? "Untitled Post"}</h2>

        {/* Tagovi */}
        {tagsIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {tagsIds.map((tagId, i) => (
              <button
                key={i}
                className="text-sm px-4 py-1 rounded-full bg-zinc-800 text-gray-400 hover:bg-yellow-600 hover:text-white transition"
              >
                {categoriesMap[tagId] ?? tagId}
              </button>
            ))}
          </div>
        )}

        <p className="text-gray-300">{post?.body ?? ""}</p>

        {/* Media Carousel */}
        {currentMedia && (
          <div className="relative w-full aspect-video bg-zinc-800 rounded-3xl overflow-hidden shadow-lg">
            {mediaUrls.length > 1 && (
              <button
                onClick={handlePrevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white w-12 h-12 rounded-full flex justify-center items-center hover:bg-opacity-90 transition"
              >
                ◀
              </button>
            )}

            {(() => {
              try {
                const parsedUrl = new URL(currentMedia);
                if (parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be")) {
                  const videoId = parsedUrl.hostname.includes("youtube.com")
                    ? parsedUrl.searchParams.get("v")
                    : parsedUrl.pathname.slice(1);
                  return (
                    <iframe
                      key={currentMediaIndex}
                      src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                      title="YouTube video player"
                      className="w-full h-full rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  );
                }
              } catch {}
              return (
                <img
                  key={currentMediaIndex}
                  src={currentMedia}
                  alt="media preview"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/720x405/333333/ffffff?text=Video+nedostupan"; }}
                />
              );
            })()}

            {mediaUrls.length > 1 && (
              <button
                onClick={handleNextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white w-12 h-12 rounded-full flex justify-center items-center hover:bg-opacity-90 transition"
              >
                ▶
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-8 px-6 py-4 border-t border-zinc-800">
        <button className="flex items-center gap-2 text-gray-400">
          <span className="text-2xl">❤️</span>
          <span className="text-lg font-bold">{likedByUserIds.length}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400" onClick={handleToggleComments}>
          <span className="text-2xl">💬</span>
          <span className="text-lg font-bold">Komentari {commentsCount ? `(${commentsCount})` : ""}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && <CommentThread postId={post.id} onCountChange={setCommentsCount} />}
    </div>
  );
}