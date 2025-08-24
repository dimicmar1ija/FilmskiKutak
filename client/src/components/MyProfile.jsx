import React from "react";
import { useAuth } from "../context/AuthContext";
import { UsersList } from "./UserPreview";

export const MyProfile = () => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center text-gray-400 mt-8">Loading profile...</p>;
  if (!user) return <p className="text-center text-gray-400 mt-8">No profile data available.</p>;

  return (
  <div className="page-container">
    {/* Profile Section */}
    <div className="profile-card">
      <h2>My Profile</h2>

      <div className="profile-header">
        <img src={"/avatar.png"} alt="Avatar" />
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

    {/* Other Users Section */}
    <div className="other-users mt-8">
      <h2 className="text-2xl font-bold mb-4">Other Users</h2>
      <UsersList />
    </div>
  </div>
);
};