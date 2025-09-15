import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Price from "./pages/Price";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Register from "./pages/Register";

import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./pages/PrivateRoute";

// ⚠️ Import thêm các component dashboard / profile
import ClientProfile from "./pages/client/ClientProfile";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ReceptionistDashboard from "./pages/dashboard/ReceptionistDashboard";
import StylistDashboard from "./pages/dashboard/StylistDashboard";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public pages trong MainLayout */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="price" element={<Price />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Auth pages (không dùng MainLayout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Register />} />

          {/* Client routes */}
          <Route
            path="/client/profile"
            element={
              <PrivateRoute role="client">
                <ClientProfile />
              </PrivateRoute>
            }
          />

          {/* Dashboard routes */}
          <Route
            path="/dashboard/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/receptionist"
            element={
              <PrivateRoute role="receptionist">
                <ReceptionistDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/stylist"
            element={
              <PrivateRoute role="stylist">
                <StylistDashboard />
              </PrivateRoute>
            }
          />

          {/* 404 page */}
          <Route
            path="*"
            element={<div className="container py-5">404 - Not found</div>}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;