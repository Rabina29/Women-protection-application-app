import { useState } from "react";

function AdminLogin({ onAdminLogin, onBack, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onAdminLogin(email, password);
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-icon">🛡️</div>

        <h1>Admin Login</h1>
        <p>Women Protection Application</p>

        <form onSubmit={handleSubmit}>
          <label>Admin Email</label>
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login to Dashboard
          </button>
        </form>

        <button
          type="button"
          className="admin-back-btn"
          onClick={onRegister}
        >
          Create Admin Account
        </button>

        <button
          type="button"
          className="admin-back-btn"
          onClick={onBack}
        >
          Back to Website
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;