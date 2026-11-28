
import LegalGuide from "./components/LegalGuide";
import Contact from "./components/Contact";
import TransportComplaint from "./pages/TransportComplaint";
import { useState, useEffect } from "react";
import "./App.css";

import EmergencyNumbers from "./components/EmergencyNumbers";
import Login from "./pages/login";
import Register from "./pages/register";
import Community from "./pages/Community";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegister from "./pages/AdminRegister";
import SafeRoute from "./pages/SafeRoute";
import SafetyCheckIn from "./pages/SafetyCheckIn";
import EvidenceLocker from "./pages/EvidenceLocker";
import DirectComplaint from "./pages/DirectComplaint";
import LiveLocation from "./pages/LiveLocation";
import PersonalSafetyChecklist from "./pages/PersonalSafetyChecklist";
import WomenSafetyQuiz from "./pages/WomenSafetyQuiz";
import SelfDefenseCards from "./pages/SelfDefenseCards";
import HelpFAQ from "./components/HelpFAQ";
import EmergencyMessageTemplates from "./components/EmergencyMessageTemplates";

function App() {
  const [page, setPage] = useState("Login");

  const [userEmail, setUserEmail] = useState("");
  const [userToken, setUserToken] = useState("");

  const [contacts, setContacts] = useState([
    { name: "", phone: "" },
  ]);

  const [location, setLocation] = useState("");
  const [incident, setIncident] = useState("");
  const [reports, setReports] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [fakeCall, setFakeCall] = useState(false);

  const [message, setMessage] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking...");

  const [adminPage, setAdminPage] = useState("Dashboard");
  const [adminToken, setAdminToken] = useState("");

  const [sosSending, setSosSending] = useState(false);

  const [tips, setTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState("");

  const pages = [
    "Home",
    "Emergency SOS",
    "Emergency Numbers",
    "Contacts",
    "Fake Call",
    "Safety Tips",
    "Report Incident",
    "My Report History",
    "Nearby Services",
    "Community",
    "Safe Route",
    "Public Transport Complaint",
    "Safety Check-in Timer",
    "Evidence Locker",
    "Direct Complaint Submission",
    "Live Location Sharing",
    "Personal Safety Checklist",
    "Women Safety Awareness Quiz",
    "Self-Defense Learning Cards",
    "Women Rights & Legal Guide",
    "Help & FAQ",
    "Emergency Message Templates",
  ];

  const icons = {
    Home: "⌂",
    "Emergency SOS": "🆘",
    "Emergency Numbers": "☎",
    Contacts: "♡",
    "Fake Call": "📞",
    "Safety Tips": "✦",
    "Report Incident": "⚑",
    "My Report History": "📋",
    "Nearby Services": "📍",
    Community: "👥",
    "Safe Route": "🗺️",
    "Public Transport Complaint": "🚌",
    "Safety Check-in Timer": "⏱️",
    "Evidence Locker": "🔐",
    "Direct Complaint Submission": "📨",
    "Live Location Sharing": "📍",
    "Personal Safety Checklist": "✓",
    "Women Safety Awareness Quiz": "📝",
    "Self-Defense Learning Cards": "🥋",
    "Women Rights & Legal Guide": "⚖️",
    "Help & FAQ": "❓",
    "Emergency Message Templates": "📩",
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/status")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.json();
      })
      .then((data) => {
        setBackendStatus(
          `${data.message} | Database: ${data.database}`
        );
      })
      .catch(() => {
        setBackendStatus("Backend connection failed.");
      });
  }, []);

  // Load Safety Tips from MongoDB
  useEffect(() => {
    if (page !== "Home" && page !== "Safety Tips") return;

    async function fetchSafetyTips() {
      setTipsLoading(true);
      setTipsError("");

      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/safety-tips"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Could not load safety tips.");
        }

        setTips(data);
      } catch (error) {
        console.log("Safety Tips Error:", error);
        setTipsError("Could not load safety tips.");
      } finally {
        setTipsLoading(false);
      }
    }

    fetchSafetyTips();
  }, [page]);

  // Load My Report History from MongoDB
  useEffect(() => {
    if (page !== "My Report History") return;

    async function fetchMyReports() {
      setHistoryLoading(true);

      try {
        const response = await fetch(
          "http://localhost:5000/api/reports/my",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load report history."
          );
        }

        setMyReports(data);
      } catch (error) {
        console.log("My Report History Error:", error);
        setMessage(error.message);
      } finally {
        setHistoryLoading(false);
      }
    }

    fetchMyReports();
  }, [page, userToken]);

  function openPage(item) {
    setPage(item);
    setMessage("");
  }

  function handleLogout() {
    setUserEmail("");
    setUserToken("");
    setMessage("");
    setPage("Login");
  }

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
        setMessage("Location retrieved successfully.");
      },
      () => {
        setMessage("Location permission denied or unavailable.");
      }
    );
  }

  // Save SOS Alert in MongoDB
  async function sendSOS() {
    if (sosSending) return;

    setSosSending(true);
    setMessage("Sending SOS alert...");

    try {
      const response = await fetch(
        "http://localhost:5000/api/sos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: location || "Location not provided",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "SOS failed.");
      }

      setMessage(
        "SOS alert saved successfully! Admin can view this alert."
      );
    } catch (error) {
      console.log("SOS Error:", error);
      setMessage(
        "SOS alert could not be saved. Please check backend."
      );
    } finally {
      setSosSending(false);
    }
  }

  // Submit Incident Report
  async function submitReport(event) {
    event.preventDefault();

    const trimmedIncident = incident.trim();

    if (!trimmedIncident) {
      setMessage("Please describe the incident.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            description: trimmedIncident,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Report could not be saved.");
        return;
      }

      setReports((previous) => [
        ...previous,
        trimmedIncident,
      ]);

      setIncident("");
      setMessage("Incident report saved successfully in MongoDB!");
    } catch (error) {
      setMessage(
        "Could not connect to backend. Please check the server."
      );
    }
  }

  function updateContact(index, field, value) {
    setContacts((previous) =>
      previous.map((contact, i) =>
        i === index
          ? { ...contact, [field]: value }
          : contact
      )
    );
  }

  // Admin Login
  async function handleAdminLogin(email, password) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Admin login failed.");
        return;
      }

      setAdminToken(data.token);
      setAdminPage("Dashboard");
      setMessage("");
      setPage("AdminDashboard");
    } catch (error) {
      setMessage("Could not connect to backend.");
    }
  }

  // User Login
  if (page === "Login") {
    return (
      <Login
        onLogin={(email, token) => {
          setUserEmail(email);
          setUserToken(token);
          setPage("Home");
        }}
        onRegister={() => setPage("Register")}
        onAdminClick={() => setPage("AdminLogin")}
      />
    );
  }

  // User Register
  if (page === "Register") {
    return (
      <Register
        onRegister={() => setPage("Login")}
        onLogin={() => setPage("Login")}
      />
    );
  }

  // Admin Login
  if (page === "AdminLogin") {
    return (
      <AdminLogin
        onAdminLogin={handleAdminLogin}
        onRegister={() => setPage("AdminRegister")}
        onBack={() => setPage("Login")}
      />
    );
  }

  // Admin Register
  if (page === "AdminRegister") {
    return (
      <AdminRegister
        onBack={() => setPage("AdminLogin")}
      />
    );
  }

  // Admin Dashboard
  if (page === "AdminDashboard") {
    return (
      <AdminDashboard
        token={adminToken}
        onNavigate={setAdminPage}
        onLogout={() => {
          setAdminToken("");
          setAdminPage("Dashboard");
          setPage("Login");
        }}
      />
    );
  }

  function renderPage() {
    switch (page) {
      case "Home":
        return (
          <>
            <section className="welcome-banner">
              <div>
                <span className="eyebrow">
                  WOMEN'S SAFETY PLATFORM
                </span>

                <h1>
                  Your Safety,
                  <br />
                  Our Priority.
                </h1>

                <p>
                  Stay safe, stay connected. We are here for you.
                </p>

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
                ["Safe Route", "Find a route to your destination.", "🗺️"],
                ["Public Transport Complaint", "Submit a public transport complaint.", "🚌"],
                ["Safety Check-in Timer", "Set a timer to confirm you are safe.", "⏱️"],
                ["Evidence Locker", "Store and view your important evidence.", "🔐"],
                ["Direct Complaint Submission", "Submit a complaint through the demo platform.", "📨"],
                ["Live Location Sharing", "Share your current location securely.", "📍"],
                ["Personal Safety Checklist", "Check your safety before going outside.", "✓"],
                ["Women Safety Awareness Quiz", "Test your knowledge about women's safety.", "📝"],
                ["Self-Defense Learning Cards", "Learn simple personal safety and self-defense tips.", "🥋"],
                ["Women Rights & Legal Guide", "Learn about women's rights and safety.", "⚖️"],
                ["Help & FAQ", "Find answers to common questions.", "❓"],
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

                <p>
                  If you are in immediate danger, contact emergency
                  services.
                </p>

                <button
                  className="sos-button"
                  onClick={() => openPage("Emergency SOS")}
                >
                  🆘 SOS — Get Help
                </button>

                <small>
                  SOS alerts are saved in the application database.
                </small>
              </section>

              <section className="content-card">
                <span className="eyebrow">STAY PREPARED</span>
                <h2>Safety Tips</h2>

                {tipsLoading ? (
                  <p>Loading safety tips...</p>
                ) : tipsError ? (
                  <p>{tipsError}</p>
                ) : tips.length > 0 ? (
                  tips.slice(0, 3).map((tip) => (
                    <p className="tip-line" key={tip._id}>
                      ✓ {tip.tip}
                    </p>
                  ))
                ) : (
                  <p>No safety tips available yet.</p>
                )}

                <button
                  className="text-button"
                  onClick={() => openPage("Safety Tips")}
                >
                  View all tips →
                </button>
              </section>
            </div>

            <div className="home-columns">
              <section className="content-card">
                <span className="eyebrow">COMMUNITY SUPPORT</span>
                <h2>You are not alone</h2>
                <p>
                  Share experiences and support other community members.
                </p>
                <button onClick={() => openPage("Community")}>
                  Visit Community →
                </button>
              </section>

              <section className="content-card">
                <span className="eyebrow">HELP AROUND YOU</span>
                <h2>Nearby Services</h2>
                <p>
                  Find hospitals and police stations near your location.
                </p>
                <button onClick={() => openPage("Nearby Services")}>
                  Find Services →
                </button>
              </section>
            </div>
          </>
        );
case "Women Rights & Legal Guide":
  return <LegalGuide />;
  case "Help & FAQ":
  return <HelpFAQ />;
  case "Emergency Message Templates":
  return <EmergencyMessageTemplates />;
      case "Live Location Sharing":
        return (
          <LiveLocation
            userEmail={userEmail}
            token={userToken}
          />
        );

      case "Personal Safety Checklist":
        return <PersonalSafetyChecklist />;

      case "Women Safety Awareness Quiz":
        return <WomenSafetyQuiz />;

      case "Self-Defense Learning Cards":
        return <SelfDefenseCards />;

      case "Public Transport Complaint":
        return <TransportComplaint />;

      case "Community":
        return <Community />;

      case "Emergency Numbers":
        return <EmergencyNumbers />;

      case "Safe Route":
        return <SafeRoute />;

      case "Safety Check-in Timer":
        return <SafetyCheckIn />;

      case "Evidence Locker":
        return <EvidenceLocker />;

      case "Direct Complaint Submission":
        return <DirectComplaint />;

      case "Emergency SOS":
        return (
          <section className="content-card page-card">
            <span className="eyebrow">EMERGENCY SUPPORT</span>
            <h1>Need Help?</h1>

            <p>
              In Bangladesh, call 999 if you need emergency assistance.
            </p>

            <a className="call-link" href="tel:999">
              ☎ Call 999
            </a>

            <button
              className="sos-button"
              onClick={sendSOS}
              disabled={sosSending}
            >
              {sosSending ? "Sending SOS..." : "🆘 SOS — Get Help"}
            </button>

            <h2>Share Your Location</h2>

            <button onClick={getLocation}>
              Get My Location
            </button>

            {location && <p>{location}</p>}

            <p className="notice">
              This application saves SOS alerts in its database.
              It does not automatically call or message emergency services.
            </p>
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
                  onChange={(event) =>
                    updateContact(index, "name", event.target.value)
                  }
                />

                <input
                  placeholder="Phone number"
                  value={contact.phone}
                  onChange={(event) =>
                    updateContact(index, "phone", event.target.value)
                  }
                />
              </div>
            ))}

            <button
              onClick={() =>
                setContacts((old) => [
                  ...old,
                  { name: "", phone: "" },
                ])
              }
            >
              + Add Contact
            </button>

            <button
              onClick={async () => {
                const userEmail = localStorage.getItem("userEmail");

                if (!userEmail) {
                  alert("Please login first.");
                  return;
                }

                try {
                  for (const contact of contacts) {
                    if (!contact.name || !contact.phone) continue;

                    await fetch("http://localhost:5000/api/contacts", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        userEmail,
                        name: contact.name,
                        phone: contact.phone,
                      }),
                    });
                  }

                  alert("Contacts saved successfully!");
                } catch (error) {
                  alert("Failed to save contacts.");
                }
              }}
            >
              Save Contacts
            </button>
          </section>
        );

      case "Fake Call":
        return (
          <section className="content-card page-card">
            <span className="eyebrow">PERSONAL SAFETY TOOL</span>
            <h1>Fake Call Simulation</h1>

            {fakeCall && (
              <div className="fake-call">
                ☎ Incoming Call — Demo
              </div>
            )}

            <button onClick={() => setFakeCall((old) => !old)}>
              {fakeCall
                ? "End Demo Call"
                : "Simulate Incoming Call"}
            </button>
          </section>
        );

      case "Safety Tips":
        return (
          <section className="content-card page-card">
            <span className="eyebrow">STAY SAFE</span>
            <h1>Safety Tips</h1>

            {tipsLoading ? (
              <p>Loading safety tips...</p>
            ) : tipsError ? (
              <p>{tipsError}</p>
            ) : tips.length > 0 ? (
              tips.map((tip) => (
                <p className="tip-line" key={tip._id}>
                  ✓ {tip.tip}
                </p>
              ))
            ) : (
              <p>No safety tips available yet.</p>
            )}
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
                onChange={(event) => setIncident(event.target.value)}
                placeholder="Describe the incident..."
              />

              <button type="submit">
                Submit Incident Report
              </button>
            </form>

            {reports.map((report, index) => (
              <p key={index}>{report}</p>
            ))}

            <small>
              Submitted reports are sent to the backend for database storage.
            </small>
          </section>
        );

      case "My Report History":
        return (
          <section className="content-card page-card">
            <span className="eyebrow">YOUR SUBMITTED REPORTS</span>
            <h1>My Report History</h1>

            {historyLoading ? (
              <p>Loading your reports...</p>
            ) : myReports.length === 0 ? (
              <p>You have not submitted any reports yet.</p>
            ) : (
              myReports.map((report) => (
                <div
                  className="content-card"
                  key={report._id}
                  style={{ marginBottom: "15px" }}
                >
                  <h3>Incident Report</h3>

                  <p>{report.description}</p>

                  <p>
                    <strong>Status: </strong>
                    {report.status || "Pending"}
                  </p>

                  <small>
                    Submitted:{" "}
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleString()
                      : "Date not available"}
                  </small>
                </div>
              ))
            )}
          </section>
        );

      case "Nearby Services":
        return (
          <section className="content-card page-card">
            <span className="eyebrow">HELP AROUND YOU</span>
            <h1>Nearby Services</h1>

            <p>
              <a
                href="https://www.police.gov.bd/"
                target="_blank"
                rel="noreferrer"
              >
                Bangladesh Police website →
              </a>
            </p>

            <p>
              <a
                href="https://www.google.com/maps/search/hospitals+near+me/"
                target="_blank"
                rel="noreferrer"
              >
                Find nearby hospitals →
              </a>
            </p>

            <p>
              <a
                href="https://www.google.com/maps/search/police+stations+near+me/"
                target="_blank"
                rel="noreferrer"
              >
                Find nearby police stations →
              </a>
            </p>
          </section>
        );

      default:
        return null;
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">♥</span>
          <div>
            <strong>WomenSafe</strong>
            <small>Safety & Support</small>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav className="side-nav">
          {pages.map((item) => (
            <button
              key={item}
              className={
                page === item ? "nav-item active" : "nav-item"
              }
              onClick={() => openPage(item)}
            >
              <span>{icons[item]}</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-note">
            <span>🛡️</span>
            <strong>You are not alone.</strong>
            <small>Your safety matters to us.</small>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <span className="eyebrow">
              WOMEN PROTECTION PLATFORM
            </span>

            <h2>
              {page === "Home" ? "Your Safety Dashboard" : page}
            </h2>
          </div>

          <div className="topbar-right">
            <span className="status-dot"></span>
            <span>Welcome back!</span>
            <span className="profile-icon">👩</span>
          </div>
        </header>

        <main className="dashboard-content">
          {message && (
            <div className="message-box">{message}</div>
          )}

          {renderPage()}

          <p className="backend-status">
            Backend: {backendStatus}
          </p>
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
