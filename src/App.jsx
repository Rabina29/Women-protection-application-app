
import { useState, useEffect } from "react";
import "./App.css";
import EmergencyNumbers from "./components/EmergencyNumbers";

const tips = [
  "Plan your route before travelling.",
  "Keep your phone charged.",
  "Share your journey with a trusted person.",
  "Protect your personal information.",
];

function App() {
  const [page, setPage] = useState("Home");
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
      </header>

      <p className="message">Backend: {backendStatus}</p>

      {message && <p className="message">{message}</p>}

      <main>
        {page === "Home" && (
          <section className="hero">
            <p>WOMEN'S SAFETY PLATFORM</p>
            <h1>Your Safety, Our Priority.</h1>
            <p>Safety support for female university students.</p>

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
              In Bangladesh, call 999 if you need emergency assistance.
            </p>
            <p>
              <a href="tel:999">Call 999</a>
            </p>
            <p>The demo SOS button does not send an alert.</p>

            <button
              type="button"
              className="danger"
              onClick={() =>
                setMessage(
                  "Demo only: No call, SMS, or emergency alert was sent."
                )
              }
            >
              SOS — Get Help
            </button>

            <h2>Location</h2>
            <button type="button" onClick={getLocation}>
              Get My Location
            </button>

            {location && <p>{location}</p>}
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
                    updateContact(index, "name", event.target.value)
                  }
                />

                <input
                  type="tel"
                  placeholder="Phone number"
                  value={contact.phone}
                  onChange={(event) =>
                    updateContact(index, "phone", event.target.value)
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
              onClick={() => setFakeCall((previous) => !previous)}
            >
              {fakeCall ? "End Demo Call" : "Simulate Incoming Call"}
            </button>
          </section>
        )}

        {page === "Safety Tips" && (
          <section className="panel">
            <h1>Safety Tips</h1>

            {tips.map((tip, index) => (
              <p key={index}>✓ {tip}</p>
            ))}
          </section>
        )}

        {page === "Report Incident" && (
          <section className="panel">
            <h1>Incident Report</h1>

            <form onSubmit={submitReport}>
              <textarea
                required
                value={incident}
                onChange={(event) => setIncident(event.target.value)}
                placeholder="Describe the incident"
              />

              <button type="submit">Submit Incident Report</button>
            </form>

            {reports.map((report, index) => (
              <p key={index}>{report}</p>
            ))}

            <small>
              Submitted reports are sent to the backend for database storage.
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
    </div>
  );
}

export default App;
