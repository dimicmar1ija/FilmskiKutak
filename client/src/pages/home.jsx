import { NavLink, Link } from "react-router-dom";
import { usePosts } from "../context/PostContext";
import PostCard from "../components/PostCard";

export function Home() {
  const { posts, loading, error } = usePosts();

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

      <div className="mt-6 space-y-4">
        {loading && <p className="text-gray-500">Učitavanje postova...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="text-gray-500">Nema postova za prikaz.</p>
        )}
        {!loading && !error && posts.length > 0 && (
          posts.map((post) => <PostCard key={post.id || post._id} post={post} />)
        )}
      </div>
    </div>
  );
}