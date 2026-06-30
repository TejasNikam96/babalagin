import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authHeader, clearAuth } from "./adminAuth";

const fmt = (dt) => (dt ? String(dt).replace("T", " ").slice(0, 19) : "");
const reg = (row) => row.registration || {};
const ht = (t) => (t != null ? `${Math.floor(t / 12)}'${t % 12}"` : "");

// All columns of the registrations table (+ payment status).
const COLS = [
  { h: "Reg Code", g: (x) => reg(x).registrationCode },
  { h: "First Name", g: (x) => reg(x).personal?.firstName },
  { h: "Middle", g: (x) => reg(x).personal?.middleName },
  { h: "Last Name", g: (x) => reg(x).personal?.lastName },
  { h: "Email", g: (x) => reg(x).personal?.email },
  { h: "Mobile", g: (x) => reg(x).personal?.mobile },
  { h: "Gender", g: (x) => reg(x).personal?.gender },
  { h: "DOB", g: (x) => [reg(x).personal?.dobDay, reg(x).personal?.dobMonth, reg(x).personal?.dobYear].filter(Boolean).join("/") },
  { h: "Sub Caste", g: (x) => reg(x).personal?.subCaste },
  { h: "Marital", g: (x) => reg(x).personal?.maritalStatus },
  { h: "Height", g: (x) => ht(reg(x).personal?.heightTotalInches) },
  { h: "Weight", g: (x) => reg(x).personal?.weight },
  { h: "Blood Grp", g: (x) => reg(x).personal?.bloodGroup },
  { h: "Complexion", g: (x) => reg(x).personal?.complexion },
  { h: "Disability", g: (x) => reg(x).personal?.physicalDisability },
  { h: "Diet", g: (x) => reg(x).personal?.diet },
  { h: "Spectacles", g: (x) => reg(x).personal?.spectacles },
  { h: "Community", g: (x) => reg(x).personal?.community },
  { h: "Rashi", g: (x) => reg(x).horoscope?.rashi },
  { h: "Nakshatra", g: (x) => reg(x).horoscope?.nakshatra },
  { h: "Charan", g: (x) => reg(x).horoscope?.charan },
  { h: "Gan", g: (x) => reg(x).horoscope?.gan },
  { h: "Gotra", g: (x) => reg(x).horoscope?.gotra },
  { h: "Manglik", g: (x) => reg(x).horoscope?.manglik },
  { h: "Birth Time", g: (x) => reg(x).horoscope?.birthTime },
  { h: "Birth Place", g: (x) => reg(x).horoscope?.birthPlace },
  { h: "Education", g: (x) => reg(x).education?.highestEducation },
  { h: "Field", g: (x) => reg(x).education?.fieldOfStudy },
  { h: "Institution", g: (x) => reg(x).education?.institution },
  { h: "Occupation", g: (x) => reg(x).education?.occupation },
  { h: "Occ Type", g: (x) => reg(x).education?.occupationType },
  { h: "Employer", g: (x) => reg(x).education?.employer },
  { h: "Income", g: (x) => reg(x).education?.annualIncome },
  { h: "Country", g: (x) => reg(x).address?.country },
  { h: "State", g: (x) => reg(x).address?.state },
  { h: "City", g: (x) => reg(x).address?.city },
  { h: "Native", g: (x) => reg(x).address?.nativePlace },
  { h: "Pincode", g: (x) => reg(x).address?.pincode },
  { h: "Permanent Addr", g: (x) => reg(x).address?.permanentAddress },
  { h: "Current Addr", g: (x) => reg(x).address?.currentAddress },
  { h: "Father", g: (x) => reg(x).family?.fatherName },
  { h: "Father Occ", g: (x) => reg(x).family?.fatherOccupation },
  { h: "Mother", g: (x) => reg(x).family?.motherName },
  { h: "Mother Occ", g: (x) => reg(x).family?.motherOccupation },
  { h: "Siblings", g: (x) => reg(x).family?.siblings },
  { h: "Family Type", g: (x) => reg(x).family?.familyType },
  { h: "Family Status", g: (x) => reg(x).family?.familyStatus },
  { h: "Exp Age", g: (x) => [reg(x).expectation?.ageFrom, reg(x).expectation?.ageTo].filter(Boolean).join("-") },
  { h: "Exp Height", g: (x) => [reg(x).expectation?.heightFrom, reg(x).expectation?.heightTo].filter(Boolean).join("-") },
  { h: "Exp Education", g: (x) => reg(x).expectation?.education },
  { h: "Exp Occupation", g: (x) => reg(x).expectation?.occupation },
  { h: "Exp Location", g: (x) => reg(x).expectation?.location },
  { h: "Exp Other", g: (x) => reg(x).expectation?.otherPreferences },
  { h: "Active", g: (x) => reg(x).isActive },
  { h: "Success Story", g: (x) => reg(x).successStory },
  { h: "Partner ID", g: (x) => reg(x).partnerId },
  { h: "Created", g: (x) => fmt(reg(x).createdDate) },
  { h: "Updated", g: (x) => fmt(reg(x).updatedDate) },
  { h: "Renewal Date", g: (x) => fmt(reg(x).renewedUntil) },
  { h: "Payment", g: (x) => x.paymentStatus },
];

