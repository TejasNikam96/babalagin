import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginForm from "../Login/LoginForm";

/* ---------- Inline Icons (scoped to this component) ---------- */
const ShieldIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
  </svg>
);

const UsersIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M16 14c2.8 0 5 2 5 6" />
  </svg>
);

const HeartIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M12 21s-7.5-4.6-10-9.3C.4 8 2.3 4.5 6 4.5c2 0 3.5 1.1 4.5 2.6 1-1.5 2.5-2.6 4.5-2.6 3.7 0 5.6 3.5 4 7.2C19.5 16.4 12 21 12 21z" />
  </svg>
);

const SearchIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const heroPoints = [
  { icon: ShieldIcon, label: "Trusted & Secure Profiles" },
  { icon: UsersIcon, label: "Experienced Matchmakers" },
  { icon: HeartIcon, label: "Thousands of Successful Marriages" },
];

// No external images — the hero uses a maroon gradient background.
const DEFAULT_IMAGES = [];

/**
 * Carousel — the homepage hero. Features a beautiful crossfading photo
 * carousel with multiple Indian wedding and cultural images. The carousel
 * automatically transitions between images with a smooth Ken Burns zoom
 * effect for a premium look.
 */
export default function Carousel({
  images = DEFAULT_IMAGES,
  videoSrc = null, // e.g. "/videos/hero.mp4" — overrides the photo carousel entirely
  interval = 5000, // ms each photo stays on screen
  onSearch, // optional: ({ from, to, ageFrom, ageTo, education, city, community }) => void
}) {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [from, setFrom] = useState("Groom");
  const [to, setTo] = useState("Bride");
  const [ageFrom, setAgeFrom] = useState("22");
  const [ageTo, setAgeTo] = useState("30");
  const [education, setEducation] = useState("Any");
  const [city, setCity] = useState("Any");
  const [community, setCommunity] = useState("Any");

  // respect prefers-reduced-motion: keep the photo, skip the zoom
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  // slow "Ken Burns" zoom — restarts fresh every time the slide changes
  useEffect(() => {
    if (videoSrc || reducedMotion) return;
    setZoomed(false);
    const t = setTimeout(() => setZoomed(true), 60);
    return () => clearTimeout(t);
  }, [index, videoSrc, reducedMotion]);

  // auto-advance through the photo set
  useEffect(() => {
    if (videoSrc || images.length <= 1 || isPaused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images.length, interval, videoSrc, isPaused]);

  // Preload images for smoother transitions
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  function handleSearch() {
    onSearch?.({ from, to, ageFrom, ageTo, education, city, community });
    const params = new URLSearchParams();
    if (to) params.set("lookingFor", to);            // "Bride" / "Groom"
    if (ageFrom) params.set("ageFrom", ageFrom);
    if (ageTo) params.set("ageTo", ageTo);
    if (education && education !== "Any") params.set("education", education);
    if (city && city !== "Any") params.set("location", city);
    if (community && community !== "Any") params.set("community", community);
    navigate(`/search/results?${params.toString()}`);
  }

  function goToSlide(index) {
    setIndex(index);
  }

  function nextSlide() {
    setIndex((i) => (i + 1) % images.length);
  }

  function prevSlide() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <section 
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ---- background: maroon gradient (no external images) ---- */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a0613] via-[#5c0a1e] to-[#7a1224]" />
      {/* subtle gold glows for depth */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#f0b429] opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#f0b429] opacity-10 blur-3xl" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-8 min-h-[600px] lg:min-h-[700px]">
        {/* Left Side - Hero Text */}
        <div className="flex-1 text-white space-y-6">
          <div className="flex items-center gap-2 text-[#f0b429]">
            <span className="h-px w-12 bg-[#f0b429]/60" />
            <HeartIcon className="w-5 h-5" />
            <span className="h-px w-12 bg-[#f0b429]/60" />
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            <span className="text-[#f0b429]">BABA LAGIN</span>
            <br />
            <span className="text-white">Matrimonial Center</span>
          </h1>
          
          <p className="text-gray-200 text-lg max-w-md">
            Trusted Matrimonial Platform
            <br />
            for the Marathi Community
          </p>

          <div className="flex flex-wrap gap-6 pt-4">
            {heroPoints.map((pt, i) => (
              <div key={i} className="flex flex-col items-center text-center w-28">
                <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-[#f0b429]/40 flex items-center justify-center text-[#f0b429] mb-2 transition-transform hover:scale-110">
                  <pt.icon className="w-7 h-7" />
                </div>
                <p className="text-xs text-gray-200 leading-tight">{pt.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - login form before login, "Find Your Life Partner" search after */}
        <div className="w-full max-w-sm bg-[#fdf3da] rounded-xl shadow-2xl p-6 border border-[#f0e4c8] backdrop-blur-sm">
          {!user ? (
            <LoginForm />
          ) : (
          <>
          <h3 className="text-center text-[#7a1224] font-bold text-xl mb-5">
            Find Your Life Partner
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-[#5c1018] font-medium">I am</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded border border-[#d8c39a] bg-white text-sm text-[#3a0613] focus:outline-none focus:ring-2 focus:ring-[#7a1224]/50"
              >
                <option>Groom</option>
                <option>Bride</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#5c1018] font-medium">Looking for</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded border border-[#d8c39a] bg-white text-sm text-[#3a0613] focus:outline-none focus:ring-2 focus:ring-[#7a1224]/50"
              >
                <option>Bride</option>
                <option>Groom</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-[#5c1018] font-medium">Age</label>
            <div className="flex items-center gap-2 mt-1">
              <select
                value={ageFrom}
                onChange={(e) => setAgeFrom(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#d8c39a] bg-white text-sm text-[#3a0613] focus:outline-none focus:ring-2 focus:ring-[#7a1224]/50"
              >
                {Array.from({ length: 40 }, (_, i) => i + 18).map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
              <span className="text-sm text-[#5c1018] font-medium">to</span>
              <select
                value={ageTo}
                onChange={(e) => setAgeTo(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#d8c39a] bg-white text-sm text-[#3a0613] focus:outline-none focus:ring-2 focus:ring-[#7a1224]/50"
              >
                {Array.from({ length: 40 }, (_, i) => i + 18).map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-[#5c1018] font-medium">Education</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded border border-[#d8c39a] bg-white text-sm text-[#3a0613] focus:outline-none focus:ring-2 focus:ring-[#7a1224]/50"
              >
                <option>Any</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
                <option>Doctor</option>
                <option>Engineer</option>
                <option>MBA</option>
                <option>CA</option>
                <option>Lawyer</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#5c1018] font-medium">Location</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded border border-[#d8c39a] bg-white text-sm text-[#3a0613] focus:outline-none focus:ring-2 focus:ring-[#7a1224]/50"
              >
                <option>Any</option>
                <option>Pune</option>
                <option>Mumbai</option>
                <option>Nashik</option>
                <option>Aurangabad</option>
                <option>Nagpur</option>
                <option>Solapur</option>
                <option>Kolhapur</option>
                <option>Satara</option>
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-xs text-[#5c1018] font-medium">Community</label>
            <select
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded border border-[#d8c39a] bg-white text-sm text-[#3a0613] focus:outline-none focus:ring-2 focus:ring-[#7a1224]/50"
            >
              <option>Any</option>
              <option>Marathi</option>
              <option>Maratha</option>
              <option>Deshastha</option>
              <option>Chitpavan</option>
              <option>Kunbi</option>
              <option>Other</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7a1224] to-[#5c0e1c] hover:from-[#5c0e1c] hover:to-[#3a0613] text-white font-bold py-3 rounded-md transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
          >
            <SearchIcon className="w-5 h-5" />
            Search
          </button>
          </>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {!videoSrc && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-2 rounded-full transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-2 rounded-full transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Slide Position Dots */}
      {!videoSrc && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index 
                  ? "w-8 bg-[#f0b429]" 
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {!videoSrc && images.length > 1 && (
        <div className="absolute bottom-6 right-6 z-10 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
          {index + 1} / {images.length}
        </div>
      )}
    </section>
  );
}