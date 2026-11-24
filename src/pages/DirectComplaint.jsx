
import { useState } from "react";

function DirectComplaint() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    authority: "",
    incidentLocation: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/complaints/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setMessage("Complaint submitted successfully! (Demo)");
      setFormData({
        name: "",
        phone: "",
        authority: "",
        incidentLocation: "",
        description: "",
      });
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Direct Complaint Submission</h2>

        <p style={styles.subtitle}>
          Submit your complaint through our demo platform.
        </p>

        <div style={styles.notice}>
          Demo project only. Complaints are saved in the project database.
          They are NOT sent to real police or government authorities.
        </div>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Phone Number</label>
          <input
            style={styles.input}
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Submit Complaint To</label>
          <select
            style={styles.input}
            name="authority"
            value={formData.authority}
            onChange={handleChange}
            required
          >
            <option value="">Select authority</option>
            <option value="Police Station">Police Station</option>
            <option value="Women and Children Support Authority">
              Women and Children Support Authority
            </option>
          </select>

          <label style={styles.label}>Incident Location</label>
          <input
            style={styles.input}
            type="text"
            name="incidentLocation"
            placeholder="Where did the incident happen?"
            value={formData.incidentLocation}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Complaint Details</label>
          <textarea
            style={styles.textarea}
            name="description"
            placeholder="Describe your complaint..."
            value={formData.description}
            onChange={handleChange}
            required
          />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>

        {message && (
          <p style={styles.message}>{message}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px 15px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    padding: "25px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.10)",
  },
  heading: {
    color: "#35483A",
    textAlign: "center",
    marginBottom: "8px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
  },
  notice: {
    background: "#fff3cd",
    color: "#856404",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "13px",
  },
  label: {
    display: "block",
    marginBottom: "7px",
    marginTop: "15px",
    fontWeight: "600",
    color: "#35483A",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "14px",
    resize: "vertical",
  },
  button: {
    width: "100%",
    padding: "13px",
    marginTop: "20px",
    background: "#35483A",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  message: {
    textAlign: "center",
    marginTop: "15px",
    color: "#35483A",
    fontWeight: "bold",
  },
};

export default DirectComplaint;
