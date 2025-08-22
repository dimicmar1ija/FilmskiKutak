import React from "react";
import { useAuth } from "../context/AuthContext";

export const MyProfile = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>No profile data available.</p>;

  return (
    <div className="max-w-md mx-auto mt-8 p-4 font-sans text-black">
      <h2 className="text-center text-2xl font-bold mb-4">My Profile</h2>

      <div className="flex items-center mb-4">
        <img
          src={"/avatar.png"}
          alt="Avatar"
          className="w-16 h-16 rounded-full mr-4 object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{user.username}</h3>
          <p>{user.role}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
        <p><strong>Account created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
