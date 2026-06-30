import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";

/**
 * Like widget: a heart icon with the total like count below it. A logged-in
 * user can like once or toggle it off. The count is public; who liked is not
 * shown here (only the owner sees that, on their My Profile page).
 *
 * @param code    the profile being liked (registrationCode)
 * @param viewer  the logged-in user's registrationCode (or null/undefined)
 * @param token   the logged-in user's session token
 * @param onNeedLogin optional callback(message) when a logged-out user clicks
 */
export default function LikeButton({ code, viewer, token, onNeedLogin, className = "" }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const headers = token ? { "X-Auth-Token": token } : {};
    fetch(`/api/likes/status?code=${encodeURIComponent(code)}`, { headers })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (active && d) { setCount(d.count); setLiked(!!d.liked); } })
      .catch(() => {});
    return () => { active = false; };
  }, [code, token]);

  const toggle = (e) => {
    if (e) e.stopPropagation();
    if (!viewer || !token) { onNeedLogin && onNeedLogin("Login first to like a profile"); return; }
    if (viewer === code) { onNeedLogin && onNeedLogin("You cannot like your own profile."); return; }
    setBusy(true);
    fetch("/api/likes/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
      body: JSON.stringify({ code }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { setCount(d.count); setLiked(!!d.liked); })
      .catch(() => {})
      .finally(() => setBusy(false));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      title={liked ? "Click to unlike" : "Like this profile"}
      className={`flex flex-col items-center justify-center leading-none select-none ${className}`}
    >
      <Heart className="w-5 h-5" stroke={liked ? "#e0245e" : "#6B0F2B"} fill={liked ? "#e0245e" : "none"} />
      <span className="text-[11px] font-semibold mt-0.5" style={{ color: liked ? "#e0245e" : "#6B0F2B" }}>{count}</span>
    </button>
  );
}