// Key columns included in the PDF export (the full 60-column table is too wide
// for a printable page, so the export uses the most useful subset).
const PDF_HEADERS = ["Reg Code", "First Name", "Last Name", "Email", "Mobile", "Gender", "DOB",
  "Marital", "Height", "Community", "Education", "Occupation", "Income", "City", "Native",
  "Payment", "Active", "Created"];
const PDF_COLS = PDF_HEADERS.map((h) => COLS.find((c) => c.h === h)).filter(Boolean);

const escH = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// Editable fields grouped by section (id is shown read-only; not here).
const EDIT_SECTIONS = [
  ["personal", ["firstName", "middleName", "lastName", "email", "mobile", "gender", "dobDay", "dobMonth", "dobYear", "subCaste", "maritalStatus", "heightFeet", "heightInches", "weight", "bloodGroup", "complexion", "physicalDisability", "disabilityDetails", "diet", "spectacles", "community"]],
  ["horoscope", ["rashi", "nakshatra", "charan", "gan", "gotra", "manglik", "birthTime", "birthPlace"]],
  ["education", ["highestEducation", "fieldOfStudy", "institution", "occupation", "occupationType", "employer", "annualIncome"]],
  ["address", ["country", "state", "city", "nativePlace", "pincode", "permanentAddress", "currentAddress"]],
  ["family", ["fatherName", "fatherOccupation", "motherName", "motherOccupation", "siblings", "familyType", "familyStatus"]],
  ["expectation", ["ageFrom", "ageTo", "heightFrom", "heightTo", "education", "occupation", "location", "otherPreferences"]],
];

