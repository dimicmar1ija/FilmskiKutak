import { useState } from "react";
import { usePosts } from "../context/PostContext";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";

export function Home() {
  const { posts, loading, error, addPost, updatePost } = usePosts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Otvori modal za kreiranje novog posta
  const openModalForCreate = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  // Otvori modal za izmenu postojećeg posta
  const openModalForEdit = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>

      <button
        onClick={openModalForCreate}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Kreiraj post
      </button>

      <div className="mt-6 flex flex-col gap-4 w-full">
        {loading && <p className="text-gray-500 w-full">Učitavanje postova...</p>}
        {error && <p className="text-red-500 w-full">{error}</p>}
        {!loading && !error && sortedPosts.length === 0 && (
          <p className="text-gray-500 w-full">Nema postova za prikaz.</p>
        )}
        {!loading && !error && sortedPosts.length > 0 &&
          sortedPosts.map((post) => (
            <div key={post.id || post._id} className="w-1/2 mb-4">
              <PostCard post={post} onEdit={openModalForEdit} />
            </div>
          ))
        }
      </div>

      {/* Modal za kreiranje/izmenu */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingPost ? "Izmeni post" : "Kreiraj novi post"}
            </h2>
            <CreatePostForm
              existingPost={editingPost}
              onPost={(post) => {
                if (editingPost) {
                  updatePost(post); // izmeni postojeći
                } else {
                  addPost(post);    // dodaj novi
                }
                setIsModalOpen(false);
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
