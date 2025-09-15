import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Khi app load lần đầu, nếu token + user tồn tại, redirect theo role
  useEffect(() => {
    if (user && token) {
      redirectByRole(user.role);
    }
  }, []);

  const redirectByRole = (role) => {
    switch (role) {
      case "client":
        navigate("/");
        break;
      case "admin":
        navigate("/dashboard/admin");
        break;
      case "receptionist":
        navigate("/dashboard/receptionist");
        break;
      case "stylist":
        navigate("/dashboard/stylist");
        break;
      default:
        navigate("/");
    }
  };

  const login = (data) => {
    console.log("Logged in user:", data.user); // ✅ debug role
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);

    redirectByRole(data.user.role);
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}