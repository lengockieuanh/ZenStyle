import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";

export default function AdminDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  
  const [users, setUsers] = useState([]);
  // const [loadingUsers, setLoadingUsers] = useState(false);
  // const [errorUsers, setErrorUsers] = useState(null);
  
  const [services, setServices] = useState([]);
  // const [loadingServices, setLoadingServices] = useState(false);
  // const [errorServices, setErrorServices] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    duration_minutes: "",
    price: "",
  });
  

  
  const [activeTab, setActiveTab] = useState(null);

  // Fetch Services API
  const fetchServices = async () => {
    // setErrorServices(null);
    // setLoadingServices(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/services", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(
          errBody.message || `Services fetch failed (${res.status})`
        );
      }

      const data = await res.json();
      // try some common shapes
      const list = data.data || data.services || data || [];
      setServices(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([]);
      // setErrorServices(err.message);
    // } finally {
    //   setLoadingServices(false);
    }
  };

  // Fetch Users API (admin-only)
  const fetchUsers = async () => {
    // setErrorUsers(null);
    // setLoadingUsers(true);
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
        throw new Error(
          "Forbidden. Your account doesn't have permission to view users."
        );
      }
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(
          errBody.message || `Users fetch failed (${res.status})`
        );
      }

      const data = await res.json();
      // expect array
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      // setErrorUsers(err.message);
    // } finally {
    //   setLoadingUsers(false);
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
            <h2>Users Management</h2>
            {/* Form thêm/sửa user */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const url = editing
                  ? `http://127.0.0.1:8000/api/users/${form.id}`
                  : "http://127.0.0.1:8000/api/users";
                const method = editing ? "PUT" : "POST";

                const res = await fetch(url, {
                  method,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  },
                  body: JSON.stringify(form),
                });

                if (res.ok) {
                  await fetchUsers();
                  setForm({
                    id: null,
                    name: "",
                    email: "",
                    role: "",
                  });
                  setEditing(false);
                } else {
                  alert("Error saving user");
                }
              }}
              className="mb-3"
            >
              <input
                type="text"
                placeholder="Username"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-control mb-2"
                required
              />
              <input
                type="text"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-control mb-2"
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="form-control mb-2"
                required
              />
              
              <button type="submit" className="btn btn-success">
                {editing ? "Update User" : "Add User"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      id: null,
                      name: "",
                      email: "",
                      role: "",
                    });
                    setEditing(false);
                  }}
                  className="btn btn-secondary ms-2"
                >
                  Cancel
                </button>
              )}
            </form>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No users found.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        {u.created_at
                          ? new Date(u.created_at).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        {u.updated_at
                          ? new Date(u.updated_at).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => {
                            setForm(u);
                            setEditing(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={async () => {
                            if (window.confirm("Delete this user?")) {
                              const res = await fetch(
                                `http://127.0.0.1:8000/api/users/${u.id}`,
                                {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    Accept: "application/json",
                                  },
                                }
                              );
                              if (res.ok) {
                                await fetchUsers();
                              } else {
                                alert("Error deleting user");
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        );

      case "services":
        return (
          <>
            <h2>Services</h2>

            {/* Form thêm/sửa service */}
            <form onSubmit={async (e) => {
                e.preventDefault();
                const url = editing? `http://127.0.0.1:8000/api/services/${form.id}`: "http://127.0.0.1:8000/api/services";
                const method = editing ? "PUT" : "POST";

                const res = await fetch(url, 
                {
                  method,
                  headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "application/json",
                  }, body: JSON.stringify(form),
                });

                if (res.ok) {
                  await fetchServices();
                  setForm({
                    id: null,
                    name: "",
                    duration_minutes: "",
                    price: "",
                  });
                  setEditing(false);
                } else {
                  alert("Error saving service");
                }
              }}
              className="mb-3"
            >
              <input
                type="text"
                placeholder="Service name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-control mb-2"
                required
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={form.duration_minutes}
                onChange={(e) =>
                  setForm({ ...form, duration_minutes: e.target.value })
                }
                className="form-control mb-2"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="form-control mb-2"
                required
              />
              <input
                type="text"
                placeholder="Stylist"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="form-control mb-2"
                required
              />
              <button type="submit" className="btn btn-success">
                {editing ? "Update Service" : "Add Service"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      id: null,
                      name: "",
                      duration_minutes: "",
                      price: "",
                      role: "",
                    });
                    setEditing(false);
                  }}
                  className="btn btn-secondary ms-2"
                >
                  Cancel
                </button>
              )}
            </form>

            {/* Danh sách service */}

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Stylist</th>
                  <th>Datetime</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.duration_minutes} mins</td>
                    <td>{s.price} VND</td>
                    <td>{s.role}</td>
                    <td>{new Date(s.appointment_time).toLocaleString()}</td>
                    <td>{s.room}</td>
                    <td>{s.status}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setForm(s);
                          setEditing(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={async () => {
                          if (window.confirm("Delete this service?")) {
                            const res = await fetch(
                              `http://127.0.0.1:8000/api/services/${s.id}`,
                              {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  Accept: "application/json",
                                },
                              }
                            );
                            if (res.ok) {
                              await fetchServices();
                            } else {
                              alert("Error deleting service");
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        );
      case "products":
        return <h2>Products management (demo)</h2>;  

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
    { id: "products", label: "Products" },
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
            <h4>Dashboard</h4>
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
            <div>
              <button className="btn btn-danger" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

          {/* Nội dung chính */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
