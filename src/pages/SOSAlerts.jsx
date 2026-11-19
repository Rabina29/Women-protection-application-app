
import { useEffect, useState } from "react";

function SOSAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/sos-alerts"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load SOS alerts."
          );
        }

        setAlerts(data);
      } catch (error) {
        console.log("SOS Alerts Error:", error);
        setError("Could not load SOS alerts. Please check the backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  if (loading) {
    return <h2>Loading SOS Alerts...</h2>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="panel">
      <h2>SOS Alerts</h2>

      <h3>Total SOS Alerts: {alerts.length}</h3>

      {alerts.length === 0 ? (
        <p>No SOS alerts received yet.</p>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert._id}
            className="report-card"
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "12px",
              borderRadius: "8px",
            }}
          >
            <h3>Emergency Alert</h3>

            <p>
              <strong>Location:</strong>{" "}
              {alert.location || "Location not provided"}
            </p>

            <p>
              <strong>Status:</strong> {alert.status}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(alert.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </section>
  );
}

export default SOSAlerts;
