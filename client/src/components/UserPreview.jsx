import React, { useEffect, useState } from "react";
import { getUsersPreviews } from "../api/userApi";

export const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsersPreviews().then(setUsers).catch(console.error);
  }, []);

  const handleImageError = (e) => {
    e.target.src = "/avatar.png";
  };

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md"
        >
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-12 h-12 rounded-full border"
            onError={handleImageError}
          />
          <div className="flex-1">
            <p className="text-lg font-medium">{user.username}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
