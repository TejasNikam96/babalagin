import React, { useEffect, useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { DEFAULT_AVATAR } from "../../utils/avatar";
import NotActiveTag from "../NotActiveTag";
import { downloadProfilePdf } from "../../utils/profilePdf";
import ChatModal from "../ChatModal";
import ProfilePhoto from "../ProfilePhoto";
import LikeButton from "../LikeButton";

function prettyLabel(k) {
  return k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function Section({ title, data, skip = [], extra = {} }) {
  const entries = data
    ? Object.entries(data).filter(([k, v]) => !skip.includes(k) && v !== null && v !== "" && typeof v !== "object")
    : [];
  const extraEntries = Object.entries(extra).filter(([, v]) => v !== null && v !== "");
  if (entries.length === 0 && extraEntries.length === 0) return null;
  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold text-[#7A2238] border-b border-gray-200 pb-1 mb-2 capitalize">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-sm">
        {extraEntries.map(([k, v]) => (
          <div key={k}><span className="text-gray-500">{k}: </span><span className="text-gray-800">{String(v)}</span></div>
        ))}
        {entries.map(([k, v]) => (
          <div key={k}><span className="text-gray-500">{prettyLabel(k)}: </span><span className="text-gray-800">{String(v)}</span></div>
        ))}
      </div>
    </div>
  );
}

export default function SingleIdSearch() {
  const user = useSelector((s) => s.auth.user);
  const [id, setId] = useState("");
  const [profile, setProfile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptedSet, setAcceptedSet] = useState(new Set());
  const [chatOpen, setChatOpen] = useState(false);

  // Which profiles the logged-in user is accepted-connected with.
  useEffect(() => {
    if (!user) { setAcceptedSet(new Set()); return; }
    fetch(`/api/interest/accepted?code=${encodeURIComponent(user.registrationCode)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => setAcceptedSet(new Set((list || []).map((x) => x.registrationCode))))
      .catch(() => { /* ignore */ });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProfile(null);
    const code = id.trim();
    if (!code) { setError("Please enter a Registration ID (e.g. REG00001)."); return; }
    setLoading(true);
    try {
      const viewer = user && user.registrationCode ? `?viewerCode=${encodeURIComponent(user.registrationCode)}` : "";
      const res = await fetch(`/api/profiles/${encodeURIComponent(code)}${viewer}`);
      if (res.status === 404) { setError(`No profile found for "${code}".`); return; }
      if (!res.ok) { setError(`Search failed (status ${res.status}).`); return; }
      const data = await res.json();
      setProfile(data);
      // photo from our database (documents table)
      try {
        const pr = await fetch(`/api/documents/profile-image?registrationCode=${encodeURIComponent(data.registrationCode)}`);
        setPhoto(pr.ok ? (await pr.json()).dataUrl : null);
      } catch (_) { setPhoto(null); }
    } catch (e2) {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setId(""); setProfile(null); setPhoto(null); setError(""); };

  const p = profile;
  const accepted = !!(p && acceptedSet.has(p.registrationCode));

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 px-6 py-8 sm:px-10 sm:py-10">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
          Single Id <span className="text-slate-400 font-normal">/</span> Search
        </h1>
        <hr className="mt-4 mb-8 border-gray-200" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2.5">Single Registration ID Search</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. REG00001"
              className="w-full bg-white border border-gray-300 rounded-sm px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            {!user && <p className="mt-1.5 text-xs text-[#8A6F75]">Tip: log in and connect (accepted interest) to view full contact details.</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#ffdf7e] to-[#f0b429] text-[#3a0613] font-bold py-3 rounded-sm shadow-lg hover:shadow-xl transition-all">
              <Search size={16} /> {loading ? "Searching…" : "Search"}
            </button>
            <button type="button" onClick={handleReset} className="bg-white border border-[#f0b429] text-[#6B0F2B] font-bold py-3 rounded-sm hover:bg-[#FBF1DC] transition-all">
              Reset
            </button>
          </div>
        </form>

        {error && <div className="mt-6 bg-[#fdecea] text-[#b71c1c] px-4 py-3 rounded">{error}</div>}

        {p && (
          <div className="mt-8 border border-[#f0e4c8] rounded-xl overflow-hidden">
            <div className="bg-gradient-to-br from-[#6B0F2B] to-[#8B1538] text-white p-5 flex items-center gap-4">
              <ProfilePhoto code={p.registrationCode} src={photo || DEFAULT_AVATAR} className="w-20 h-24 rounded-lg object-cover border-2 border-[#F2C14E]" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">
                    {p.personal ? `${p.personal.firstName || ""} ${p.personal.lastName || ""}`.trim() : p.registrationCode}
                  </h2>
                  <NotActiveTag isActive={p.isActive} />
                </div>
                <p className="text-amber-200/90 text-sm">{p.registrationCode} · {p.personal?.maritalStatus || ""}</p>
                <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full ${accepted ? "bg-green-600" : "bg-white/15"}`}>
                  {accepted ? "✓ Accepted — you can message" : "Limited details (connect to message)"}
                </span>
              </div>
            </div>
            <div className="p-5">
              <Section title="Personal" data={p.personal}
                skip={["heightTotalInches", "heightFeet", "heightInches", "email", "mobile"]}
                extra={{ Height: p.personal?.heightTotalInches != null ? `${Math.floor(p.personal.heightTotalInches / 12)}'${p.personal.heightTotalInches % 12}"` : null }} />
              <Section title="Horoscope" data={p.horoscope} />
              <Section title="Education" data={p.education} />
              <Section title="Address" data={p.address} />
              <Section title="Family" data={p.family} />
              <Section title="Expectation" data={p.expectation} />
            </div>
            <div className="px-5 pb-5 flex flex-wrap items-center justify-end gap-3 border-t border-[#f0e4c8] pt-4">
              <LikeButton code={p.registrationCode} viewer={user?.registrationCode} token={user?.token} onNeedLogin={(m) => setError(m)} className="mr-auto" />
              {accepted && (
                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-sm shadow-sm transition-all"
                >
                  💬 Message
                </button>
              )}
              <button
                type="button"
                onClick={() => { if (!downloadProfilePdf(p, photo)) setError("Please allow pop-ups to download the PDF."); }}
                className="flex items-center gap-2 bg-[#6B0F2B] hover:bg-[#8B1538] text-white text-sm font-semibold px-5 py-2.5 rounded-sm shadow-sm transition-all"
              >
                ⬇ Download PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {chatOpen && user && p && (
        <ChatModal
          me={user.registrationCode}
          other={p.registrationCode}
          otherName={p.personal ? `${p.personal.firstName || ""} ${p.personal.lastName || ""}`.trim() : p.registrationCode}
          onClose={() => setChatOpen(false)}
        />
      )}

      <button type="button" aria-label="Chat with us" className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-b from-[#a0552c] to-[#7a3f1f] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
