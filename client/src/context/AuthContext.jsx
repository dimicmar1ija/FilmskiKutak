import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { getUserProfile } from "../api/userApi";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jwt") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile by decoding token
  const fetchUser = async (jwt) => {
    try {
      const decoded = jwtDecode(jwt);
      const userData = await getUserProfile(decoded.sub);
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setUser(null);
    }
  };

  // Called when user logs in
  const login = async (jwt) => {
    setToken(jwt);
    localStorage.setItem("jwt", jwt);
    await fetchUser(jwt);
  };

  // Called when user logs out
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwt");
  };

  // Auto-load user on refresh if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        await fetchUser(token);
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
