import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authHeader, clearAuth } from "./adminAuth";

const fmt = (dt) => (dt ? String(dt).replace("T", " ").slice(0, 19) : "");
const escH = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

export default function AdminContacts() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = useCallback(() => { clearAuth(); navigate("/admin/login"); }, [navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/contacts", { headers: authHeader() });
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

  // Export contact messages to a PDF (browser print -> Save as PDF).
  const downloadPdf = () => {
    if (!rows.length) return;
    const cols = ["Name", "Phone", "Email", "Subject", "Message", "Received"];
    const head = "<th>Sr.No.</th>" + cols.map((c) => `<th>${escH(c)}</th>`).join("");
    const body = rows.map((m, i) =>
      `<tr><td>${i + 1}</td><td>${escH(m.fullName)}</td><td>${escH(m.phone)}</td>` +
      `<td>${escH(m.email)}</td><td>${escH(m.subject)}</td><td>${escH(m.message)}</td>` +
      `<td>${escH(fmt(m.createdDate))}</td></tr>`).join("");
    const when = new Date().toLocaleString();
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>BABA LAGIN - Contact Messages</title>
      <style>
        @page { size: A4 landscape; margin: 8mm; }
        *{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;color:#222;margin:0}
        .head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #6B0F2B;padding-bottom:6px;margin-bottom:8px}
        .brand{font-size:18px;font-weight:bold;color:#6B0F2B} .brand span{color:#B8860B}
        .sub{font-size:10px;color:#666}
        table{border-collapse:collapse;width:100%;font-size:9px;table-layout:fixed}
        th,td{border:1px solid #ddd;padding:4px 5px;text-align:left;vertical-align:top;word-break:break-word}
        th{background:#fbeec9;color:#3a0613}
        tr:nth-child(even) td{background:#fbfbfb}
      </style></head>
      <body>
        <div class="head">
          <div class="brand">BABA <span>LAGIN</span> — Contact Messages</div>
          <div class="sub">${rows.length} message(s) &middot; Generated: ${escH(when)}</div>
        </div>
        <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
        <script>window.onload=function(){window.focus();window.print();};window.onafterprint=function(){window.close();};</script>
      </body></html>`;
    const w = window.open("", "_blank");
    if (!w) { setError("Please allow pop-ups to download the PDF."); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h1 style={{ margin: 0, color: "#3a0613", fontSize: 20 }}>Contact Messages</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={downloadBtn} onClick={downloadPdf} disabled={rows.length === 0}>⬇ Download PDF</button>
          <button style={refreshBtn} onClick={load}>Refresh</button>
        </div>
      </div>

      {error && <div style={{ background: "#fdecea", color: "#b71c1c", padding: "10px 14px", borderRadius: 6, marginBottom: 12 }}>{error}</div>}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>{rows.length} message(s)</p>
          <div style={{ overflowX: "auto", background: "#fff", border: "1px solid #eee", borderRadius: 8 }}>
            <table style={{ borderCollapse: "collapse", fontSize: 13, width: "100%" }}>
              <thead>
                <tr>
                  {["Sr.No.", "ID", "Name", "Phone", "Email", "Subject", "Message", "Received"].map((h) => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((m, i) => (
                  <tr key={m.id} style={{ background: i % 2 ? "#fbfbfb" : "#fff" }}>
                    <td style={td}>{i + 1}</td>
                    <td style={td}>{m.id}</td>
                    <td style={td}>{m.fullName}</td>
                    <td style={td}>{m.phone}</td>
                    <td style={td}>{m.email}</td>
                    <td style={td}>{m.subject}</td>
                    <td style={{ ...td, maxWidth: 360, whiteSpace: "pre-wrap" }}>{m.message}</td>
                    <td style={td}>{fmt(m.createdDate)}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td style={td} colSpan={8}>No contact messages yet.</td></tr>
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
const downloadBtn = { padding: "8px 14px", background: "#3a0613", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700 };
const th = { textAlign: "left", padding: "9px 12px", background: "#fbeec9", color: "#3a0613", borderBottom: "2px solid #f0e4c8" };
const td = { padding: "8px 12px", borderBottom: "1px solid #eee", verticalAlign: "top" };
