import React, { useEffect, useRef, useState } from "react";
import { DEFAULT_AVATAR } from "../utils/avatar";
import ProfilePhoto from "./ProfilePhoto";

// Editable fields per section (email is intentionally excluded -> read-only).
const SECTIONS = [
  ["personal", "Personal", ["firstName", "middleName", "lastName", "mobile", "gender", "dobDay", "dobMonth", "dobYear", "subCaste", "maritalStatus", "heightFeet", "heightInches", "weight", "bloodGroup", "complexion", "physicalDisability", "disabilityDetails", "diet", "spectacles", "community"]],
  ["horoscope", "Horoscope", ["rashi", "nakshatra", "charan", "gan", "gotra", "manglik", "birthTime", "birthPlace"]],
  ["education", "Education", ["highestEducation", "fieldOfStudy", "institution", "occupation", "occupationType", "employer", "annualIncome"]],
  ["address", "Address", ["country", "state", "city", "nativePlace", "pincode", "permanentAddress", "currentAddress"]],
  ["family", "Family", ["fatherName", "fatherOccupation", "motherName", "motherOccupation", "siblings", "familyType", "familyStatus"]],
  ["expectation", "Expectation", ["ageFrom", "ageTo", "heightFrom", "heightTo", "education", "occupation", "location", "otherPreferences"]],
];

const label = (k) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
const fmtDate = (s) => { if (!s) return null; try { return new Date(s).toLocaleDateString(); } catch (_) { return String(s); } };

/**
 * "My Profile" popup: the logged-in owner can edit all their details (except id
 * and email), upload a photo, and see their payment/membership expiry date.
 */
export default function MyProfileModal({ code, token, currentPhoto, onClose, onPhotoChange }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [photo, setPhoto] = useState(currentPhoto);
  const [likes, setLikes] = useState(null); // { count, likers: [code...] }
  const fileRef = useRef(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/profile/me?code=${encodeURIComponent(code)}`, { headers: { "X-Auth-Token": token || "" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => { if (active) setForm(d); })
      .catch(() => { if (active) setError("Could not load your profile. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [code, token]);

  // Who liked my profile (owner-only).
  useEffect(() => {
    let active = true;
    fetch("/api/likes/mine", { headers: { "X-Auth-Token": token || "" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (active && d) setLikes(d); })
      .catch(() => {});
    return () => { active = false; };
  }, [token]);

  const setField = (section, key, value) =>
    setForm((f) => ({ ...f, [section]: { ...(f[section] || {}), [key]: value } }));

  const save = () => {
    setSaving(true);
    setError("");
    setNotice("");
    fetch("/api/profile/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token || "" },
      body: JSON.stringify(form),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => { setForm(d); setNotice("Your profile has been updated."); })
      .catch((s) => setError(s === 403 ? "Session expired. Please log in again." : "Could not save. Please try again."))
      .finally(() => setSaving(false));
  };

  const uploadPhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("registrationCode", code);
    fd.append("docType", "profileImage");
    fd.append("file", file);
    fetch("/api/documents/upload", { method: "POST", body: fd })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { setPhoto(d.dataUrl); if (onPhotoChange) onPhotoChange(d.dataUrl); setNotice("Photo updated."); })
      .catch(() => setError("Photo upload failed. Please try again."))
      .finally(() => { if (fileRef.current) fileRef.current.value = ""; });
  };

  const email = form && form.personal ? form.personal.email : "";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-[1300] overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-br from-[#6B0F2B] to-[#8B1538] text-white p-5 flex items-center gap-4">
          <div className="relative">
            <ProfilePhoto code={code} src={photo || DEFAULT_AVATAR} className="w-20 h-24 rounded-lg object-cover border-2 border-[#F2C14E] bg-[#3a0613]" />
            <button type="button" onClick={() => fileRef.current && fileRef.current.click()} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#F2C14E] text-[#6B0F2B] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              Change
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">My Profile</h2>
            <p className="text-amber-200/90 text-sm">{code}</p>
            <p className="text-amber-100/80 text-xs mt-0.5">Click "Change" to update your photo</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-3xl leading-none">×</button>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Loading…</p>
        ) : !form ? (
          <p className="p-6 text-red-600">{error || "Could not load profile."}</p>
        ) : (
          <div className="p-5 max-h-[70vh] overflow-y-auto">
            {/* Read-only summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <ReadOnly label="Registration ID" value={code} />
              <ReadOnly label="Email (not editable)" value={email} />
              <ReadOnly label="Payment Expiry" value={fmtDate(form.renewedUntil) || "—"} />
            </div>

            {/* Who liked my profile (only the owner sees this) */}
            <div className="mb-5 bg-[#fbe9ef] border border-[#f0c9d6] rounded-lg p-3">
              <p className="text-sm font-bold text-[#7A2238] flex items-center gap-1.5">
                ❤️ {likes ? likes.count : 0} like(s) on your profile
              </p>
              {likes && likes.likers && likes.likers.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {likes.likers.map((c) => (
                    <span key={c} className="text-[11px] bg-white border border-[#e3b9c6] text-[#6B0F2B] px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-1">No likes yet.</p>
              )}
              <p className="text-[10px] text-gray-400 mt-1">Only you can see who liked your profile.</p>
            </div>

            {notice && <div className="mb-3 bg-green-50 border border-green-300 text-green-800 text-sm px-3 py-2 rounded">{notice}</div>}
            {error && <div className="mb-3 bg-[#fdecea] text-[#b71c1c] text-sm px-3 py-2 rounded">{error}</div>}

            {SECTIONS.map(([section, title, fields]) => (
              <div key={section} className="mb-4">
                <h3 className="text-sm font-bold text-[#7A2238] border-b border-gray-200 pb-1 mb-2">{title}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {fields.map((key) => (
                    <label key={key} className="flex flex-col gap-1 text-[11px] font-semibold text-gray-500">
                      {label(key)}
                      <input
                        value={(form[section] && form[section][key] != null ? form[section][key] : "")}
                        onChange={(e) => setField(section, key, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-full border border-[#6B0F2B] text-[#6B0F2B] text-sm font-semibold">Close</button>
          {form && (
            <button onClick={save} disabled={saving} className="px-6 py-2 rounded-full bg-[#6B0F2B] hover:bg-[#8B1538] text-white text-sm font-bold disabled:opacity-60">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
      <p className="text-[10px] text-gray-500 font-semibold">{label}</p>
      <p className="text-sm text-gray-800 break-words">{value || "—"}</p>
    </div>
  );
}
