import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Home() {
  const [name, setName] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    await login(name);
    localStorage.setItem("user", name);
    nav("/dashboard");
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h1 className="title">Welcome to Voting App</h1>
      <p className="subtitle">Login or create your username to continue</p>

      <div className="roomInput">
        <input placeholder="Enter Username" onChange={e => setName(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
