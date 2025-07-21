// components/Login.js
import React, { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import "./Login.css"; // Import the CSS

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => axios.post("/Auth/login", { username, password }),
    onSuccess: (res) => {
      login(res.data.token);
      navigate("/home");
    },
    onError: () => alert("Login failed"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
        >
        Go to Register
        </button>
      </form>
    </div>
  );
};

export default Login;
