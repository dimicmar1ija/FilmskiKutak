import { NavLink, Link } from "react-router-dom";
import { usePosts } from "../context/PostContext";
import PostCard from "../components/PostCard";

export function Home() {
  const { posts } = usePosts();

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
        {posts.length === 0 ? (
          <p className="text-gray-500">Nema postova za prikaz.</p>
        ) : (
          posts.map((post, i) => <PostCard key={i} post={post} />)
        )}
      </div>
    </div>
  );
}
