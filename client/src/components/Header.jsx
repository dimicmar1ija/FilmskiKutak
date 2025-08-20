// Header.jsx
import React from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // 
    navigate("/");     
  };

  return (
    <header className="flex justify-between items-center bg-blue-600 text-white px-4 py-3">
      <h1 className="text-xl font-bold">Filmski Kutak</h1>
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
