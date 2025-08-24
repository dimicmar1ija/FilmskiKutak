import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentThread from "../components/comments/CommentThread";
import useCategoriesMap from "../hooks/useCategoriesMap";
import { getUserById } from "../api/userApi";

dayjs.extend(relativeTime);

export default function PostView({ post }) {
  const { map: categoriesMap } = useCategoriesMap();
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
    if (mediaUrls.length === 0) return;
    setCurrentMediaIndex(prev => (prev > 0 ? prev - 1 : mediaUrls.length - 1));
  };

  const handleNextMedia = () => {
    if (mediaUrls.length === 0) return;
    setCurrentMediaIndex(prev => (prev < mediaUrls.length - 1 ? prev + 1 : 0));
  };

  const currentMedia = mediaUrls[currentMediaIndex] || null;

  if (loadingAuthor) return <div className="p-4 text-gray-500">Učitavanje autora...</div>;
  if (authorError) return <div className="p-4 text-red-500">{authorError}</div>;

  return (
    <div className="bg-zinc-950 rounded-3xl shadow-xl border border-zinc-800 mb-8 transform hover:scale-[1.01] transition-all duration-300 ease-in-out">

      {/* Zaglavlje sa autorom i vremenom */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <img
            src={author?.avatarUrl ?? "https://placehold.co/56x56/1e293b/d4d4d8?text=U"}
            alt="User Avatar"
            className="w-14 h-14 rounded-full object-cover border-2 border-yellow-500 shadow-md"
          />
          <div>
            <p className="font-bold text-xl text-white">{author?.username ?? "Anonymous"}</p>
            <p className="text-xs text-gray-400 font-sans tracking-wide">
              {post?.createdAt ? dayjs(post.createdAt).format("DD.MM.YYYY HH:mm") : "Nepoznat datum"}
              {isEdited && post?.updatedAt && (
                <span className="ml-2 text-gray-500">
                  (Izmenjeno: {dayjs(post.updatedAt).fromNow()})
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Sadržaj posta */}
      <div className="p-6 flex flex-col gap-5">
        <h2 className="text-4xl font-extrabold text-red-500 drop-shadow-md tracking-wide font-sans">
          {post?.title ?? "Untitled Post"}
        </h2>

        {/* Tags */}
        {tagsIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {tagsIds.map((tagId, i) => (
              <button
                key={i}
                className="text-sm px-4 py-1 rounded-full bg-zinc-800 text-gray-400 hover:bg-yellow-600 hover:text-white transition font-medium tracking-wide"
              >
                {categoriesMap[tagId] ?? tagId}
              </button>
            ))}
          </div>
        )}

        <p className="text-gray-300 leading-relaxed text-lg font-light">{post?.body ?? ""}</p>

        {/* Media Carousel */}
        {currentMedia && (
          <div className="relative w-full aspect-video bg-zinc-800 rounded-3xl overflow-hidden shadow-lg">
            {mediaUrls.length > 1 && (
              <button
                onClick={handlePrevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white w-12 h-12 rounded-full flex justify-center items-center hover:bg-opacity-90 transition-all focus:outline-none focus:ring-4 focus:ring-yellow-400"
              >
                ◀
              </button>
            )}

            {(() => {
              try {
                const parsedUrl = new URL(currentMedia);
                if (parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be")) {
                  let videoId = parsedUrl.hostname.includes("youtube.com") ? parsedUrl.searchParams.get("v") : parsedUrl.pathname.slice(1);
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
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white w-12 h-12 rounded-full flex justify-center items-center hover:bg-opacity-90 transition-all focus:outline-none focus:ring-4 focus:ring-yellow-400"
              >
                ▶
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-8 px-6 py-4 border-t border-zinc-800">
        <button className="flex items-center gap-2 text-gray-400 transition-all duration-200 ease-in-out group">
          <span className="text-2xl group-hover:text-red-500 transition-colors duration-200">❤️</span>
          <span className="text-lg font-bold group-hover:text-white transition-colors duration-200">{likedByUserIds.length}</span>
        </button>
        <button
          className="flex items-center gap-2 text-gray-400 transition-all duration-200 ease-in-out group"
          onClick={handleToggleComments}
        >
          <span className="text-2xl group-hover:text-yellow-400 transition-colors duration-200">💬</span>
          <span className="text-lg font-bold group-hover:text-white transition-colors duration-200">
            Komentari {commentsCount ? `(${commentsCount})` : ""}
          </span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && post?.id && (
        <div className="p-6 bg-zinc-800 border-t border-zinc-700 rounded-b-3xl shadow-inner flex flex-col gap-4">
          <CommentThread
            postId={post.id}
            onCountChange={setCommentsCount}
            className="bg-zinc-800 text-white placeholder-gray-400 rounded-xl p-4"
          />
        </div>
      )}
    </div>
  );
}
