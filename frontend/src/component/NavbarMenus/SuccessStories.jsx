import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { photoOf } from "../../utils/avatar";
import NotActiveTag from "../NotActiveTag";
import ProfilePhoto from "../ProfilePhoto";

function Avatar({ p }) {
  return (
    <ProfilePhoto
      code={p?.registrationCode}
      src={photoOf(p)}
      alt={p?.name || ""}
      className="w-24 h-24 rounded-full object-cover border-4 border-[#F2C14E] shadow"
    />
  );
}

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/success-stories")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => { if (active) setStories(d || []); })
      .catch(() => { if (active) setError("Could not load success stories."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF1DC]">
      <div className="bg-gradient-to-br from-[#6B0F2B] via-[#8B1538] to-[#4A0A1E] text-white py-10 px-4 text-center">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F2C14E]">BABA LAGIN</p>
        <h1 className="mt-2 font-serif text-3xl font-bold flex items-center justify-center gap-3">
          <Heart className="w-6 h-6 text-[#F2C14E]" fill="#F2C14E" /> Success Stories <Heart className="w-6 h-6 text-[#F2C14E]" fill="#F2C14E" />
        </h1>
        <p className="mt-2 text-white/80 text-sm">Happy couples who found each other through us</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center text-[#6B0F2B]">Loading…</p>
        ) : error ? (
          <p className="text-center text-[#7A2238]">{error}</p>
        ) : stories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Heart className="w-12 h-12 text-[#6B0F2B]/20 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#6B0F2B]">No success stories yet</h3>
            <p className="text-sm text-gray-500 mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {stories.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md border border-[#f0e4c8] p-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <Avatar p={s.person} />
                    <p className="mt-2 font-bold text-[#6B0F2B] text-sm">{s.person?.name || "—"}</p>
                    <p className="text-[11px] text-gray-500">{s.person?.city || ""}</p>
                    <div className="mt-1 flex justify-center"><NotActiveTag isActive={s.person?.isActive} /></div>
                  </div>
                  <Heart className="w-8 h-8 text-[#e74c3c] shrink-0" fill="#e74c3c" />
                  <div className="text-center">
                    {s.partner ? (
                      <>
                        <Avatar p={s.partner} />
                        <p className="mt-2 font-bold text-[#6B0F2B] text-sm">{s.partner.name || "—"}</p>
                        <p className="text-[11px] text-gray-500">{s.partner.city || ""}</p>
                        <div className="mt-1 flex justify-center"><NotActiveTag isActive={s.partner.isActive} /></div>
                      </>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#fdf3da] border-4 border-[#F2C14E] flex items-center justify-center text-[#7a1224] text-xs">Partner</div>
                    )}
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-gray-600">
                  Happily matched through <span className="font-semibold text-[#7a1224]">BABA LAGIN</span>
                  {s.person?.community ? ` · ${s.person.community}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
