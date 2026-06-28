import React, { useState } from "react";
import HowItWorks from "./HowItWorks";
import WhatMakesUsDifferent from "./WhatMakesUsDifferent";
import Footer from "./Footer";
import Carousel from "./NavbarMenus/Carousel";
import AcceptedSection from "./AcceptedSection";

/* ---------- Inline Icons ---------- */
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

const LockIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

const UserIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);

const HeadsetIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M4 13a8 8 0 0116 0" />
    <rect x="2" y="13" width="5" height="6" rx="2" />
    <rect x="17" y="13" width="5" height="6" rx="2" />
    <path d="M20 19a4 4 0 01-4 4h-2" />
  </svg>
);

const SearchIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const ChevronLeft = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const StarIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ClockIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MapPinIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const AwardIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="12" cy="8" r="6" />
    <path d="M8.5 14.5L6 22l6-3 6 3-2.5-7.5" />
  </svg>
);

const PhoneIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

/* ---------- Data ---------- */
const heroPoints = [
  { icon: ShieldIcon, label: "Trusted & Secure Profiles" },
  { icon: UsersIcon, label: "Experienced Matchmakers" },
  { icon: HeartIcon, label: "Thousands of Successful Marriages" },
];

const stats = [
  { icon: ShieldIcon, value: "15+", label: "Years of Experience" },
  { icon: UsersIcon, value: "50K+", label: "Registered Members" },
  { icon: HeartIcon, value: "4500+", label: "Successful Marriages" },
  { icon: LockIcon, value: "100%", label: "Secure & Confidential" },
];

const features = [
  { icon: ShieldIcon, title: "Verified Profiles", desc: "All profiles are thoroughly verified." },
  { icon: LockIcon, title: "Privacy Protected", desc: "Your information is completely secure." },
  { icon: UserIcon, title: "Personalized Service", desc: "Helping you find the right match." },
  { icon: HeadsetIcon, title: "Support Team", desc: "Our team is always at your service." },
];

// New Community Statistics
const communityStats = [
  { value: "5865", label: "Grooms", icon: "👨" },
  { value: "5266", label: "Brides", icon: "👩" },
  { value: "393", label: "Divorced Grooms", icon: "👨‍🦰" },
  { value: "392", label: "Divorced Brides", icon: "👩‍🦰" },
];

const whyChooseUs = [
  { icon: AwardIcon, title: "15+ Years Experience", desc: "Extensive experience in the matrimonial field" },
  { icon: UsersIcon, title: "50,000+ Members", desc: "Large member base across the country" },
  { icon: HeartIcon, title: "4500+ Successful Marriages", desc: "Large number of happy couples" },
  { icon: ShieldIcon, title: "100% Privacy", desc: "Your information is completely secure" },
];

const membershipPlans = [
  { 
    name: "Silver", 
    price: "₹2,499", 
    duration: "3 Months",
    features: ["Create Profile", "Basic Search", "View 10 Profiles", "Email Support"],
    popular: false
  },
  { 
    name: "Gold", 
    price: "₹4,999", 
    duration: "6 Months",
    features: ["Create Profile", "Advanced Search", "Unlimited Profiles", "Personal Consultation", "Priority Support"],
    popular: true
  },
  { 
    name: "Platinum", 
    price: "₹9,999", 
    duration: "12 Months",
    features: ["All Features", "Profile Verification", "Special Matchmaker", "24/7 Support", "Success Story Feature"],
    popular: false
  }
];

const communityEvents = [
  { title: "Marriage Meet - Pune", date: "August 15, 2026", location: "Pune", type: "Physical" },
  { title: "Online Introduction Program", date: "August 20, 2026", location: "Online", type: "Online" },
  { title: "Family Introduction Event", date: "August 25, 2026", location: "Mumbai", type: "Physical" }
];

const testimonials = [
  { 
    name: "Mr. Deshpande", 
    relation: "Groom's Father",
    text: "Very helpful in finding a match for our son. Extremely professional service.",
    rating: 5
  },
  { 
    name: "Mrs. Joshi", 
    relation: "Bride's Mother",
    text: "Privacy and security were carefully considered. Thank you.",
    rating: 5
  }
];

export default function Main() {
  const [currentStory, setCurrentStory] = useState(0);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [activeTab, setActiveTab] = useState("success");

  return (
    <main className="w-full bg-[#fdf8ee]">
      {/* HERO: full hero always (images, animations, text, points). The
          right-side card shows the login form before login, search after. */}
      <Carousel />

      {/* Accepted-profiles count (logged-in only) */}
      <AcceptedSection />

      {/* ---------------- WELCOME & ABOUT SECTION (NEW) ---------------- */}
      <section className="w-full mx-auto">
        <div className="bg-[#fdf3da] rounded-xl border border-[#f0e4c8] p-8 lg:p-12 shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-12 bg-[#f0b429]" />
            <h2 className="text-3xl font-bold text-[#3a0613] text-center">Trusted Service for Our Community</h2>
            <span className="h-px w-12 bg-[#f0b429]" />
          </div>
          
          <p className="text-center text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
            Choosing a life partner is one of the most important decisions in our lives. 
            <span className="font-bold text-[#7a1224]"> BABA LAGIN Matrimonial Center </span> 
            has been providing trusted services to the Marathi community for over 15+ years. 
            We are a reputed <span className="font-bold text-[#7a1224]">matrimonial matchmaking center</span> 
            and one of the leading marriage institutions in Maharashtra. 
            Our goal is simple - to help Marathi families find the right match through a safe, 
            reliable, and professional platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {communityStats.map((stat, i) => (
              <div key={i} className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all border border-[#f0e4c8]">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-[#7a1224]">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <WhatMakesUsDifferent/>

      <HowItWorks/>
      
    </main>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-4 text-white">
      <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-[#f0b429]/50 flex items-center justify-center text-[#f0b429] shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#f0b429]">{value}</p>
        <p className="text-xs text-gray-300">{label}</p>
      </div>
    </div>
  );
}