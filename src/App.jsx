import { useState, useEffect } from "react";
import "./App.css";
import EmergencyNumbers from "./components/EmergencyNumbers";
import Login from "./pages/login";
import Register from "./pages/register";
import Community from "./pages/Community";

const tips = [
  "Plan your route before travelling.",
  "Keep your phone charged.",
  "Share your journey with a trusted person.",
  "Protect your personal information.",
];

function App() {
  const [page, setPage] = useState("Login");
  const [contacts, setContacts] = useState([{ name: "", phone: "" }]);
  const [location, setLocation] = useState("");
  const [incident, setIncident] = useState("");
  const [reports, setReports] = useState([]);
  const [fakeCall, setFakeCall] = useState(false);
  const [message, setMessage] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    fetch("http://localhost:5000/api/status")
      .then((response) => {
        if (!response.ok) throw new Error("Backend request failed");
        return response.json();
      })
      .then((data) => {
        setBackendStatus(
          `${data.message} | Database: ${data.database}`
        );
      })
      .catch(() => setBackendStatus("Backend connection failed."));
  }, []);

  const pages = [
    "Home",
    "Emergency SOS",
    "Emergency Numbers",
    "Contacts",
    "Fake Call",
    "Safety Tips",
    "Report Incident",
    "Nearby Services",
    "Community",
  ];

  const icons = {
    Home: "⌂",
    "Emergency SOS": "🆘",
    "Emergency Numbers": "☎",
    Contacts: "♡",
    "Fake Call": "📞",
    "Safety Tips": "✦",
    "Report Incident": "⚑",
    "Nearby Services": "📍",
    Community: "👥",
  };

  function getLocation() {
    setMessage("");
    if (!navigator.geolocation) {
      setMessage("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(
          `${position.coords.latitude}, ${position.coords.longitude}`
        );
        setMessage("Location retrieved. It has not been shared.");
      },
      () => setMessage("Location permission denied or unavailable.")
    );
  }

  async function submitReport(event) {
    event.preventDefault();
    const trimmedIncident = incident.trim();

    if (!trimmedIncident) {
      setMessage("Please describe the incident.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: trimmedIncident }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Report could not be saved.");
        return;
      }

      setReports((previous) => [...previous, trimmedIncident]);
      setIncident("");
      setMessage("Incident report saved successfully in MongoDB!");
    } catch {
      setMessage("Could not connect to backend. Please check the server.");
    }
  }

  function updateContact(index, field, value) {
    setContacts((previous) =>
      previous.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  }

  function openPage(item) {
    setPage(item);
    setMessage("");
  }

  function renderPage() {
    switch (page) {
      case "Home":
        return (
          <>
            <section className="welcome-banner">
              <div>
                <span className="eyebrow">WOMEN'S SAFETY PLATFORM</span>
                <h1>Your Safety,<br />Our Priority.</h1>
                <p>Stay safe, stay connected. We are here for you.</p>
                <button onClick={() => openPage("Emergency SOS")}>
                  Explore Emergency Support →
                </button>
              </div>
              <div className="welcome-art">🛡️</div>
            </section>

            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR SAFETY TOOLS</span>
                <h2>Explore Features</h2>
              </div>
              <span className="muted">Choose a service</span>
            </div>

            <div className="feature-grid">
              {[
                ["Emergency SOS", "Get emergency support quickly.", "🆘"],
                ["Contacts", "Manage your trusted contacts.", "♡"],
                ["Fake Call", "Simulate an incoming call.", "📞"],
                ["Report Incident", "Report an unsafe incident.", "⚑"],
                ["Community", "Connect and support each other.", "👥"],
              ].map(([name, description, icon]) => (
                <button
                  className="feature-card"
                  key={name}
                  onClick={() => openPage(name)}
                >
                  <span className="feature-icon">{icon}</span>
                  <strong>{name}</strong>
                  <small>{description}</small>
                  <span className="card-arrow">Explore →</span>
                </button>
              ))}
            </div>

            <div className="home-columns">
              <section className="content-card sos-card">
                <span className="eyebrow">NEED HELP?</span>
                <h2>Emergency Support</h2>
                <p>If you are in immediate danger, contact emergency services.</p>
                <button className="sos-button" onClick={() => openPage("Emergency SOS")}>
                  🆘 SOS — Get Help
                </button>
                <small>Demo application. This button does not send a real alert.</small>
              </section>

              <section className="content-card">
                <span className="eyebrow">STAY PREPARED</span>
                <h2>Safety Tips</h2>
                {tips.slice(0, 3).map((tip) => (
                  <p className="tip-line" key={tip}>✓ {tip}</p>
                ))}
                <button className="text-button" onClick={() => openPage("Safety Tips")}>
                  View all tips →
                </button>
              </section>
            </div>

            <div className="home-columns">
              <section className="content-card">
                <span className="eyebrow">COMMUNITY SUPPORT</span>
                <h2>You are not alone</h2>
                <p>Share experiences and support other community members.</p>
                <button onClick={() => openPage("Community")}>Visit Community →</button>
              </section>
              <section className="content-card">
                <span className="eyebrow">HELP AROUND YOU</span>
                <h2>Nearby Services</h2>
                <p>Find hospitals and police stations near your location.</p>
                <button onClick={() => openPage("Nearby Services")}>Find Services →</button>
              </section>
            </div>
          </>
        );

      case "Community":
        return <Community />;

      case "Emergency Numbers":
        return <EmergencyNumbers />;

      case "Emergency SOS":
        return (
          <section className="content-card page-card">
            <span className="eyebrow">EMERGENCY SUPPORT</span>
            <h1>Need Help?</h1>
            <p>In Bangladesh, call 999 if you need emergency assistance.</p>
            <a className="call-link" href="tel:999">☎ Call 999</a>
            <p className="notice">Demo only: the SOS button does not send a real alert.</p>
            <button className="sos-button" onClick={() => setMessage("Demo only: No call, SMS, or emergency alert was sent.")}>
              🆘 SOS — Get Help
            </button>
            <h2>Share Your Location</h2>
            <button onClick={getLocation}>Get My Location</button>
            {location && <p>{location}</p>}
          </section>
        );

      case "Contacts":
        return (
          <section className="content-card page-card">
            <span className="eyebrow">YOUR SAFETY NETWORK</span>
            <h1>Trusted Contacts</h1>
            {contacts.map((contact, index) => (
              <div className="contact-row" key={index}>
                <input
                  placeholder="Contact name"
                  value={contact.name}
                  onChange={(e) => updateContact(index, "name", e.target.value)}
                />
                <input
                  placeholder="Phone number"
                  value={contact.phone}
                  onChange={(e) => updateContact(index, "phone", e.target.value)}
                />
              </div>
            ))}
            <button onClick={() => setContacts((old) => [...old, { name: "", phone: "" }])}>
              + Add Contact
            </button>
            <p className="notice">Contacts are temporary and are not saved to a database yet.</p>
          </section>
        );

      case "Fake Call":
        return (
          <section className="content-card page-card">
            <span className="eyebrow">PERSONAL SAFETY TOOL</span>
            <h1>Fake Call Simulation</h1>
            {fakeCall && <div className="fake-call">☎ Incoming Call — Demo</div>}
            <button onClick={() => setFakeCall((old) => !old)}>
              {fakeCall ? "End Demo Call" : "Simulate Incoming Call"}
            </button>
          </section>
        );

      case "Safety Tips":
        return (
          <section className="content-card page-card">
            <span className="eyebrow">STAY SAFE</span>
            <h1>Safety Tips</h1>
            {tips.map((tip) => <p className="tip-line" key={tip}>✓ {tip}</p>)}
          </section>
        );

      case "Report Incident":
        return (
          <section className="content-card page-card">
            <span className="eyebrow">YOUR VOICE MATTERS</span>
            <h1>Report an Incident</h1>
            <form onSubmit={submitReport}>
              <textarea
                required
                value={incident}
                onChange={(e) => setIncident(e.target.value)}
                placeholder="Describe the incident..."
              />
              <button type="submit">Submit Incident Report</button>
            </form>
            {reports.map((report, index) => <p key={index}>{report}</p>)}
            <small>Submitted reports are sent to the backend for database storage.</small>
          </section>
        );

      case "Nearby Services":
        return (
          <section className="content-card page-card">
            <span className="eyebrow">HELP AROUND YOU</span>
            <h1>Nearby Services</h1>
            <p><a href="https://www.police.gov.bd/" target="_blank" rel="noreferrer">Bangladesh Police website →</a></p>
            <p><a href="https://www.google.com/maps/search/hospitals+near+me/" target="_blank" rel="noreferrer">Find nearby hospitals →</a></p>
            <p><a href="https://www.google.com/maps/search/police+stations+near+me/" target="_blank" rel="noreferrer">Find nearby police stations →</a></p>
          </section>
        );

      default:
        return null;
    }
  }

  if (page === "Login") {
    return <Login onLogin={() => setPage("Home")} onRegister={() => setPage("Register")} />;
  }

  if (page === "Register") {
    return <Register onRegister={() => setPage("Login")} onLogin={() => setPage("Login")} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">♥</span>
          <div><strong>WomenSafe</strong><small>Safety & Support</small></div>
        </div>

        <p className="menu-label">MAIN MENU</p>
        <nav className="side-nav">
          {pages.map((item) => (
            <button
              key={item}
              className={page === item ? "nav-item active" : "nav-item"}
              onClick={() => openPage(item)}
            >
              <span>{icons[item]}</span>{item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-note">
            <span>🛡️</span>
            <strong>You are not alone.</strong>
            <small>Your safety matters to us.</small>
          </div>
          <button className="logout-btn" onClick={() => openPage("Login")}>↪ Logout</button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <span className="eyebrow">WOMEN PROTECTION PLATFORM</span>
            <h2>{page === "Home" ? "Your Safety Dashboard" : page}</h2>
          </div>
          <div className="topbar-right">
            <span className="status-dot"></span>
            <span>Welcome back!</span>
            <span className="profile-icon">👩</span>
          </div>
        </header>

        <main className="dashboard-content">
          {message && <div className="message-box">{message}</div>}
          {renderPage()}
          <p className="backend-status">Backend: {backendStatus}</p>
        </main>

        <footer className="app-footer">
          <strong>Women Protection Application</strong>
          <span>Project 300 · Your Safety, Our Priority.</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
