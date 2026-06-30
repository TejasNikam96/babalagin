import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authHeader, clearAuth } from "./adminAuth";

const CARDS = [
  { key: "drafts", label: "Draft Profiles", hint: "registrations_temp (incomplete sign-ups)", color: "#8B5E00", bg: "#fff7e0" },
  { key: "active", label: "Active Profiles", hint: "isActive = Y — click to view", color: "#1b7a3d", bg: "#e8f7ee", link: "/admin/profiles?isActive=Y" },
  { key: "inactive", label: "Inactive Profiles", hint: "isActive = N — click to view", color: "#9a1b1b", bg: "#fdeaea", link: "/admin/profiles?isActive=N" },
  { key: "successStories", label: "Success Stories", hint: "matched couples — click to view", color: "#7a1224", bg: "#fbe9ef", link: "/success-stories" },
  { key: "expiringThisMonth", label: "Expiring This Month", hint: "payment expiry in current month", color: "#b5790a", bg: "#fff3da" },
  { key: "totalRegistrations", label: "Total Registrations", hint: "all profiles — click to view", color: "#33415c", bg: "#eef1f7", link: "/admin/profiles" },
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: "#eee", borderRadius: 12, height: 96, backgroundImage: "linear-gradient(90deg,#eee 25%,#f5f5f5 37%,#eee 63%)", backgroundSize: "400% 100%", animation: "sksh 1.2s ease-in-out infinite" }} />
          ))}
          <style>{`@keyframes sksh{0%{background-position:100% 50%}100%{background-position:0 50%}}`}</style>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {CARDS.map((c) => (
            <div
              key={c.key}
              onClick={c.link ? () => navigate(c.link) : undefined}
              style={{ background: c.bg, border: "1px solid #00000010", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", cursor: c.link ? "pointer" : "default", transition: "transform .1s, box-shadow .1s" }}
              onMouseEnter={(e) => { if (c.link) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}
            >
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
