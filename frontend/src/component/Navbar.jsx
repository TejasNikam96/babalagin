import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Bell, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Slices/authSlice";
import NotificationPanel from "./NavbarMenus/NotificationPanel";

/** Placeholder avatar shown when the user has no profile photo. */
function DummyAvatar() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#f0b429]" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20.5c0-4.2 3.6-7.5 8-7.5s8 3.3 8 7.5z" />
    </svg>
  );
}

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Rules", path: "/rules" },
  { label: "Registration", path: "/registration" },
  {
    label: "Search",
    path: "/search",
    children: [
      { label: "Matching Search", path: "/search/matching" },
      { label: "Single ID Search", path: "/search/single-id" },
    ],
  },
  {
    label: "Profile",
    path: "/profile",
    children: [
      { label: "Unmarried Grooms", path: "/profile/unmarried-grooms" },
      { label: "Unmarried Brides", path: "/profile/unmarried-brides" },
      { label: "Divorced Grooms", path: "/profile/divorsed/grooms" },
      { label: "Divorced Brides", path: "/profile/divorsed/brides" },
    ],
  }
];

const navLinksRight = [
  { label: "Renewal", path: "/renewal" },
  { label: "Success Stories", path: "/success-stories" },
  { label: "Admin", path: "/admin" },
  { label: "Contact Us", path: "/contact-us"},
];

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Hide the Admin link once a profile user is logged in.
  const rightLinks = user
    ? navLinksRight.filter((l) => l.label !== "Admin")
    : navLinksRight;

  // Hide the Registration link once a profile user is logged in, and add an
  // "Accepted Profiles" item to the Profile dropdown (logged-in only).
  const leftLinks = (user ? navLinks.filter((l) => l.label !== "Registration") : navLinks).map((l) => {
    if (user && l.label === "Profile" && l.children) {
      return { ...l, children: [...l.children, { label: "Accepted Profiles", path: "/accepted" }] };
    }
    return l;
  });

  // Profile photo (from the documents table) for the logged-in user.
  const [profileImg, setProfileImg] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    if (user && user.registrationCode) {
      fetch(`/api/documents/profile-image?registrationCode=${encodeURIComponent(user.registrationCode)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (active) setProfileImg(d ? d.dataUrl : null); })
        .catch(() => { if (active) setProfileImg(null); });
    } else {
      setProfileImg(null);
    }
    return () => { active = false; };
  }, [user]);

  const openProfileUpload = () => fileInputRef.current && fileInputRef.current.click();

  const handleProfileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !user) return;
    const fd = new FormData();
    fd.append("registrationCode", user.registrationCode);
    fd.append("docType", "profileImage");
    fd.append("file", file);
    try {
      const res = await fetch("/api/documents/upload", { method: "POST", body: fd });
      if (res.ok) {
        const d = await res.json();
        setProfileImg(d.dataUrl);
      } else {
        alert("Failed to upload photo. Please try again.");
      }
    } catch (_) {
      alert("Failed to upload photo. Please try again.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/");
  };

  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // New state for notification panel

  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);
  const [notificationCount, setNotificationCount] = useState(0);

  // Unread notification count for the logged-in profile user.
  const refreshUnread = React.useCallback(() => {
    if (!user || !user.registrationCode) { setNotificationCount(0); return; }
    fetch(`/api/notifications?registrationCode=${encodeURIComponent(user.registrationCode)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setNotificationCount(d ? d.unread : 0))
      .catch(() => setNotificationCount(0));
  }, [user]);

  useEffect(() => { refreshUnread(); }, [refreshUnread]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      if (currentScrollY <= 10) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false);
        setActiveDropdown(null);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (label) => {
    setActiveDropdown((prev) => (prev === label ? null : label));
  };

  const toggleMobileDropdown = (label) => {
    setMobileDropdown((prev) => (prev === label ? null : label));
  };

  const toggleNotificationPanel = () => {
    setIsNotificationOpen(!isNotificationOpen);
    // Close mobile menu if open
    if (open) setOpen(false);
    // Close desktop dropdowns if open
    if (activeDropdown) setActiveDropdown(null);
  };

  return (
    <>
      <nav
        className={`w-full bg-[#3a0613] border-b border-[#f0b429]/20 fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        } ${isScrolled ? "shadow-lg shadow-black/40" : ""}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
          {/* Logo - left corner */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg
                viewBox="0 0 64 64"
                className="w-12 h-12 text-[#f0b429]"
                fill="currentColor"
              >
                <path d="M32 56s-20-12.5-20-28C12 18 18 12 26 12c3.6 0 6 1.6 6 1.6S34.4 12 38 12c8 0 14 6 14 16 0 15.5-20 28-20 28z" />
              </svg>
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-[#f0b429] font-bold text-lg tracking-wide">
                BABA LAGIN
              </p>
              <p className="text-[#f0b429] text-sm -mt-1">Matrimonial Center</p>
              <p className="text-[10px] text-[#d9c7c2]">
                Trusted Matrimonial Service for the Marathi Community
              </p>
            </div>
          </div>

          {/* After-logo: profile photo + greeting + divider (desktop, when logged in) */}
          {user && (
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {/* profile photo box - click to upload / change */}
              <button
                type="button"
                onClick={openProfileUpload}
                title="Click to set / change your profile photo"
                className="w-11 h-11 rounded-md overflow-hidden border-2 border-[#f0b429]/60 bg-[#5c0a1e] flex items-center justify-center hover:border-[#f0b429] transition-colors"
              >
                {profileImg ? (
                  <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <DummyAvatar />
                )}
              </button>

              <button type="button" onClick={openProfileUpload} className="leading-tight text-left">
                <p className="text-[#f0b429] font-semibold text-sm whitespace-nowrap">
                  Hello, {user.name || "User"}
                </p>
                <p className="text-[11px] text-[#d9c7c2] -mt-0.5 whitespace-nowrap">
                  {user.registrationCode}
                </p>
              </button>

              <span className="h-10 w-px bg-white/40" />

              {/* hidden file input shared by desktop & mobile profile-photo upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileUpload}
              />
            </div>
          )}

          {/* Desktop Menu - centered */}
          <div
            ref={dropdownRef}
            className="hidden lg:flex items-center justify-center flex-1 text-sm text-[#f1e9e7] font-medium"
          >
            {leftLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(link.label)}
                    className={`flex items-center gap-1 px-3 py-2 transition-colors ${
                      activeDropdown === link.label
                        ? "text-[#f0b429]"
                        : "hover:text-[#f0b429]"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        activeDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute top-full left-0 mt-1 w-56 bg-[#3a0613] border border-[#f0b429]/30 rounded-md shadow-xl overflow-hidden origin-top transition-all duration-200 ${
                      activeDropdown === link.label
                        ? "opacity-100 scale-100 visible"
                        : "opacity-0 scale-95 invisible pointer-events-none"
                    }`}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.path}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-4 py-2.5 text-[#f1e9e7] hover:bg-[#5c0a1e] hover:text-[#f0b429] transition-colors whitespace-nowrap"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.path}
                  className="px-3 py-2 hover:text-[#f0b429] transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Desktop Right Links */}
            {rightLinks.map((link) => (
              link.path ? (
                <Link
                  key={link.label}
                  to={link.path}
                  className="px-3 py-2 hover:text-[#f0b429] transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 hover:text-[#f0b429] transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              )
            ))}

            {/* Desktop Logout (at the end) when logged in */}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 px-4 py-1.5 rounded-sm bg-[#5c0a1e] text-[#f0b429] font-bold border border-[#f0b429]/40 hover:bg-[#7a1224] transition-all whitespace-nowrap"
              >
                Logout
              </button>
            )}
          </div>

          {/* Right side: notification bell + mobile toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notification bell - only for logged-in profile users */}
            {user && (
              <button
                onClick={toggleNotificationPanel}
                className={`relative p-2 text-[#f1e9e7] hover:text-[#f0b429] hover:bg-[#5c0a1e] rounded-md transition-colors ${
                  isNotificationOpen ? 'text-[#f0b429] bg-[#5c0a1e]' : ''
                }`}
                aria-label="Notifications"
              >
                <Bell size={22} />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold border border-[#3a0613]">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile toggle button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden text-[#f0b429] p-2 hover:bg-[#5c0a1e] rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden flex flex-col bg-[#2a040e] text-[#f1e9e7] text-sm font-medium px-4 pb-4 max-h-[80vh] overflow-y-auto">
            {leftLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => toggleMobileDropdown(link.label)}
                    className="w-full flex items-center justify-between py-2.5 hover:text-[#f0b429] transition-colors"
                  >
                    {link.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        mobileDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileDropdown === link.label && (
                    <div className="pl-4 pb-2 flex flex-col gap-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.path}
                          onClick={() => {
                            setOpen(false);
                            setMobileDropdown(null);
                          }}
                          className="py-2 text-[#d9c7c2] hover:text-[#f0b429] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="py-2 border-b border-white/10 hover:text-[#f0b429] transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Mobile greeting + profile photo (click to upload) when logged in */}
            {user && (
              <button
                type="button"
                onClick={openProfileUpload}
                className="py-2 border-b border-white/10 flex items-center gap-3 text-left w-full"
              >
                <span className="w-10 h-10 rounded-md overflow-hidden border-2 border-[#f0b429]/60 bg-[#5c0a1e] flex items-center justify-center shrink-0">
                  {profileImg ? (
                    <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <DummyAvatar />
                  )}
                </span>
                <span>
                  <span className="block text-[#f0b429] font-bold">Hello, {user.name || "User"}</span>
                  <span className="block text-[11px] text-[#d9c7c2]">{user.registrationCode}</span>
                </span>
              </button>
            )}

            {/* Mobile Right Links */}
            {rightLinks.map((link) => (
              link.path ? (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="py-2 border-b border-white/10 hover:text-[#f0b429] transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-2 border-b border-white/10 hover:text-[#f0b429] transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}

            {/* Mobile: Logout when logged in (Profile Login button removed) */}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 text-center px-4 py-2.5 rounded-sm bg-[#5c0a1e] text-[#f0b429] font-bold border border-[#f0b429]/40"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onChanged={refreshUnread}
      />

      {/* Spacer so fixed navbar doesn't cover page content underneath it */}
      <div className="h-[80px]" />
    </>
  );
}