import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../api/axiosInstance";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", { username, email, password });
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + err);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
      <button
        type="button"
        onClick={() => navigate("/login")}
        style={{ marginLeft: "10px" }}
      >
        Go to Login
      </button>
    </form>
  );
};
