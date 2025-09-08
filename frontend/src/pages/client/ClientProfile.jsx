import { useContext } from "react";
import { AuthContext } from "../../AuthContext";

export default function ClientProfile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="container py-5">
        <h2>You are not logged in</h2>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Welcome, {user.name} 🎉</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      {user.phone && (
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
      )}
      <p>
        <strong>Role:</strong> {user.role}
      </p>

      <button className="btn btn-danger mt-3" onClick={logout}>
        Logout
      </button>
    </div>
  );
}