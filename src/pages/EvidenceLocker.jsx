
import { useState, useEffect } from "react";

function EvidenceLocker() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [evidenceList, setEvidenceList] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  const API = "http://localhost:5000";

  const loadEvidence = async () => {
    try {
      const response = await fetch(`${API}/api/evidence`);
      const data = await response.json();

      if (response.ok) {
        setEvidenceList(data);
      }
    } catch {
      setMessage("Could not load evidence");
    }
  };

  useEffect(() => {
    loadEvidence();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a photo or video");
      return;
    }

    const formData = new FormData();
    formData.append("evidence", file);
    formData.append("description", description);

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API}/api/evidence/upload`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("Evidence uploaded successfully!");
      setFile(null);
      setDescription("");
      e.target.reset();

      await loadEvidence();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (item) => {
    setEditingId(item._id);
    setEditDescription(item.description || "");
    setMessage("");
  };

  const saveDescription = async (id) => {
    try {
      const response = await fetch(`${API}/api/evidence/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          description: editDescription
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      setMessage("Description updated successfully!");
      setEditingId(null);
      await loadEvidence();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{
      maxWidth: "900px",
      margin: "30px auto",
      padding: "20px",
      color: "#35483A"
    }}>
      <h1>Evidence Locker</h1>
      <p>Store your important evidence in one place.</p>

      <form onSubmit={handleUpload} style={{
        background: "#DCE5D7",
        padding: "25px",
        borderRadius: "12px",
        marginBottom: "30px"
      }}>
        <h3>Upload New Evidence</h3>

        <label>Select Photo or Video</label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4"
          onChange={(e) => setFile(e.target.files[0])}
          required
          style={{ display: "block", margin: "15px 0" }}
        />

        <label>Evidence Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write what happened..."
          rows="4"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "8px",
            border: "1px solid #879B83",
            boxSizing: "border-box"
          }}
        />

        <button type="submit" disabled={loading} style={{
          marginTop: "15px",
          padding: "12px 25px",
          background: "#35483A",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          {loading ? "Uploading..." : "Upload Evidence"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <h2>My Evidence</h2>

      {evidenceList.length === 0 ? (
        <p>No evidence uploaded yet.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px"
        }}>
          {evidenceList.map((item) => (
            <div key={item._id} style={{
              border: "1px solid #879B83",
              borderRadius: "12px",
              padding: "15px",
              overflow: "hidden"
            }}>
              <h3>{item.fileName}</h3>

              {item.fileType.startsWith("image/") ? (
                <img
                  src={`${API}${item.filePath}`}
                  alt={item.fileName}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <video
                  src={`${API}${item.filePath}`}
                  controls
                  style={{ width: "100%" }}
                />
              )}

              {editingId === item._id ? (
                <>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows="4"
                    placeholder="Write evidence description..."
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "10px",
                      boxSizing: "border-box",
                      borderRadius: "8px"
                    }}
                  />

                  <button
                    onClick={() => saveDescription(item._id)}
                    style={{
                      marginTop: "10px",
                      padding: "9px 15px",
                      background: "#35483A",
                      color: "white",
                      border: "none",
                      borderRadius: "7px"
                    }}
                  >
                    Save Description
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      marginLeft: "8px",
                      padding: "9px 15px"
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>
                    {item.description || "No description added yet."}
                  </p>

                  <button
                    onClick={() => startEditing(item)}
                    style={{
                      padding: "9px 15px",
                      background: "#879B83",
                      color: "white",
                      border: "none",
                      borderRadius: "7px",
                      cursor: "pointer"
                    }}
                  >
                    Edit Description
                  </button>
                </>
              )}

              <p>
                <small>
                  Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                </small>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EvidenceLocker;
