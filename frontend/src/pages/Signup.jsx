import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/auth.css";

const COUNTRIES = [
  { code: "VN", dial: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "US", dial: "+1", name: "United States", flag: "🇺🇸" },
  { code: "JP", dial: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "KR", dial: "+82", name: "Korea", flag: "🇰🇷" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    country: COUNTRIES[0], // default VN +84
  });
  const [showPass, setShowPass] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectCountry = (c) => {
    setForm({ ...form, country: c });
    setOpenCountry(false);
  };

  const validate = () => {
    const err = {};
    if (!form.firstName) err.firstName = "Please enter first name";
    if (!form.lastName) err.lastName = "Please enter last name";
    if (!form.phone) err.phone = "Please enter phone";
    else if (!/^\d{6,15}$/.test(form.phone.replace(/\D/g, "")))
      err.phone = "Invalid phone";
    if (!form.email) err.email = "Please enter email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Invalid email";
    if (!form.password) err.password = "Please enter password";
    else if (form.password.length < 6) err.password = "At least 6 characters";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: "Mật khẩu xác nhận không khớp" });
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          phone: `${form.country.dial}${form.phone}`,
          // Không cần gửi role, backend sẽ tự gán là 'client'
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng ký thành công!");
        navigate("/"); // Chuyển về trang Home
      } else {
        setErrors(data.errors || {});
        alert(data.message || "Đăng ký thất bại");
      }
    } catch (err) {
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="auth-card card p-4 p-md-5">
        <h2 className="mb-4">Create an account</h2>

        <form onSubmit={submit} noValidate>
          {/* First / Last name */}
          <div className="row g-3">
            <div className="col-md-6">
              <input
                name="firstName"
                className={`form-control ${
                  errors.firstName ? "is-invalid" : ""
                }`}
                placeholder="First name"
                value={form.firstName}
                onChange={change}
              />
              {errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </div>
            <div className="col-md-6">
              <input
                name="lastName"
                className={`form-control ${
                  errors.lastName ? "is-invalid" : ""
                }`}
                placeholder="Last name"
                value={form.lastName}
                onChange={change}
              />
              {errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>
          </div>

          {/* Phone with country */}
          <div className="mt-3 position-relative">
            <div className="input-group auth-phone">
              <input
                name="phone"
                type="tel"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Phone"
                value={form.phone}
                onChange={change}
                inputMode="numeric"
              />
            </div>

            {errors.phone && (
              <div className="invalid-feedback d-block">{errors.phone}</div>
            )}
          </div>

          {/* Email */}
          <div className="mt-3">
            <input
              name="email"
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Email"
              value={form.email}
              onChange={change}
              autoComplete="username"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* Password + eye */}
          <div className="mt-3 position-relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Password"
              value={form.password}
              onChange={change}
              autoComplete="new-password"
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
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mt-3 position-relative">
            <input
              type="password"
              name="password_confirmation"
              className={`form-control ${
                errors.password_confirmation ? "is-invalid" : ""
              }`}
              placeholder="Confirm Password"
              value={form.password_confirmation || ""}
              onChange={change}
            />
            {errors.password_confirmation && (
              <div className="invalid-feedback d-block">
                {errors.password_confirmation}
              </div>
            )}
          </div>

          <button
            className="btn btn-primary w-100 mt-4 py-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          
          </button>

          <div className="text-center mt-3">
            Already have an account? <Link to="/login">Log in</Link>
          </div>

          <p className="small text-muted mt-3 mb-0">
            By logging in or signing up, you give your{" "}
            <a href="#!">Consent to personal data processing</a> and confirm
            that you have read the <a href="#!">Online booking rules</a> and{" "}
            <a href="#!">Privacy policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
