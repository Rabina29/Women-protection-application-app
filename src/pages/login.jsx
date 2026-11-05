
import { useState } from "react";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        onLogin();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Could not connect to server.");
    }
  };

  return (
    <div className="login-container">
      <h1>Women Protection</h1>
      <h2>Welcome Back!</h2>
      <p>Login to your account</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Don't have an account?{" "}
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onRegister();
          }}
        >
          Register
        </a>
      </p>
    </div>
  );
}

export default Login;
