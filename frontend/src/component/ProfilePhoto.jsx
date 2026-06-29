import React, { useEffect, useState } from "react";
import { DEFAULT_AVATAR } from "../utils/avatar";
import { fetchProfileImages } from "../utils/images";
import ImageLightbox from "./ImageLightbox";

/**
 * A profile image that opens a big lightbox on click, showing ALL of the
 * profile's photos. Shows a small "photos" badge with the count when the
 * profile has more than one photo. Drop-in for <img> — pass the sizing/shape
 * classes via className (applied to the wrapper).
 *
 * @param count optional known photo count (avoids a fetch); otherwise it's
 *              looked up via /api/documents/image-count.
 */
export default function ProfilePhoto({ code, src, alt = "", className = "", count }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [cnt, setCnt] = useState(typeof count === "number" ? count : null);

  useEffect(() => {
    if (typeof count === "number") { setCnt(count); return undefined; }
    if (!code) return undefined;
    let active = true;
    fetch(`/api/documents/image-count?registrationCode=${encodeURIComponent(code)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (active && d) setCnt(d.count); })
      .catch(() => {});
    return () => { active = false; };
  }, [code, count]);

  const openLightbox = async (e) => {
    if (e) e.stopPropagation();
    let imgs = code ? await fetchProfileImages(code) : [];
    if (src && !imgs.includes(src)) imgs = [src, ...imgs];
    if (!imgs.length) imgs = [src || DEFAULT_AVATAR];
    setImages(imgs);
    setOpen(true);
  };

  return (
    <>
      <span className={`relative inline-block overflow-hidden ${className}`}>
        <img
          src={src || DEFAULT_AVATAR}
          alt={alt}
          className="w-full h-full object-cover cursor-zoom-in"
          title="Click to view photo(s)"
          onClick={openLightbox}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }}
        />
        {cnt > 1 && (
          <span
            className="absolute top-0.5 right-0.5 bg-black/65 text-white text-[10px] leading-none font-bold px-1.5 py-1 rounded-full flex items-center gap-0.5 pointer-events-none"
            title={`${cnt} photos`}
          >
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="currentColor" aria-hidden="true">
              <path d="M9 3l-1.5 2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L15 3H9zm3 5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z" />
            </svg>
            {cnt}
          </span>
        )}
      </span>
      {open && <ImageLightbox images={images} onClose={() => setOpen(false)} />}
    </>
  );
}
