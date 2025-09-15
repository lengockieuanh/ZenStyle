import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./css/auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [tab, setTab] = useState("email"); // 'email' | 'phone'
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (tab === "email") {
      if (!form.email) err.email = "Please enter email";
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Invalid email";
    } else {
      if (!form.phone) err.phone = "Please enter phone";
      else if (!/^\+?\d{8,15}$/.test(form.phone)) err.phone = "Invalid phone";
    }
    if (!form.password) err.password = "Please enter password";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          identifier: tab === "email" ? form.email : form.phone, // ✅ đổi thành identifier
          password: form.password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setErrors({ api: data.message || "Login failed" });
      } else {
        login(data); // ✅ gọi hàm login trong AuthContext
      }
    } catch (err) {
      setLoading(false);
      setErrors({ api: "Network error: " + err.message });
    }
  };

  return (
    <div className="container py-5">
      <div className="auth-card card p-4 p-md-5">
        <h2 className="mb-4">Log in to your account</h2>

        {/* Tabs Email / Phone */}
        <div className="auth-tabs mb-3">
          <button
            type="button"
            className={tab === "email" ? "active" : ""}
            onClick={() => setTab("email")}
          >
            Email
          </button>
          <button
            type="button"
            className={tab === "phone" ? "active" : ""}
            onClick={() => setTab("phone")}
          >
            Phone
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          {errors.api && <div className="alert alert-danger">{errors.api}</div>}

          {tab === "email" ? (
            <div className="mb-3">
              <input
                name="email"
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                autoComplete="username"
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
          ) : (
            <div className="mb-3">
              <input
                name="phone"
                type="tel"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Phone"
                value={form.phone}
                onChange={onChange}
                autoComplete="tel"
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>
          )}

          {/* Password + toggle eye */}
          <div className="mb-3 position-relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              className={`form-control ${
                errors.password ? "is-invalid" : ""
              }`}
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="btn btn-link auth-eye"
              onClick={() => setShowPass((s) => !s)}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`} />
            </button>
            {errors.password && (
              <div className="invalid-feedback d-block">
                {errors.password}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="d-flex justify-content-between mb-3">
            <Link to="/signup" className="text-decoration-none">
              Sign up
            </Link>
            <Link to="/forgot-password" className="text-decoration-none">
              Forgot password?
            </Link>
          </div>

          <button
            className="btn btn-primary w-100 py-2"
            disabled={loading}
            type="submit"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {/* <div className="text-center my-3">Log in with the booking number</div> */}

          {/* <p className="small text-muted mb-0">
            By logging in or signing up, you give your{" "}
            <a href="#!">Consent to personal data processing</a> and confirm
            that you have read the{" "}
            <a href="#!">Online booking rules</a> and{" "}
            <a href="#!">Privacy policy</a>.
          </p> */}
        </form>
      </div>
    </div>
  );
}