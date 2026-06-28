import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutServer } from "./adminAuth";

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = () => {
    logoutServer();
    navigate("/admin/login");
  };

  const linkStyle = ({ isActive }) => ({
    padding: "8px 16px",
    borderRadius: 6,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
    color: isActive ? "#3a0613" : "#f1e9e7",
    background: isActive ? "#f0b429" : "transparent",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: "#3a0613" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontWeight: 800, color: "#f0b429", fontSize: 18, letterSpacing: "0.5px" }}>BABA LAGIN · Admin</span>
          <nav style={{ display: "flex", gap: 8 }}>
            <NavLink to="/admin/payments" style={linkStyle}>Payments Admin</NavLink>
            <NavLink to="/admin/profiles" style={linkStyle}>Profiles</NavLink>
            <NavLink to="/admin/contacts" style={linkStyle}>Contact Messages</NavLink>
          </nav>
        </div>
        <button
          onClick={logout}
          style={{ padding: "8px 16px", background: "transparent", color: "#fff", border: "1px solid #ffffff66", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
        >
          Logout
        </button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
