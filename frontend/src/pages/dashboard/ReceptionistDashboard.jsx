

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";

export default function ReceptionistDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorServices, setErrorServices] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  // Fetch Services API
  const fetchServices = async () => {
    setErrorServices(null);
    setLoadingServices(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/services", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Services fetch failed (${res.status})`);
      }

      const data = await res.json();
      // try some common shapes
      const list = data.data || data.services || data || [];
      setServices(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([]);
      setErrorServices(err.message);
    } finally {
      setLoadingServices(false);
    }
  };

  // Fetch Users API (admin-only)
  const fetchUsers = async () => {
    setErrorUsers(null);
    setLoadingUsers(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // handle 401/403 explicitly
      if (res.status === 401) {
        throw new Error("Unauthenticated. Please login again.");
      }
      if (res.status === 403) {
        throw new Error("Forbidden. Your account doesn't have permission to view users.");
      }
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Users fetch failed (${res.status})`);
      }

      const data = await res.json();
      // expect array
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      setErrorUsers(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (token && activeTab === "services") {
      fetchServices();
    }
    if (token && activeTab === "users") {
      fetchUsers();
    }
  }, [token, activeTab]);

  if (!user) {
    return (
      <div className="container py-5">
        <h2>You are not logged in</h2>
      </div>
    );
  }

  // Render content theo tab
  const renderContent = () => {
    if (!activeTab) return <h2>Please select a menu item</h2>;

    switch (activeTab) {
      case "users":
        return (
          <>
            <h2>Users</h2>

            {loadingUsers ? (
              <p>Loading users...</p>
            ) : errorUsers ? (
              <div className="alert alert-warning">{errorUsers}</div>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.created_at ? new Date(u.created_at).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        );

      case "services":
        return (
          <>
            <h2>Services</h2>
            {loadingServices ? (
              <p>Loading services...</p>
            ) : errorServices ? (
              <div className="alert alert-warning">{errorServices}</div>
            ) : services.length === 0 ? (
              <p>No services found.</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Duration (minutes)</th>
                    <th>Price (VND)</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.name}</td>
                      <td>{s.duration_minutes}</td>
                      <td>{typeof s.price === "number" ? s.price.toLocaleString() : s.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        );

      case "orders":
        return <h2>Order management (demo)</h2>;

      case "reports":
        return <h2>Reports & Analytics (demo)</h2>;

      default:
        return <h2>Not implemented yet</h2>;
    }
  };

  const menuItems = [
    { id: "users", label: "Users" },
    { id: "services", label: "Services" },
    { id: "orders", label: "Orders" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav
          className="col-12 col-md-2 d-md-block bg-dark text-white vh-100 position-fixed"
          style={{ left: 0, top: 0 }}
        >
          <div className="p-3">
            <h4>Admin Dashboard</h4>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn w-100 text-start mb-2 ${
                  activeTab === item.id ? "btn-secondary" : "btn-outline-light"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main
          className="col-12 col-md-10 offset-md-2 p-4"
          style={{ overflowY: "auto", height: "100vh" }}
        >
          {/* Góc phải trên */}
          <div className="d-flex justify-content-end mb-3">
            <span className="me-2">
              Welcome <strong>{user.name}</strong> ({user.role})
            </span>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>

          {/* Nội dung chính */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
