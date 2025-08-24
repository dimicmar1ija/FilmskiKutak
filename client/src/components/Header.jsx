import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CreatePostForm from "../components/CreatePostForm"; // uvezi formu

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    console.log("Logout successful");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-teal-500 text-white px-4 py-3 z-50 shadow-md">
      <h1
        className="text-xl font-bold flex items-center cursor-pointer"
        onClick={() => navigate("/home")}
      >
        Filmski Kutak{" "}
        <span role="img" aria-label="film-reel" className="ml-2">
          🎬
        </span>
      </h1>

      <div className="flex space-x-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
        >
          Kreiraj post
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Log Out
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded"
        >
          My Profile
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Kreiraj novi post</h2>
            <CreatePostForm
              onPost={() => setIsModalOpen(false)}   // zatvara modal nakon uspešnog posta
              onCancel={() => setIsModalOpen(false)} // zatvara modal klikom na Odustani
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
