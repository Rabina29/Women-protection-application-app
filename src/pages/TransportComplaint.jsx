import { useState } from "react";

function TransportComplaint() {
  const [form, setForm] = useState({
    busNumber: "",
    busRoute: "",
    incidentType: "",
    incidentDate: "",
    incidentLocation: "",
    description: "",
    isAnonymous: false,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/transport-complaints",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setForm({
          busNumber: "",
          busRoute: "",
          incidentType: "",
          incidentDate: "",
          incidentLocation: "",
          description: "",
          isAnonymous: false,
        });
      }
    } catch {
      setMessage("Server connection failed!");
    }
  };

  return (
    <div className="complaint-container">
      <h2>Public Transport Complaint</h2>
      <p>Report harassment or unsafe incidents during bus journeys.</p>

      <form onSubmit={handleSubmit}>
        <input name="busNumber" placeholder="Bus Number" value={form.busNumber} onChange={handleChange} required />

        <input name="busRoute" placeholder="Bus Route" value={form.busRoute} onChange={handleChange} required />

        <select name="incidentType" value={form.incidentType} onChange={handleChange} required>
          <option value="">Select Incident Type</option>
          <option value="Harassment">Harassment</option>
          <option value="Unsafe Driving">Unsafe Driving</option>
          <option value="Overcrowding">Overcrowding</option>
          <option value="Other">Other</option>
        </select>

        <label>Incident Date</label>
        <input type="date" name="incidentDate" value={form.incidentDate} onChange={handleChange} required />

        <input name="incidentLocation" placeholder="Incident Location" value={form.incidentLocation} onChange={handleChange} required />

        <textarea name="description" placeholder="Describe what happened..." value={form.description} onChange={handleChange} required />

        <label>
          <input type="checkbox" name="isAnonymous" checked={form.isAnonymous} onChange={handleChange} />
          Submit anonymously
        </label>

        <button type="submit">Submit Complaint</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default TransportComplaint;