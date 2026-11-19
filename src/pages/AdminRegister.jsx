
import { useState } from "react";

function AdminRegister({ onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setName("");
        setEmail("");
        setPassword("");
        setShowPassword(false);
      }
    } catch (error) {
      setMessage("Could not connect to backend.");
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-icon">🛡️</div>
        <h1>Admin Registration</h1>
        <p>Create your Admin Account</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Admin Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit">
            Create Admin Account
          </button>
        </form>

        {message && <p>{message}</p>}

        <button
          type="button"
          className="admin-back-btn"
          onClick={onBack}
        >
          Back to Admin Login
        </button>
      </div>
    </div>
  );
}

export default AdminRegister;
