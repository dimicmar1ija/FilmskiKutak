import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const Header = () => {
  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);


  const handleLogout = () => {
    logout();
    console.log("Logout successful");
    navigate("/login"); 
  };

  const handleCreatePost = () => {
    navigate("/create-post"); // korisnik ide na Create Post stranicu
  };

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-teal-500 text-white px-4 py-3 z-50 shadow-md">
      <h1 className="text-xl font-bold flex items-center"
      onClick={ () => navigate("/home") }>
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

        <button
        onClick={ () => navigate("/profile") }>
          My Profile
        </button>
      </div>
    </header>
  );
};

export default Header;
