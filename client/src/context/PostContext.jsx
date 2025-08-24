import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Učitavanje postova sa API-ja
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5132/api/Post");
        setPosts(res.data);  // Backend vraća listu postova
      } catch (err) {
        console.error("Greška pri učitavanju postova:", err);
        setError("Ne mogu da učitam postove");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Dodavanje novog posta lokalno (nakon uspešnog POST request-a)
  const addPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, loading, error }}>
      {children}
    </PostContext.Provider>
  );
};