export default function AdminProfiles() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [params] = useSearchParams();
  const [f, setF] = useState(() => ({
    gender: params.get("gender") || "",
    isActive: params.get("isActive") || "",
    createdFrom: params.get("createdFrom") || "",
    createdTo: params.get("createdTo") || "",
    paymentStatus: params.get("paymentStatus") || "",
  }));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editing, setEditing] = useState(null); // registration object being edited
  const [editPayment, setEditPayment] = useState("");      // chosen payment status
  const [editPaymentOrig, setEditPaymentOrig] = useState(""); // original, to detect change
  const [saving, setSaving] = useState(false);
  const [editErr, setEditErr] = useState("");

  const logout = useCallback(() => { clearAuth(); navigate("/admin/login"); }, [navigate]);

  const load = useCallback(async (filters) => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (filters.gender) p.set("gender", filters.gender);
    if (filters.isActive) p.set("isActive", filters.isActive);
    if (filters.createdFrom) p.set("createdFrom", filters.createdFrom);
    if (filters.createdTo) p.set("createdTo", filters.createdTo);
    if (filters.paymentStatus) p.set("paymentStatus", filters.paymentStatus);
    try {
      const res = await fetch(`/api/admin/profiles?${p.toString()}`, { headers: authHeader() });
      if (res.status === 401 || res.status === 403) { logout(); return; }
      if (!res.ok) { setError(`Failed to load (status ${res.status}).`); return; }
      setRows(await res.json());
      setPage(1); // reset to first page on every (re)load
    } catch (e) {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => { load(f); /* initial load */ /* eslint-disable-next-line */ }, []);

  const onChange = (e) => setF((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const apply = (e) => { e.preventDefault(); load(f); };
  const reset = () => { const cleared = { gender: "", isActive: "", createdFrom: "", createdTo: "", paymentStatus: "" }; setF(cleared); load(cleared); };

  const openEdit = (x) => {
    setEditErr("");
    setEditing(JSON.parse(JSON.stringify(x.registration || {})));
    const ps = x.paymentStatus || "NONE";
    setEditPayment(ps);
    setEditPaymentOrig(ps);
  };
  const closeEdit = () => setEditing(null);
  const setSec = (section, field, value) =>
    setEditing((prev) => ({ ...prev, [section]: { ...(prev[section] || {}), [field]: value } }));
  const setTop = (field, value) => setEditing((prev) => ({ ...prev, [field]: value }));

  const saveEdit = async () => {
    setSaving(true);
    setEditErr("");
    try {
      const res = await fetch(`/api/admin/profiles/${editing.id}`, {
        method: "PUT",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (res.status === 401 || res.status === 403) { logout(); return; }
      if (!res.ok) {
        let msg = `Update failed (status ${res.status}).`;
        try { const b = await res.json(); if (b && b.message) msg = b.message; } catch (_) {}
        setEditErr(msg);
        return;
      }

      // If the payment status was changed to a real status, apply it too.
      if (editPayment && editPayment !== "NONE" && editPayment !== editPaymentOrig) {
        const pr = await fetch(`/api/admin/profiles/${editing.id}/payment-status?status=${encodeURIComponent(editPayment)}`, {
          method: "PUT",
          headers: authHeader(),
        });
        if (pr.status === 401 || pr.status === 403) { logout(); return; }
        if (!pr.ok) { setEditErr(`Saved profile, but payment status update failed (status ${pr.status}).`); return; }
      }

      setEditing(null);
      load(f);
    } catch (e) {
      setEditErr("Could not reach the server.");
    } finally {
      setSaving(false);
    }
  };

  // Export the currently-filtered rows to a PDF (browser print -> Save as PDF).
  const downloadPdf = () => {
    if (!rows.length) return;
    const head = `<th>Sr.No.</th>` + PDF_COLS.map((c) => `<th>${escH(c.h)}</th>`).join("");
    const body = rows
      .map((x, i) => `<tr><td>${i + 1}</td>${PDF_COLS.map((c) => `<td>${escH(c.g(x))}</td>`).join("")}</tr>`)
      .join("");
    const activeFilters = Object.entries(f)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`).join(", ") || "none";
    const when = new Date().toLocaleString();
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>BABA LAGIN - Profiles</title>
      <style>
        @page { size: A4 landscape; margin: 8mm; }
        *{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;color:#222;margin:0}
        .head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #6B0F2B;padding-bottom:6px;margin-bottom:8px}
        .brand{font-size:18px;font-weight:bold;color:#6B0F2B} .brand span{color:#B8860B}
        .sub{font-size:10px;color:#666}
        table{border-collapse:collapse;width:100%;font-size:8px}
        th,td{border:1px solid #ddd;padding:3px 4px;text-align:left;vertical-align:top;word-break:break-word}
        th{background:#fbeec9;color:#3a0613}
        tr:nth-child(even) td{background:#fbfbfb}
      </style></head>
      <body>
        <div class="head">
          <div class="brand">BABA <span>LAGIN</span> — Profiles</div>
          <div class="sub">${rows.length} record(s) &middot; Filters: ${escH(activeFilters)} &middot; Generated: ${escH(when)}</div>
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

  // Pagination math
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paged = rows.slice(startIdx, startIdx + pageSize);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ margin: "0 0 14px", color: "#3a0613", fontSize: 20 }}>Profiles</h1>

      {/* Filters */}
      <form onSubmit={apply} style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 16 }}>
        <Field label="Gender">
          <select name="gender" value={f.gender} onChange={onChange} style={sel}>
            <option value="">All</option>
            <option value="Groom">Groom</option>
            <option value="Bride">Bride</option>
          </select>
        </Field>
        <Field label="Active">
          <select name="isActive" value={f.isActive} onChange={onChange} style={sel}>
            <option value="">All</option>
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
        </Field>
        <Field label="Created From">
          <input type="date" name="createdFrom" value={f.createdFrom} onChange={onChange} style={sel} />
        </Field>
        <Field label="Created To">
          <input type="date" name="createdTo" value={f.createdTo} onChange={onChange} style={sel} />
        </Field>
        <Field label="Payment Status">
          <select name="paymentStatus" value={f.paymentStatus} onChange={onChange} style={sel}>
            <option value="">All</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
            <option value="REJECTED">REJECTED</option>
            <option value="NONE">NONE</option>
          </select>
        </Field>
        <button type="submit" style={btnPrimary}>Apply</button>
        <button type="button" onClick={reset} style={btnGhost}>Reset</button>
      </form>

      {error && <div style={{ background: "#fdecea", color: "#b71c1c", padding: "10px 14px", borderRadius: 6, marginBottom: 12 }}>{error}</div>}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
              {total} profile(s){total > 0 ? ` — showing ${startIdx + 1}–${Math.min(startIdx + pageSize, total)}` : ""}
            </p>
            <button type="button" onClick={downloadPdf} disabled={total === 0} style={{ ...btnPrimary, opacity: total === 0 ? 0.5 : 1 }}>
              ⬇ Download PDF
            </button>
          </div>
          <div style={{ overflowX: "auto", background: "#fff", border: "1px solid #eee", borderRadius: 8 }}>
            <table style={{ borderCollapse: "collapse", fontSize: 12, whiteSpace: "nowrap" }}>
              <thead>
                <tr>
                  <th style={th}>Sr.No.</th>
                  {COLS.map((c) => (
                    <th key={c.h} style={th}>{c.h}</th>
                  ))}
                  <th style={th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((x, i) => (
                  <tr key={reg(x).id || i} style={{ background: i % 2 ? "#fbfbfb" : "#fff" }}>
                    <td style={td}>{startIdx + i + 1}</td>
                    {COLS.map((c) => (
                      <td key={c.h} style={td} title={c.g(x) || ""}>{c.g(x)}</td>
                    ))}
                    <td style={td}>
                      <button type="button" onClick={() => openEdit(x)} style={editBtn}>Edit</button>
                    </td>
                  </tr>
                ))}
                {total === 0 && (
                  <tr><td style={td} colSpan={COLS.length + 2}>No profiles match the filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {total > 0 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
              <label style={{ fontSize: 12, color: "#555", display: "flex", alignItems: "center", gap: 6 }}>
                Rows per page:
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  style={{ padding: "5px 8px", border: "1px solid #ccc", borderRadius: 6, fontSize: 13 }}
                >
                  {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button type="button" onClick={() => setPage(1)} disabled={safePage === 1} style={pageBtn(safePage === 1)}>« First</button>
                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} style={pageBtn(safePage === 1)}>‹ Prev</button>
                <span style={{ fontSize: 13, color: "#3a0613", fontWeight: 600, padding: "0 8px" }}>Page {safePage} of {totalPages}</span>
                <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} style={pageBtn(safePage === totalPages)}>Next ›</button>
                <button type="button" onClick={() => setPage(totalPages)} disabled={safePage === totalPages} style={pageBtn(safePage === totalPages)}>Last »</button>
              </div>
            </div>
          )}
        </>
      )}

      {editing && (
        <div style={overlay} onClick={closeEdit}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, color: "#3a0613" }}>Edit Profile</h2>
            {editErr && <div style={{ background: "#fdecea", color: "#b71c1c", padding: "8px 12px", borderRadius: 6, marginBottom: 10 }}>{editErr}</div>}

            <h3 style={secHead}>Record</h3>
            <div style={grid}>
              <label style={editLabel}>id (read-only)
                <input value={editing.id ?? ""} readOnly style={{ ...editInput, background: "#eee" }} />
              </label>
              <EditInput label="registrationCode" value={editing.registrationCode} onChange={(v) => setTop("registrationCode", v)} />
              <EditSelect label="isActive" value={editing.isActive || ""} options={["Y", "N"]} onChange={(v) => setTop("isActive", v)} />
              <EditSelect label="successStory" value={editing.successStory || ""} options={["Y", "N"]} onChange={(v) => setTop("successStory", v)} />
              <EditInput label="partnerId" value={editing.partnerId} onChange={(v) => setTop("partnerId", v)} />
              <label style={editLabel}>Payment Status
                <select value={editPayment} onChange={(e) => setEditPayment(e.target.value)} style={editInput}>
                  <option value="NONE">NONE</option>
                  <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </label>
            </div>

            {EDIT_SECTIONS.map(([section, fields]) => (
              <div key={section}>
                <h3 style={secHead}>{section}</h3>
                <div style={grid}>
                  {fields.map((fld) => (
                    <EditInput key={fld} label={fld} value={editing[section]?.[fld]} onChange={(v) => setSec(section, fld, v)} />
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
              <button type="button" onClick={closeEdit} style={btnGhost} disabled={saving}>Cancel</button>
              <button type="button" onClick={saveEdit} style={btnPrimary} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditInput({ label, value, onChange }) {
  return (
    <label style={editLabel}>{label}
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={editInput} />
    </label>
  );
}

function EditSelect({ label, value, options, onChange }) {
  return (
    <label style={editLabel}>{label}
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} style={editInput}>
        <option value=""></option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#555", fontWeight: 600 }}>
      {label}
      {children}
    </label>
  );
}

const sel = { padding: "8px 10px", border: "1px solid #ccc", borderRadius: 6, fontSize: 13, minWidth: 150 };
const btnPrimary = { padding: "9px 18px", background: "#3a0613", color: "#f0b429", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700 };
const btnGhost = { padding: "9px 18px", background: "#fff", color: "#3a0613", border: "1px solid #3a0613", borderRadius: 6, cursor: "pointer", fontWeight: 600 };
const th = { textAlign: "left", padding: "8px 10px", background: "#fbeec9", color: "#3a0613", borderBottom: "2px solid #f0e4c8", position: "sticky", top: 0 };
const td = { padding: "7px 10px", borderBottom: "1px solid #eee", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" };
const editBtn = { padding: "5px 14px", background: "#3a0613", color: "#f0b429", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12, fontWeight: 700 };
const pageBtn = (disabled) => ({ padding: "6px 12px", background: disabled ? "#f3f3f3" : "#fff", color: disabled ? "#aaa" : "#3a0613", border: "1px solid #ccc", borderRadius: 6, cursor: disabled ? "default" : "pointer", fontSize: 12, fontWeight: 600 });
const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 24, zIndex: 1000, overflowY: "auto" };
const modal = { background: "#fff", borderRadius: 10, padding: 24, width: 920, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 };
const secHead = { marginTop: 18, marginBottom: 6, color: "#7a1224", borderBottom: "1px solid #eee", paddingBottom: 4, fontSize: 14, textTransform: "capitalize" };
const editLabel = { display: "flex", flexDirection: "column", gap: 3, fontSize: 11, color: "#555", fontWeight: 600 };
const editInput = { padding: "7px 9px", border: "1px solid #ccc", borderRadius: 5, fontSize: 13 };
