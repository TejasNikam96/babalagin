import React, { useState } from "react";
import { DEFAULT_AVATAR } from "../utils/avatar";
import { fetchProfileImages } from "../utils/images";
import ImageLightbox from "./ImageLightbox";

/**
 * A profile image that opens a big lightbox on click, showing ALL of the
 * profile's photos (with prev/next when there are multiple). Drop-in for <img>.
 */
export default function ProfilePhoto({ code, src, alt = "", className = "" }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);

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
      <img
        src={src || DEFAULT_AVATAR}
        alt={alt}
        className={`${className} cursor-zoom-in`}
        title="Click to view photo(s)"
        onClick={openLightbox}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }}
      />
      {open && <ImageLightbox images={images} onClose={() => setOpen(false)} />}
    </>
  );
}
