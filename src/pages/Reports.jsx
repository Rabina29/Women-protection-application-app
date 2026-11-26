
import { useEffect, useState } from "react";

function Reports({ token }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/reports"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load reports");
        }

        setReports(data);
      } catch (error) {
        console.log("Reports Error:", error);
        setError("Could not load reports.");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  async function updateReportStatus(reportId, newStatus) {
    setUpdatingId(reportId);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/reports/${reportId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update report status.");
      }

      setReports((previous) =>
        previous.map((report) =>
          report._id === reportId
            ? { ...report, status: newStatus }
            : report
        )
      );

      setMessage("Report status updated successfully.");
    } catch (error) {
      console.log("Update Status Error:", error);
      setMessage(error.message || "Could not update report status.");
    } finally {
      setUpdatingId("");
    }
  }

  if (loading) {
    return <p>Loading reports...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="admin-content">
      <h2>Incident Reports</h2>

      <p>Total Reports: {reports.length}</p>

      {message && <p>{message}</p>}

      {reports.length === 0 ? (
        <p>No incident reports found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Report Description</th>
              <th>Date</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.description}</td>

                <td>
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleString()
                    : "Date not available"}
                </td>

                <td>{report.status || "Pending"}</td>

                <td>
                  <select
                    value={report.status || "Pending"}
                    disabled={updatingId === report._id}
                    onChange={(event) =>
                      updateReportStatus(
                        report._id,
                        event.target.value
                      )
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  {updatingId === report._id && (
                    <small> Updating...</small>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Reports;
