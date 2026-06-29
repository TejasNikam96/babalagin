import React, { useCallback, useEffect, useState } from "react";

/**
 * Full-screen image viewer. Shows one image large with prev/next navigation
 * when multiple images are provided. Close on overlay click, ×, or Esc.
 */
export default function ImageLightbox({ images, startIndex = 0, onClose }) {
  const list = Array.isArray(images) && images.length ? images : [];
  const [i, setI] = useState(startIndex);

  const prev = useCallback((e) => { if (e) e.stopPropagation(); setI((n) => (n - 1 + list.length) % list.length); }, [list.length]);
  const next = useCallback((e) => { if (e) e.stopPropagation(); setI((n) => (n + 1) % list.length); }, [list.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  if (!list.length) return null;
  const many = list.length > 1;

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[1500] p-4" onClick={onClose}>
      <button onClick={onClose} aria-label="Close" className="absolute top-4 right-5 text-white/80 hover:text-white text-4xl leading-none">×</button>

      {many && (
        <button onClick={prev} aria-label="Previous" className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full bg-white/15 hover:bg-white/30 text-white text-2xl">‹</button>
      )}

      <div className="max-w-[92vw] max-h-[88vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img src={list[i]} alt={`Photo ${i + 1}`} className="max-w-[92vw] max-h-[80vh] object-contain rounded-lg shadow-2xl bg-white" />
        {many && <p className="mt-3 text-white/80 text-sm">{i + 1} / {list.length}</p>}
      </div>

      {many && (
        <button onClick={next} aria-label="Next" className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full bg-white/15 hover:bg-white/30 text-white text-2xl">›</button>
      )}
    </div>
  );
}
