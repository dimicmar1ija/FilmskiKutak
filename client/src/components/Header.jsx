// Header.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // Simulacija `useContext` i `useNavigate`
  const logout = () => {
    console.log("Logout successful");
  };

  const navigate = (path) => {
    console.log(`Navigating to ${path}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // Korisnik ide na login stranicu
  };

  return (
   <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-teal-500 text-white px-4 py-3 z-50 shadow-md">
  {/* Naslov sa ikonom filmske trake */}
  <h1 className="text-xl font-bold flex items-center">
    Filmski Kutak <span role="img" aria-label="film-reel" className="ml-2">🎬</span>
  </h1>

  {/* Dugme za odjavu */}
  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
  >
    Log Out
  </button>
</header>
  );
};

export default Header;
