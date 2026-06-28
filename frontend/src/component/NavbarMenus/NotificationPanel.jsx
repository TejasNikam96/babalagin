import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Bell, Check, X as XIcon, Heart, CreditCard } from "lucide-react";
import { useSelector } from "react-redux";

const fmt = (dt) => (dt ? String(dt).replace("T", " ").slice(0, 16) : "");

function iconFor(type) {
  if (type === "PAYMENT") return <CreditCard className="w-5 h-5 text-[#f0b429]" />;
  return <Heart className="w-5 h-5 text-[#f0b429]" />;
}

const NotificationPanel = ({ isOpen, onClose, onChanged }) => {
  const user = useSelector((s) => s.auth.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?registrationCode=${encodeURIComponent(user.registrationCode)}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) { /* ignore */ } finally { setLoading(false); }
  }, [user]);

  // On open: load, then mark all read (so the bell count clears).
  useEffect(() => {
    if (isOpen && user) {
      load().then(async () => {
        try {
          await fetch(`/api/notifications/read?registrationCode=${encodeURIComponent(user.registrationCode)}`, { method: "POST" });
          if (onChanged) onChanged();
        } catch (e) { /* ignore */ }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user]);

  useEffect(() => {
    const onClick = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onClose(); };
    const onEsc = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const respond = async (id, action) => {
    try {
      await fetch("/api/interest/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: String(id), action }),
      });
      await load();
      if (onChanged) onChanged();
    } catch (e) { /* ignore */ }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#3a0613] shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#f0b429]/20 bg-[#2a040e]">
          <div>
            <h2 className="text-lg font-bold text-[#f0b429]">Notifications</h2>
            <p className="text-xs text-[#d9c7c2]">{items.length} total</p>
          </div>
          <button onClick={onClose} className="p-2 text-[#f1e9e7] hover:text-[#f0b429] hover:bg-[#5c0a1e] rounded-md transition-colors" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="h-[calc(100vh-80px)] overflow-y-auto p-4 space-y-3">
          {loading ? (
            <p className="text-[#d9c7c2] text-center py-8">Loading…</p>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-[#d9c7c2]/30 mx-auto mb-3" />
              <p className="text-[#d9c7c2]">No notifications yet</p>
              <p className="text-xs text-[#d9c7c2]/70 mt-1">You're all caught up!</p>
            </div>
          ) : (
            items.map((n) => (
              <div key={n.id} className={`rounded-lg p-3 ${n.read ? "bg-[#4a0818]" : "bg-[#5c0a1e]"}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f0b429]/15 flex items-center justify-center flex-shrink-0">
                    {iconFor(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#f1e9e7] text-sm">{n.message}</p>
                    <p className="text-[10px] text-[#d9c7c2] mt-1">{fmt(n.createdDate)}</p>

                    {n.type === "INTEREST_RECEIVED" && n.status === "PENDING" && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => respond(n.id, "ACCEPT")} className="flex items-center gap-1 px-3 py-1 bg-gradient-to-b from-[#ffdf7e] to-[#f0b429] text-[#3a0613] text-xs font-bold rounded">
                          <Check size={13} /> Accept
                        </button>
                        <button onClick={() => respond(n.id, "REJECT")} className="flex items-center gap-1 px-3 py-1 bg-[#6b0a1e] text-[#f1e9e7] text-xs rounded">
                          <XIcon size={13} /> Reject
                        </button>
                      </div>
                    )}
                    {n.type === "INTEREST_RECEIVED" && n.status === "ACCEPTED" && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded">You accepted</span>
                    )}
                    {n.type === "INTEREST_RECEIVED" && n.status === "REJECTED" && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-red-600/20 text-red-400 text-xs rounded">You rejected</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
