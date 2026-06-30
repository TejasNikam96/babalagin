import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SkeletonCards from "../SkeletonCard";
import { toast } from "../../utils/toast";
import { DEFAULT_AVATAR, photoOf } from "../../utils/avatar";
import NotActiveTag from "../NotActiveTag";
import ChatModal from "../ChatModal";
import { downloadProfilePdf } from "../../utils/profilePdf";
import ProfilePhoto from "../ProfilePhoto";
import LikeButton from "../LikeButton";

function Avatar({ p }) {
  return (
    <ProfilePhoto
      code={p.registrationCode}
      src={photoOf(p)}
      count={p.photoCount}
      alt={`${p.registrationCode} profile`}
      className="w-16 h-16 rounded-full object-cover border-2 border-[#f0b429]"
    />
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
      <h3 className="text-sm font-bold text-[#7A2238] border-b border-gray-200 pb-1 mb-2">{title}</h3>
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

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptedSet, setAcceptedSet] = useState(new Set());
  const setNotice = (m) => { if (m) toast(m); };
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [chatWith, setChatWith] = useState(null);

  const lookingFor = params.get("lookingFor");
  const ageFrom = params.get("ageFrom");
  const ageTo = params.get("ageTo");
  const education = params.get("education");
  const location = params.get("location");
  const community = params.get("community");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch(`/api/profiles/search?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => { if (active) setResults(data || []); })
      .catch(() => { if (active) setError("Could not load results. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [params]);

  // Accepted connections of the logged-in user (drives Accepted/Message).
  useEffect(() => {
    if (!user) { setAcceptedSet(new Set()); return; }
    fetch(`/api/interest/accepted?code=${encodeURIComponent(user.registrationCode)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => setAcceptedSet(new Set((list || []).map((x) => x.registrationCode))))
      .catch(() => {});
  }, [user]);

  const handleView = (p) => {
    if (!user) { setNotice("Login first to view profile"); return; }
    setDetailLoading(true);
    setDetail({ registrationCode: p.registrationCode, photo: p.photo });
    const viewer = user.registrationCode ? `?viewerCode=${encodeURIComponent(user.registrationCode)}` : "";
    fetch(`/api/profiles/${encodeURIComponent(p.registrationCode)}${viewer}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setDetail({ ...d, photo: p.photo }))
      .catch(() => { setDetail(null); setNotice("Could not load profile. Please try again."); })
      .finally(() => setDetailLoading(false));
  };

  const handleInterest = (p) => {
    if (!user) { setNotice("Login first to express interest"); return; }
    if (p.registrationCode === user.registrationCode) { setNotice("You cannot express interest in your own profile."); return; }
    fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromCode: user.registrationCode, toCode: p.registrationCode }),
    })
      .then(() => setNotice(`Your interest has been sent to ${p.name || "this profile"}.`))
      .catch(() => setNotice("Could not send interest. Please try again."));
  };

  const handleMessage = (p) => {
    if (!user) { setNotice("Login first to send a message"); return; }
    setChatWith({ registrationCode: p.registrationCode, name: p.name || p.registrationCode });
  };

  const detailName = detail && detail.personal
    ? `${detail.personal.firstName || ""} ${detail.personal.lastName || ""}`.trim()
    : (detail ? detail.registrationCode : "");

  // Active-filter chips (removable).
  const chips = useMemo(() => {
    const c = [];
    if (lookingFor) c.push({ label: `Looking for: ${lookingFor}`, keys: ["lookingFor"] });
    if (ageFrom && ageTo) c.push({ label: `Age: ${ageFrom}–${ageTo}`, keys: ["ageFrom", "ageTo"] });
    if (education && education !== "Any") c.push({ label: `Education: ${education}`, keys: ["education"] });
    if (location && location !== "Any") c.push({ label: `Location: ${location}`, keys: ["location"] });
    if (community && community !== "Any") c.push({ label: `Community: ${community}`, keys: ["community"] });
    return c;
  }, [lookingFor, ageFrom, ageTo, education, location, community]);

  const removeChip = (keys) => {
    const sp = new URLSearchParams(params);
    keys.forEach((k) => sp.delete(k));
    navigate(`/search/results?${sp.toString()}`);
  };
  const clearAll = () => navigate("/search/results");

  return (
    <div className="min-h-[60vh] bg-[#fdf8ee] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-[#3a0613]">Matching Profiles</h1>

        {/* Active filter chips */}
        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <span key={c.keys.join()} className="inline-flex items-center gap-1.5 bg-[#fdf3da] border border-[#f0e4c8] text-[#7a1224] text-xs font-medium px-2.5 py-1 rounded-full">
                {c.label}
                <button type="button" onClick={() => removeChip(c.keys)} className="text-[#7a1224]/70 hover:text-[#7a1224] font-bold leading-none" aria-label={`Remove ${c.label}`}>×</button>
              </span>
            ))}
            <button type="button" onClick={clearAll} className="text-xs text-[#6B0F2B] underline hover:no-underline">Clear all</button>
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <SkeletonCards count={6} />
          ) : error ? (
            <p className="text-red-700">{error}</p>
          ) : results.length === 0 ? (
            <div className="bg-white border border-[#f0e4c8] rounded-lg p-8 text-center text-gray-600">
              No matching profiles found. Try widening your filters.
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{results.length} profile(s) found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((p) => {
                  const accepted = acceptedSet.has(p.registrationCode);
                  return (
                  <div key={p.registrationCode} className="bg-white rounded-xl border border-[#f0e4c8] shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
                    <div className="flex items-center gap-4">
                      <Avatar p={p} />
                      <div>
                        <h3 className="font-bold text-[#7a1224] text-lg leading-tight">{p.name}</h3>
                        <p className="text-xs text-gray-500">{p.registrationCode}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-[#fdf3da] text-[#7a1224] border border-[#f0e4c8]">
                            {p.gender || "—"}
                          </span>
                          <NotActiveTag isActive={p.isActive} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-700 space-y-1 flex-1">
                      <p><span className="text-gray-500">Age:</span> {p.age != null ? `${p.age} yrs` : "—"}</p>
                      <p><span className="text-gray-500">Height:</span> {p.height || "—"}</p>
                      <p><span className="text-gray-500">Education:</span> {p.education || "—"}</p>
                      <p><span className="text-gray-500">Occupation:</span> {p.occupation || "—"}{p.occupationType ? ` (${p.occupationType})` : ""}</p>
                      <p><span className="text-gray-500">Location:</span> {p.city || "—"}</p>
                      <p><span className="text-gray-500">Community:</span> {p.community || "—"}</p>
                      <p><span className="text-gray-500">Status:</span> {p.maritalStatus || "—"}</p>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <LikeButton code={p.registrationCode} viewer={user?.registrationCode} token={user?.token} onNeedLogin={(m) => setNotice(m)} className="mr-1" />
                      <button type="button" onClick={() => handleView(p)} className="bg-[#6B0F2B] hover:bg-[#8B1538] text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
                        View Profile
                      </button>
                      {accepted ? (
                        <>
                          <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">✓ Accepted</span>
                          <button type="button" onClick={() => handleMessage(p)} className="bg-[#6B0F2B] hover:bg-[#8B1538] text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
                            💬 Message
                          </button>
                        </>
                      ) : (
                        <button type="button" onClick={() => handleInterest(p)} className="bg-[#F2C14E] hover:bg-amber-400 text-[#6B0F2B] text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
                          Express Interest
                        </button>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* View Profile detail popup (email & mobile hidden) */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-[1000] overflow-y-auto" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full my-6 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-[#6B0F2B] to-[#8B1538] text-white p-5 flex items-center gap-4">
              <ProfilePhoto code={detail.registrationCode} src={detail.photo || DEFAULT_AVATAR} className="w-20 h-24 rounded-lg object-cover border-2 border-[#F2C14E]" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{detailName || detail.registrationCode}</h2>
                  <NotActiveTag isActive={detail.isActive} />
                </div>
                <p className="text-amber-200/90 text-sm">{detail.registrationCode} · {detail.personal?.maritalStatus || ""}</p>
              </div>
              <button onClick={() => setDetail(null)} className="ml-auto text-white/80 hover:text-white text-3xl leading-none">×</button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {detailLoading ? (
                <p className="text-gray-500">Loading…</p>
              ) : (
                <>
                  <Section title="Personal" data={detail.personal}
                    skip={["heightTotalInches", "heightFeet", "heightInches", "email", "mobile"]}
                    extra={{ Height: detail.personal?.heightTotalInches != null ? `${Math.floor(detail.personal.heightTotalInches / 12)}'${detail.personal.heightTotalInches % 12}"` : null }} />
                  <Section title="Horoscope" data={detail.horoscope} />
                  <Section title="Education" data={detail.education} />
                  <Section title="Address" data={detail.address} />
                  <Section title="Family" data={detail.family} />
                  <Section title="Expectation" data={detail.expectation} />
                </>
              )}
            </div>
            <div className="p-4 border-t flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <LikeButton code={detail.registrationCode} viewer={user?.registrationCode} token={user?.token} onNeedLogin={(m) => setNotice(m)} />
                <button onClick={() => { if (!downloadProfilePdf(detail, detail.photo)) setNotice("Please allow pop-ups to download the PDF."); }} className="px-5 py-2 rounded-full bg-[#6B0F2B] hover:bg-[#8B1538] text-white text-sm font-semibold">⬇ Download PDF</button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => setDetail(null)} className="px-5 py-2 rounded-full border border-[#6B0F2B] text-[#6B0F2B] text-sm font-semibold">Close</button>
                {acceptedSet.has(detail.registrationCode) ? (
                  <>
                    <span className="px-5 py-2 rounded-full bg-green-600 text-white text-sm font-bold">✓ Accepted</span>
                    <button onClick={() => handleMessage({ registrationCode: detail.registrationCode, name: detailName })} className="px-5 py-2 rounded-full bg-[#6B0F2B] hover:bg-[#8B1538] text-white text-sm font-bold">💬 Message</button>
                  </>
                ) : (
                  <button onClick={() => handleInterest({ registrationCode: detail.registrationCode, name: detailName })} className="px-5 py-2 rounded-full bg-[#F2C14E] text-[#6B0F2B] text-sm font-bold">Express Interest</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat with an accepted connection */}
      {chatWith && user && (
        <ChatModal me={user.registrationCode} other={chatWith.registrationCode} otherName={chatWith.name} onClose={() => setChatWith(null)} />
      )}
    </div>
  );
}
