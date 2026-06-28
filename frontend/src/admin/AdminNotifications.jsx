import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authHeader, clearAuth } from "./adminAuth";

const fmt = (dt) => (dt ? String(dt).replace("T", " ").slice(0, 19) : "");

// Default country code for 10-digit Indian numbers (wa.me needs full intl. digits).
const DEFAULT_CC = "91";

function waLink(mobile, message) {
  if (!mobile) return null;
  let digits = String(mobile).replace(/\D/g, "");
  if (digits.length === 10) digits = DEFAULT_CC + digits;       // add country code
  if (digits.length < 11) return null;                           // looks invalid
  const text = encodeURIComponent(`BABA LAGIN: ${message || ""}`);
  return `https://wa.me/${digits}?text=${text}`;
}

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = useCallback(() => { clearAuth(); navigate("/admin/login"); }, [navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/notifications", { headers: authHeader() });
      if (res.status === 401 || res.status === 403) { logout(); return; }
      if (!res.ok) { setError(`Failed to load (status ${res.status}).`); return; }
      setRows(await res.json());
    } catch (e) {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h1 style={{ margin: 0, color: "#3a0613", fontSize: 20 }}>Notifications</h1>
        <button style={refreshBtn} onClick={load}>Refresh</button>
      </div>
      <p style={{ fontSize: 12, color: "#777", marginTop: 4, marginBottom: 14 }}>
        Click <b>Send on WhatsApp</b> to open WhatsApp with the notification pre-filled for the recipient, then tap Send.
      </p>

      {error && <div style={{ background: "#fdecea", color: "#b71c1c", padding: "10px 14px", borderRadius: 6, marginBottom: 12 }}>{error}</div>}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>{rows.length} notification(s)</p>
          <div style={{ overflowX: "auto", background: "#fff", border: "1px solid #eee", borderRadius: 8 }}>
            <table style={{ borderCollapse: "collapse", fontSize: 13, width: "100%" }}>
              <thead>
                <tr>
                  {["Sr.No.", "Date", "Recipient", "Mobile", "Type", "Message", "Status", "WhatsApp"].map((h) => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((n, i) => {
                  const link = waLink(n.recipientMobile, n.message);
                  return (
                    <tr key={n.id} style={{ background: i % 2 ? "#fbfbfb" : "#fff" }}>
                      <td style={td}>{i + 1}</td>
                      <td style={td}>{fmt(n.createdDate)}</td>
                      <td style={td}>{n.recipientName}<br /><span style={{ color: "#999", fontSize: 11 }}>{n.registrationCode}</span></td>
                      <td style={td}>{n.recipientMobile || "—"}</td>
                      <td style={td}>{n.type}</td>
                      <td style={{ ...td, maxWidth: 320, whiteSpace: "pre-wrap" }}>{n.message}</td>
                      <td style={td}>{n.status || "—"}</td>
                      <td style={td}>
                        {link ? (
                          <a href={link} target="_blank" rel="noopener noreferrer" style={waBtn}>Send on WhatsApp</a>
                        ) : (
                          <span style={{ color: "#bbb", fontSize: 12 }}>No mobile</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr><td style={td} colSpan={8}>No notifications yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const refreshBtn = { padding: "8px 14px", background: "#f0b429", color: "#3a0613", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700 };
const th = { textAlign: "left", padding: "9px 12px", background: "#fbeec9", color: "#3a0613", borderBottom: "2px solid #f0e4c8" };
const td = { padding: "8px 12px", borderBottom: "1px solid #eee", verticalAlign: "top" };
const waBtn = { display: "inline-block", padding: "6px 12px", background: "#25D366", color: "#fff", borderRadius: 6, textDecoration: "none", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" };
