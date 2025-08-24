import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentThread from "../components/comments/CommentThread";
import useCategoriesMap from "../hooks/useCategoriesMap";

dayjs.extend(relativeTime);

export default function PostView({ post }) {
  const { map: categoriesMap } = useCategoriesMap();
  const [showComments, setShowComments] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  const handleToggleComments = () => setShowComments(!showComments);

  const mediaUrls = Array.isArray(post?.mediaUrls) ? post.mediaUrls : [];
  const tagsIds = Array.isArray(post?.tagsIds) ? post.tagsIds : [];
  const likedByUserIds = Array.isArray(post?.likedByUserIds) ? post.likedByUserIds : [];

  const handlePrevMedia = () => {
    if (mediaUrls.length === 0) return;
    setCurrentMediaIndex(prev => prev > 0 ? prev - 1 : mediaUrls.length - 1);
  };

  const handleNextMedia = () => {
    if (mediaUrls.length === 0) return;
    setCurrentMediaIndex(prev => prev < mediaUrls.length - 1 ? prev + 1 : 0);
  };

  const currentMedia = mediaUrls[currentMediaIndex] || null;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 mb-6 transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{post?.title ?? "Untitled Post"}</h2>

        {/* Tags */}
        {tagsIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {tagsIds.map((tagId, i) => (
              <button
                key={i}
                className="text-sm px-3 py-1 rounded-full border border-gray-300 bg-gray-100 hover:bg-yellow-200 transition font-medium"
              >
                {categoriesMap[tagId] ?? tagId}
              </button>
            ))}
          </div>
        )}

        <p className="text-gray-700">{post?.body ?? ""}</p>

        {/* Media Carousel */}
        {currentMedia && (
          <div className="relative w-full min-h-[12rem] bg-gray-100 rounded-xl overflow-hidden flex justify-center items-center">
            {mediaUrls.length > 1 && (
              <button
                onClick={handlePrevMedia}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex justify-center items-center hover:bg-opacity-70 transition"
              >
                ◀
              </button>
            )}

            {(() => {
              try {
                const parsedUrl = new URL(currentMedia);
                if (parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be")) {
                  let videoId = "";
                  if (parsedUrl.hostname.includes("youtube.com")) {
                    videoId = parsedUrl.searchParams.get("v");
                  } else {
                    videoId = parsedUrl.pathname.slice(1);
                  }
                  return (
                    <iframe
                      key={currentMediaIndex}
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      className="w-full h-full rounded-lg"
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
                  className="object-contain w-full h-full rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x360/E2E8F0/1A202C?text=Broken";
                  }}
                />
              );
            })()}

            {mediaUrls.length > 1 && (
              <button
                onClick={handleNextMedia}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex justify-center items-center hover:bg-opacity-70 transition"
              >
                ▶
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 px-6 py-3 border-t border-gray-200">
        <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition">
          ❤️ {likedByUserIds.length}
        </button>
        <button
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition"
          onClick={handleToggleComments}
        >
          💬 Comments {commentsCount ? `(${commentsCount})` : ""}
        </button>
      </div>

      {/* Comments section */}
      {showComments && post?.id && (
        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <CommentThread postId={post.id} onCountChange={setCommentsCount} />
        </div>
      )}
    </div>
  );
}
