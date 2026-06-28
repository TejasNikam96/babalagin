import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_AVATAR, photoOf } from "../../utils/avatar";

function Avatar({ p }) {
  return (
    <img
      src={photoOf(p)}
      alt={`${p.registrationCode} profile`}
      className="w-16 h-16 rounded-full object-cover border-2 border-[#f0b429]"
      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }}
    />
  );
}

export default function SearchResults() {
  const [params] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-[60vh] bg-[#fdf8ee] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-[#3a0613]">Matching Profiles</h1>
        <p className="text-sm text-gray-600 mt-1">
          Looking for <b>{lookingFor || "Any"}</b>
          {ageFrom && ageTo ? <> · Age <b>{ageFrom}–{ageTo}</b></> : null}
          {education && education !== "Any" ? <> · <b>{education}</b></> : null}
          {location && location !== "Any" ? <> · <b>{location}</b></> : null}
          {community && community !== "Any" ? <> · <b>{community}</b></> : null}
        </p>

        <div className="mt-6">
          {loading ? (
            <p className="text-gray-500">Searching…</p>
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
                {results.map((p) => (
                  <div key={p.registrationCode} className="bg-white rounded-xl border border-[#f0e4c8] shadow-sm hover:shadow-md transition-shadow p-5">
                    <div className="flex items-center gap-4">
                      <Avatar p={p} />
                      <div>
                        <h3 className="font-bold text-[#7a1224] text-lg leading-tight">{p.name}</h3>
                        <p className="text-xs text-gray-500">{p.registrationCode}</p>
                        <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-[#fdf3da] text-[#7a1224] border border-[#f0e4c8]">
                          {p.gender || "—"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-700 space-y-1">
                      <p><span className="text-gray-500">Age:</span> {p.age != null ? `${p.age} yrs` : "—"}</p>
                      <p><span className="text-gray-500">Height:</span> {p.height || "—"}</p>
                      <p><span className="text-gray-500">Education:</span> {p.education || "—"}</p>
                      <p><span className="text-gray-500">Occupation:</span> {p.occupation || "—"}{p.occupationType ? ` (${p.occupationType})` : ""}</p>
                      <p><span className="text-gray-500">Income:</span> {p.incomeRange || "—"}</p>
                      <p><span className="text-gray-500">Location:</span> {p.city || "—"}</p>
                      <p><span className="text-gray-500">Native:</span> {p.nativePlace || "—"}</p>
                      <p><span className="text-gray-500">Community:</span> {p.community || "—"}</p>
                      <p><span className="text-gray-500">Mangalik:</span> {p.mangalik || "—"}</p>
                      <p><span className="text-gray-500">Status:</span> {p.maritalStatus || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
