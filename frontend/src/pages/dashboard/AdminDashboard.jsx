import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";

export default function AdminDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/services", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        console.log("Services API response:", data); // debug

        // Nếu backend trả về object chứa mảng
        // ví dụ: { data: [...] } hoặc { services: [...] }
        const list = data.data || data.services || [];
        setServices(list);
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchServices();
  }, [token]);

  if (!user) {
    return (
      <div className="container py-5">
        <h2>You are not logged in</h2>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Admin Dashboard</h2>
      <p>
        Welcome <strong>{user.name}</strong> ({user.role})
      </p>

      <button className="btn btn-danger mb-3" onClick={logout}>
        Logout
      </button>

      <h3>Services</h3>
      {loading ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Duration (minutes)</th>
              <th>Price (VND)</th>
            </tr>
          </thead>
          <tbody>
            {(services || []).map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.duration_minutes}</td>
                <td>{s.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}