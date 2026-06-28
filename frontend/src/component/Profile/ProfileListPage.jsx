import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { DEFAULT_AVATAR, photoOf } from "../../utils/avatar";

/**
 * Shared, data-driven listing page for the Profile dropdown menus.
 * Fetches from /api/profiles/search filtered by gender (lookingFor) + maritalStatus.
 */

function InfoBadge({ icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
      <span className="text-[#6B0F2B] text-sm">{icon}</span>
      <span className="text-[10px] text-gray-500">{label}:</span>
      <span className="text-xs font-medium text-gray-800">{value || "—"}</span>
    </div>
  );
}

function ProfileCard({ p, accepted, onView, onInterest }) {
  // Profile photo from our database (or local default).
  const photo = photoOf(p);
  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-amber-100 hover:border-amber-300">
      <div className="h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-shrink-0 self-center sm:self-auto">
            <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-lg overflow-hidden shadow-md">
              <img
                src={photo}
                alt={`${p.registrationCode} profile`}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }}
              />
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#6B0F2B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
              {p.registrationCode}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-1 mb-2">
              <div>
                <h3 className="text-lg font-bold text-[#6B0F2B]">{p.name || "—"}</h3>
                <p className="text-xs text-gray-500">{p.maritalStatus} · {p.community || "—"}</p>
              </div>
              <button type="button" onClick={() => onView(p)} className="bg-[#6B0F2B] hover:bg-[#8B1538] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all shadow-sm">
                View Profile
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              <InfoBadge icon="🎂" label="Age" value={p.age != null ? `${p.age} yrs` : ""} />
              <InfoBadge icon="📏" label="Height" value={p.height} />
              <InfoBadge icon="📍" label="Residence" value={p.city} />
              <InfoBadge icon="🏠" label="Native" value={p.nativePlace} />
              <InfoBadge icon="🎓" label="Education" value={p.education} />
              <InfoBadge icon="💼" label="Occupation" value={p.occupation ? `${p.occupation}${p.incomeRange ? " / " + p.incomeRange : ""}` : ""} />
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {accepted ? (
                <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">✓ Accepted</span>
              ) : (
                <button type="button" onClick={() => onInterest(p)} className="bg-[#F2C14E] hover:bg-amber-400 text-[#6B0F2B] text-xs font-semibold px-3 py-1 rounded-full transition-colors shadow-sm">
                  Express Interest
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileListPage({ title, gender, maritalStatus, mode }) {
  const user = useSelector((s) => s.auth.user);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [acceptedSet, setAcceptedSet] = useState(new Set()); // codes the user is connected with
  const [notice, setNotice] = useState(null);       // error/info popup text
  const [detail, setDetail] = useState(null);       // full profile for the View Profile popup
  const [detailLoading, setDetailLoading] = useState(false);

  const handleView = (p) => {
    if (!user) { setNotice("Login first to view profile"); return; }
    setDetailLoading(true);
    setDetail({ registrationCode: p.registrationCode, photo: p.photo }); // open modal with loader
    const viewer = user.registrationCode ? `?viewerCode=${encodeURIComponent(user.registrationCode)}` : "";
    fetch(`/api/profiles/${encodeURIComponent(p.registrationCode)}${viewer}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setDetail({ ...d, photo: p.photo }))
      .catch(() => { setDetail(null); setNotice("Could not load profile. Please try again."); })
      .finally(() => setDetailLoading(false));
  };

  const handleInterest = (p) => {
    if (!user) { setNotice("Login first to express interest"); return; }
    if (p?.registrationCode && p.registrationCode === user.registrationCode) {
      setNotice("You cannot express interest in your own profile.");
      return;
    }
    fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromCode: user.registrationCode, toCode: p?.registrationCode }),
    })
      .then(() => setNotice(`Your interest has been sent to ${p?.name || "this profile"}.`))
      .catch(() => setNotice("Could not send interest. Please try again."));
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    let url;
    if (mode === "accepted") {
      if (!user) { setAll([]); setLoading(false); return undefined; }
      url = `/api/interest/accepted?code=${encodeURIComponent(user.registrationCode)}`;
    } else {
      const params = new URLSearchParams();
      if (gender) params.set("lookingFor", gender);
      if (maritalStatus) params.set("maritalStatus", maritalStatus);
      url = `/api/profiles/search?${params.toString()}`;
    }
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => { if (active) setAll(data || []); })
      .catch(() => { if (active) setError("Could not load profiles. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [gender, maritalStatus, mode, user]);

  // Accepted connections of the logged-in user (drives the "Accepted" label).
  useEffect(() => {
    if (!user) { setAcceptedSet(new Set()); return; }
    fetch(`/api/interest/accepted?code=${encodeURIComponent(user.registrationCode)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => setAcceptedSet(new Set((list || []).map((x) => x.registrationCode))))
      .catch(() => { /* ignore */ });
  }, [user]);

  const filtered = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return all.filter((p) => {
      const match =
        (p.registrationCode || "").toLowerCase().includes(s) ||
        (p.name || "").toLowerCase().includes(s) ||
        (p.city || "").toLowerCase().includes(s) ||
        (p.education || "").toLowerCase().includes(s);
      if (filterBy === "all") return match;
      if (filterBy === "pune") return match && (p.city || "").toLowerCase() === "pune";
      if (filterBy === "mumbai") return match && (p.city || "").toLowerCase() === "mumbai";
      return match;
    });
  }, [all, searchTerm, filterBy]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#FBF1DC]">
      <div className="relative bg-gradient-to-br from-[#6B0F2B] via-[#8B1538] to-[#4A0A1E] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <span className="text-[#F2C14E] text-sm">●</span>{title}<span className="text-[#F2C14E] text-sm">●</span>
              </h1>
              <p className="text-amber-200/80 text-xs mt-0.5">Find your perfect life partner</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-amber-300 text-xs font-medium">{filtered.length} Profiles</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by ID, Name, City..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-9 rounded-full bg-white/95 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2C14E]"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            </div>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 rounded-full bg-white/95 text-gray-800 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#F2C14E] cursor-pointer"
            >
              <option value="all">All Locations</option>
              <option value="pune">Pune</option>
              <option value="mumbai">Mumbai</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 16C240 32 480 0 720 16C960 32 1200 0 1440 16V32H0V16Z" fill="#FBF1DC" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {loading ? (
          <div className="text-center py-12 text-[#6B0F2B]">Loading profiles…</div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm text-[#7A2238]">{error}</div>
        ) : visible.length > 0 ? (
          visible.map((p) => <ProfileCard key={p.registrationCode} p={p} accepted={acceptedSet.has(p.registrationCode)} onView={handleView} onInterest={handleInterest} />)
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-[#6B0F2B]">No Profiles Found</h3>
            <p className="text-sm text-gray-500 mt-1">No matching profiles in the database yet.</p>
          </div>
        )}
      </div>

      {visibleCount < filtered.length && (
        <div className="flex flex-col items-center gap-2 pb-10">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + 6)}
            className="bg-white border-2 border-[#6B0F2B] text-[#6B0F2B] hover:bg-[#6B0F2B] hover:text-white px-6 py-2 rounded-full font-semibold text-sm transition-all shadow-md"
          >
            View more profiles →
          </button>
          <span className="text-[10px] text-gray-400">Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}</span>
        </div>
      )}

      {/* Notice popup (login-required / info messages) */}
      {notice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1100]" onClick={() => setNotice(null)}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-[#3a0613] font-semibold mb-4">{notice}</p>
            <button onClick={() => setNotice(null)} className="px-6 py-2 rounded-full bg-[#6B0F2B] text-white text-sm font-semibold">OK</button>
          </div>
        </div>
      )}

      {/* View Profile detail popup (logged-in only; email & mobile hidden) */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-[1000] overflow-y-auto" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full my-6 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-[#6B0F2B] to-[#8B1538] text-white p-5 flex items-center gap-4">
              <img src={detail.photo || DEFAULT_AVATAR} alt="" className="w-20 h-24 rounded-lg object-cover border-2 border-[#F2C14E]" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }} />
              <div>
                <h2 className="text-xl font-bold">
                  {detail.personal ? `${detail.personal.firstName || ""} ${detail.personal.lastName || ""}`.trim() : detail.registrationCode}
                </h2>
                <p className="text-amber-200/90 text-sm">{detail.registrationCode} · {detail.personal?.maritalStatus || ""}</p>
              </div>
              <button onClick={() => setDetail(null)} className="ml-auto text-white/80 hover:text-white text-3xl leading-none">×</button>
            </div>
            <div className="p-5 max-h-[65vh] overflow-y-auto">
              {detailLoading ? (
                <p className="text-gray-500">Loading…</p>
              ) : (
                <>
                  <Section title="Personal" data={detail.personal}
                    skip={["heightTotalInches", "heightFeet", "heightInches", ...(acceptedSet.has(detail.registrationCode) ? [] : ["email", "mobile"])]}
                    extra={{ Height: detail.personal?.heightTotalInches != null ? `${Math.floor(detail.personal.heightTotalInches / 12)}'${detail.personal.heightTotalInches % 12}"` : null }} />
                  <Section title="Horoscope" data={detail.horoscope} />
                  <Section title="Education" data={detail.education} />
                  <Section title="Address" data={detail.address} />
                  <Section title="Family" data={detail.family} />
                  <Section title="Expectation" data={detail.expectation} />
                </>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button onClick={() => setDetail(null)} className="px-5 py-2 rounded-full border border-[#6B0F2B] text-[#6B0F2B] text-sm font-semibold">Close</button>
              {acceptedSet.has(detail.registrationCode) ? (
                <span className="px-5 py-2 rounded-full bg-green-600 text-white text-sm font-bold">✓ Accepted</span>
              ) : (
                <button
                  onClick={() => handleInterest({ registrationCode: detail.registrationCode, name: detail.personal ? `${detail.personal.firstName || ""} ${detail.personal.lastName || ""}`.trim() : "" })}
                  className="px-5 py-2 rounded-full bg-[#F2C14E] text-[#6B0F2B] text-sm font-bold"
                >
                  Express Interest
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
