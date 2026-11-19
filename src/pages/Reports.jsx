
import { useEffect, useState } from "react";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      {reports.length === 0 ? (
        <p>No incident reports found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Report Description</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.description}</td>
                <td>
                  {new Date(report.createdAt).toLocaleString()}
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
