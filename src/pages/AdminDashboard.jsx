
import { useState } from "react";
import Users from "./Users";
import Reports from "./Reports";
import SOSAlerts from "./SOSAlerts";
import SafetyTips from "./SafetyTips";

function AdminDashboard({ token, onNavigate, onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");

  function handleNavigate(page) {
    setActivePage(page);
    onNavigate(page);
  }

  return (
    <div className="admin-dashboard">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>🛡️ WomenSafe</h2>
        <p>Admin Panel</p>

        <nav>
          <button onClick={() => handleNavigate("Dashboard")}>
            🏠 Dashboard
          </button>

          <button onClick={() => handleNavigate("Users")}>
            👥 Manage Users
          </button>

          <button onClick={() => handleNavigate("Reports")}>
            📋 Reports
          </button>

          <button onClick={() => handleNavigate("SOSAlerts")}>
            🚨 SOS Alerts
          </button>

          <button onClick={() => handleNavigate("SafetyTips")}>
            💡 Safety Tips
          </button>
        </nav>

        <button className="admin-logout" onClick={onLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">

        <header className="admin-topbar">
          <h1>Admin Dashboard</h1>
          <span>Welcome, Admin 👋</span>
        </header>

        {activePage === "Dashboard" && (
          <>
            <h2>Overview</h2>
            <p>Welcome to Women Protection Admin Panel.</p>

            <div className="admin-stats">
              <div className="stat-card">
                <h3>Total Users</h3>
                <h1>0</h1>
                <p>Registered Users</p>
              </div>

              <div className="stat-card">
                <h3>Total Reports</h3>
                <h1>0</h1>
                <p>Incident Reports</p>
              </div>

              <div className="stat-card">
                <h3>SOS Alerts</h3>
                <h1>0</h1>
                <p>Emergency Requests</p>
              </div>

              <div className="stat-card">
                <h3>Pending Reports</h3>
                <h1>0</h1>
                <p>Need Review</p>
              </div>
            </div>

            <section className="admin-activity">
              <h2>Recent Activity</h2>
              <p>No recent activity available.</p>
            </section>
          </>
        )}

        {activePage === "Users" && <Users />}

        {activePage === "Reports" && (
          <Reports token={token} />
        )}

        {activePage === "SOSAlerts" && <SOSAlerts />}

        {activePage === "SafetyTips" && <SafetyTips />}

      </main>
    </div>
  );
}

export default AdminDashboard;
