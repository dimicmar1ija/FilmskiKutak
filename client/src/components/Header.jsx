import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout successful");
    navigate("/login"); // korisnik ide na login stranicu
  };

  const handleCreatePost = () => {
    navigate("/create-post"); // korisnik ide na Create Post stranicu
  };

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-teal-500 text-white px-4 py-3 z-50 shadow-md">
      <h1 className="text-xl font-bold flex items-center">
        Filmski Kutak <span role="img" aria-label="film-reel" className="ml-2">🎬</span>
      </h1>

      <div className="flex space-x-2">
        <button
          onClick={handleCreatePost}
          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
        >
          Create Post
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Log Out
        </button>
      </div>
    </header>
  );
};

export default Header;
