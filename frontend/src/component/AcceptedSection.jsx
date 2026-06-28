import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

/**
 * Home-page section (only for logged-in users) showing how many profiles have
 * accepted the user's interest. Clicking opens the full accepted list.
 */
export default function AcceptedSection() {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) { setCount(0); return; }
    fetch(`/api/interest/accepted?code=${encodeURIComponent(user.registrationCode)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => setCount((list || []).length))
      .catch(() => { /* ignore */ });
  }, [user]);

  if (!user) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      <button
        type="button"
        onClick={() => navigate("/accepted")}
        className="w-full flex items-center justify-between gap-4 bg-gradient-to-r from-[#3a0613] to-[#7a1224] text-white rounded-xl px-6 py-5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
      >
        <div className="flex items-center gap-4">
          <span className="grid place-items-center w-12 h-12 rounded-full bg-[#f0b429]/15 border border-[#f0b429]/40">
            <Heart className="w-6 h-6 text-[#f0b429]" fill="#f0b429" />
          </span>
          <div className="text-left">
            <p className="text-[#f0b429] font-bold text-lg leading-tight">Accepted Profiles</p>
            <p className="text-white/75 text-sm">Profiles that accepted your interest — click to view details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-[#f0b429]">{count}</span>
          <span className="text-white/70 text-xl">→</span>
        </div>
      </button>
    </section>
  );
}
