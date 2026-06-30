import React, { useEffect, useState } from "react";
import { TOAST_EVENT } from "../utils/toast";

const STYLES = {
  info: "bg-[#3a0613]",
  success: "bg-green-600",
  error: "bg-[#b71c1c]",
};

/** Renders auto-dismissing toasts triggered via the global `toast()` helper. */
export default function ToastContainer() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const onToast = (e) => {
      const t = e.detail;
      setItems((cur) => [...cur, t]);
      setTimeout(() => setItems((cur) => cur.filter((x) => x.id !== t.id)), 3500);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  if (!items.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[2000] flex flex-col gap-2 max-w-xs w-[88vw] sm:w-auto">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          onClick={() => setItems((cur) => cur.filter((x) => x.id !== t.id))}
          className={`px-4 py-3 rounded-lg shadow-xl text-sm text-white cursor-pointer ${STYLES[t.type] || STYLES.info}`}
          style={{ animation: "babaToastIn .2s ease-out" }}
        >
          {t.message}
        </div>
      ))}
      <style>{`@keyframes babaToastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
