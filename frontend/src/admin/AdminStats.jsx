import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authHeader, clearAuth } from "./adminAuth";

const CARDS = [
  { key: "drafts", label: "Draft Profiles", hint: "registrations_temp (incomplete sign-ups)", color: "#8B5E00", bg: "#fff7e0" },
  { key: "active", label: "Active Profiles", hint: "isActive = Y", color: "#1b7a3d", bg: "#e8f7ee" },
  { key: "inactive", label: "Inactive Profiles", hint: "isActive = N", color: "#9a1b1b", bg: "#fdeaea" },
  { key: "successStories", label: "Success Stories", hint: "matched couples", color: "#7a1224", bg: "#fbe9ef" },
  { key: "totalRegistrations", label: "Total Registrations", hint: "all profiles", color: "#33415c", bg: "#eef1f7" },
];

export default function AdminStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = useCallback(() => { clearAuth(); navigate("/admin/login"); }, [navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/dashboard", { headers: authHeader() });
      if (res.status === 401 || res.status === 403) { logout(); return; }
      if (!res.ok) { setError(`Failed to load (status ${res.status}).`); return; }
      setStats(await res.json());
    } catch (e) {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ margin: 0, color: "#3a0613", fontSize: 20 }}>Dashboard</h1>
        <button style={refreshBtn} onClick={load}>Refresh</button>
      </div>

      {error && <div style={{ background: "#fdecea", color: "#b71c1c", padding: "10px 14px", borderRadius: 6, marginBottom: 12 }}>{error}</div>}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {CARDS.map((c) => (
            <div key={c.key} style={{ background: c.bg, border: "1px solid #00000010", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 13, color: "#555", fontWeight: 600 }}>{c.label}</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: c.color, lineHeight: 1.1, marginTop: 6 }}>
                {stats && stats[c.key] != null ? stats[c.key] : 0}
              </div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{c.hint}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const refreshBtn = { padding: "8px 14px", background: "#f0b429", color: "#3a0613", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700 };
