
import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/users"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load users.");
        }

        setUsers(data);
      } catch (error) {
        setError("Could not load users.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <h2>Loading users...</h2>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="admin-content">
      <h2>Registered Users</h2>
      <p>Total Users: {users.length}</p>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p>No registered users found.</p>
      )}
    </div>
  );
}

export default Users;
