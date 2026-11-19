
import { useEffect, useState } from "react";

function SafetyTips() {
  const [tips, setTips] = useState([]);
  const [newTip, setNewTip] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchTips() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/safety-tips"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load safety tips.");
      }

      setTips(data);
    } catch (error) {
      console.log("Fetch Safety Tips Error:", error);
      setMessage("Could not load safety tips.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTips();
  }, []);

  async function addTip(event) {
    event.preventDefault();

    if (!newTip.trim()) {
      setMessage("Please enter a safety tip.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/safety-tips",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tip: newTip.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add safety tip.");
      }

      setTips((previousTips) => [
        data.safetyTip,
        ...previousTips,
      ]);

      setNewTip("");
      setMessage("Safety tip added successfully!");
    } catch (error) {
      console.log("Add Safety Tip Error:", error);
      setMessage("Safety tip could not be added.");
    }
  }

  async function deleteTip(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this safety tip?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/safety-tips/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete safety tip.");
      }

      setTips((previousTips) =>
        previousTips.filter((tip) => tip._id !== id)
      );

      setMessage("Safety tip deleted successfully!");
    } catch (error) {
      console.log("Delete Safety Tip Error:", error);
      setMessage("Safety tip could not be deleted.");
    }
  }

  return (
    <section className="panel">
      <h2>Manage Safety Tips</h2>

      <h3>Total Safety Tips: {tips.length}</h3>

      <form onSubmit={addTip}>
        <textarea
          value={newTip}
          onChange={(event) => setNewTip(event.target.value)}
          placeholder="Write a new safety tip..."
          required
        />

        <button type="submit">
          Add Safety Tip
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      {loading ? (
        <p>Loading safety tips...</p>
      ) : tips.length === 0 ? (
        <p>No safety tips added yet.</p>
      ) : (
        tips.map((tip, index) => (
          <div
            key={tip._id}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginTop: "12px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>{index + 1}.</strong> {tip.tip}
            </p>

            <button
              type="button"
              className="danger"
              onClick={() => deleteTip(tip._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </section>
  );
}

export default SafetyTips;
