import { NavLink, Link } from "react-router-dom";
import { usePosts } from "../context/PostContext";
import PostCard from "../components/PostCard";

export function Home() {
  const { posts, loading, error } = usePosts();

  // Sortiranje po vremenu dodavanja: poslednji dodati post na vrhu
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA; // descending order
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>
      <p className="mb-4">This is the home page of our application.</p>

      <NavLink to="/login" className="text-blue-500 underline mr-4">
        Go to Login Page
      </NavLink>

      <Link to="/test/comments" className="text-blue-500 underline mr-4">
        💬 Test komentara (po PostId)
      </Link>

      <div className="mt-6 flex flex-col gap-4 w-full">
        {loading && <p className="text-gray-500 w-full">Učitavanje postova...</p>}
        {error && <p className="text-red-500 w-full">{error}</p>}
        {!loading && !error && sortedPosts.length === 0 && (
          <p className="text-gray-500 w-full">Nema postova za prikaz.</p>
        )}
        {!loading && !error && sortedPosts.length > 0 &&
          sortedPosts.map((post) => (
            <div
              key={post.id || post._id}
              className="w-1/2 mb-4" // 50% širine, levo poravnato
            >
              <PostCard post={post} />
            </div>
          ))
        }
      </div>
    </div>
  );
}
