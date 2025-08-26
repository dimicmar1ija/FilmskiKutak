import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/userApi";

export const UserProfile = () => {
  const { id } = useParams(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserById(id)
      .then(setUser)
      .catch(console.error);
  }, [id]);

  if (!user) return <p className="text-center mt-8">Loading user...</p>;

  return (
  <div className="page-container">
    <div className="profile-card">
      <div className="profile-header">
        <img src="/avatar.png" alt="Avatar" />
        <div>
          <h3>{user.username}</h3>
          <p>{user.role}</p>
        </div>
      </div>

      <div className="profile-details">
        <p><strong>Email:</strong> {user.email}</p>
        {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
        <p><strong>Account created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  </div>
);

};
