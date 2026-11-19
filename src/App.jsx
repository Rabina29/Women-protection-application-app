
import { useState, useEffect } from "react";
import "./App.css";
import EmergencyNumbers from "./components/EmergencyNumbers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegister from "./pages/AdminRegister";

function App() {
  const [page, setPage] = useState("Login");
  const [contacts, setContacts] = useState([{ name: "", phone: "" }]);
  const [location, setLocation] = useState("");
  const [incident, setIncident] = useState("");
  const [reports, setReports] = useState([]);
  const [fakeCall, setFakeCall] = useState(false);
  const [message, setMessage] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [adminPage, setAdminPage] = useState("Dashboard");
  const [adminToken, setAdminToken] = useState("");
  const [sosSending, setSosSending] = useState(false);

  // Safety Tips State
  const [tips, setTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState("");

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
    if (page !== "Safety Tips") return;

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
        setTipsError(
          "Could not load safety tips. Please check backend."
        );
      } finally {
        setTipsLoading(false);
      }
    }

    fetchSafetyTips();
  }, [page]);

  const pages = [
    "Home",
    "Emergency SOS",
    "Emergency Numbers",
    "Contacts",
    "Fake Call",
    "Safety Tips",
    "Report Incident",
    "Nearby Services",
  ];

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
      () => {
        setMessage("Location permission denied or unavailable.");
      }
    );
  }

  // Send SOS Alert to Backend
  async function sendSOS() {
    if (sosSending) return;

    setSosSending(true);
    setMessage("Sending SOS alert...");

    try {
      const response = await fetch("http://localhost:5000/api/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: location || "Location not provided",
        }),
      });

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
        "SOS alert could not be saved. Please check the backend."
      );
    } finally {
      setSosSending(false);
    }
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: trimmedIncident,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Report could not be saved.");
        return;
      }

      setReports((previousReports) => [
        ...previousReports,
        trimmedIncident,
      ]);

      setIncident("");
      setMessage("Incident report saved successfully in MongoDB!");
    } catch {
      setMessage(
        "Could not connect to backend. Please check the server."
      );
    }
  }

  function updateContact(index, field, value) {
    setContacts((previousContacts) =>
      previousContacts.map((contact, i) =>
        i === index
          ? { ...contact, [field]: value }
          : contact
      )
    );
  }

  return (
    <div className="app">
      {page === "Login" && (
        <Login
          onLogin={() => setPage("Home")}
          onRegister={() => setPage("Register")}
          onAdminClick={() => setPage("AdminLogin")}
        />
      )}

      {page === "AdminLogin" && (
        <AdminLogin
          onAdminLogin={async (email, password) => {
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
              setMessage("");
              setPage("AdminDashboard");
            } catch (error) {
              setMessage("Could not connect to backend.");
            }
          }}
          onRegister={() => setPage("AdminRegister")}
          onBack={() => setPage("Login")}
        />
      )}

      {page === "Register" && (
        <Register
          onRegister={() => setPage("Login")}
          onLogin={() => setPage("Login")}
        />
      )}

      {page === "AdminRegister" && (
        <AdminRegister
          onBack={() => setPage("AdminLogin")}
        />
      )}

      {page === "AdminDashboard" && (
        <AdminDashboard
          onNavigate={setAdminPage}
          onLogout={() => {
            setAdminToken("");
            setAdminPage("Dashboard");
            setPage("Login");
          }}
        />
      )}

      {page !== "Login" &&
        page !== "Register" &&
        page !== "AdminLogin" &&
        page !== "AdminDashboard" && (
          <>
            <header>
              <h2>♥ WomenSafe</h2>

              <nav>
                {pages.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setPage(item);
                      setMessage("");
                    }}
                  >
                    {item}
                  </button>
                ))}
              </nav>

              <button
                type="button"
                className="logout-btn"
                onClick={() => {
                  setPage("Login");
                  setMessage("");
                }}
              >
                Logout
              </button>
            </header>

            <p className="message">Backend: {backendStatus}</p>

            {message && <p className="message">{message}</p>}

            <main>
              {page === "Home" && (
                <section className="hero">
                  <p>WOMEN'S SAFETY PLATFORM</p>
                  <h1>Your Safety, Our Priority.</h1>
                  <p>
                    Safety support for female university students.
                  </p>

                  <button
                    type="button"
                    onClick={() => setPage("Emergency SOS")}
                  >
                    Emergency Support
                  </button>
                </section>
              )}

              {page === "Emergency Numbers" && (
                <EmergencyNumbers />
              )}

              {page === "Emergency SOS" && (
                <section className="panel">
                  <h1>Emergency Support</h1>

                  <p>
                    In Bangladesh, call 999 if you need emergency
                    assistance.
                  </p>

                  <p>
                    <a href="tel:999">Call 999</a>
                  </p>

                  <button
                    type="button"
                    className="danger"
                    onClick={sendSOS}
                    disabled={sosSending}
                  >
                    {sosSending
                      ? "Sending SOS..."
                      : "SOS — Get Help"}
                  </button>

                  <h2>Location</h2>

                  <button type="button" onClick={getLocation}>
                    Get My Location
                  </button>

                  {location && <p>{location}</p>}

                  <p>
                    SOS alerts are saved in the application database.
                    This button does not automatically call or message
                    emergency services.
                  </p>
                </section>
              )}

              {page === "Contacts" && (
                <section className="panel">
                  <h1>Trusted Contacts</h1>

                  {contacts.map((contact, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        placeholder="Contact name"
                        value={contact.name}
                        onChange={(event) =>
                          updateContact(
                            index,
                            "name",
                            event.target.value
                          )
                        }
                      />

                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={contact.phone}
                        onChange={(event) =>
                          updateContact(
                            index,
                            "phone",
                            event.target.value
                          )
                        }
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setContacts((previousContacts) => [
                        ...previousContacts,
                        { name: "", phone: "" },
                      ])
                    }
                  >
                    Add Contact
                  </button>

                  <p>
                    Contacts are temporary and are not saved to a database.
                  </p>
                </section>
              )}

              {page === "Fake Call" && (
                <section className="panel">
                  <h1>Fake Call Simulation</h1>

                  {fakeCall && <h2>☎ Incoming Call — Demo</h2>}

                  <button
                    type="button"
                    onClick={() =>
                      setFakeCall((previous) => !previous)
                    }
                  >
                    {fakeCall
                      ? "End Demo Call"
                      : "Simulate Incoming Call"}
                  </button>
                </section>
              )}

              {page === "Safety Tips" && (
                <section className="panel">
                  <h1>Safety Tips</h1>

                  {tipsLoading ? (
                    <p>Loading safety tips...</p>
                  ) : tipsError ? (
                    <p>{tipsError}</p>
                  ) : tips.length === 0 ? (
                    <p>No safety tips available yet.</p>
                  ) : (
                    tips.map((tip, index) => (
                      <p key={tip._id}>
                        ✓ {tip.tip}
                      </p>
                    ))
                  )}
                </section>
              )}

              {page === "Report Incident" && (
                <section className="panel">
                  <h1>Incident Report</h1>

                  <form onSubmit={submitReport}>
                    <textarea
                      required
                      value={incident}
                      onChange={(event) =>
                        setIncident(event.target.value)
                      }
                      placeholder="Describe the incident"
                    />

                    <button type="submit">
                      Submit Incident Report
                    </button>
                  </form>

                  {reports.map((report, index) => (
                    <p key={index}>{report}</p>
                  ))}

                  <small>
                    Submitted reports are sent to the backend for
                    database storage.
                  </small>
                </section>
              )}

              {page === "Nearby Services" && (
                <section className="panel">
                  <h1>Nearby Services</h1>

                  <p>
                    <a
                      href="https://www.police.gov.bd/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Bangladesh Police website
                    </a>
                  </p>

                  <p>
                    <a
                      href="https://www.google.com/maps/search/hospitals+near+me/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Find nearby hospitals
                    </a>
                  </p>

                  <p>
                    <a
                      href="https://www.google.com/maps/search/police+stations+near+me/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Find nearby police stations
                    </a>
                  </p>
                </section>
              )}
            </main>

            <footer>
              Women Protection Application | Project 300
            </footer>
          </>
        )}
    </div>
  );
}

export default App;
