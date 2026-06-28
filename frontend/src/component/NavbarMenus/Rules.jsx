import React, { useState } from "react";

// Icons (using your existing icon style)
const CheckCircleIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertCircleIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const UsersIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const LockIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const FileTextIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const HomeIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ruleCategories = [
  {
    title: "Registration Rules",
    icon: FileTextIcon,
    rules: [
      "All members must provide genuine and accurate information.",
      "A valid mobile number and email ID are required when creating a profile.",
      "One person creating multiple profiles is strictly prohibited.",
      "Profile information must be kept regularly updated."
    ]
  },
  {
    title: "Terms of Use",
    icon: UsersIcon,
    rules: [
      "The matrimonial platform may only be used for marriage purposes.",
      "Sharing any obscene, offensive, or inappropriate content is prohibited.",
      "Communication with other members must be respectful and courteous.",
      "Using the platform for commercial or promotional purposes is not allowed."
    ]
  },
  {
    title: "Privacy Policy",
    icon: LockIcon,
    rules: [
      "Members' personal information is kept completely confidential.",
      "Sharing other members' information without their consent is prohibited.",
      "Protecting every member's personal information is our primary responsibility.",
      "Legal action will be taken for any privacy violations."
    ]
  },
  {
    title: "Code of Conduct",
    icon: AlertCircleIcon,
    rules: [
      "All members must adhere to our code of conduct.",
      "Harassment, threats, or inappropriate behavior by any member will not be tolerated.",
      "Honesty must be maintained while providing any marriage-related information.",
      "Any complaints submitted to our team are taken seriously and addressed promptly."
    ]
  }
];

export default function Rules() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section className="w-full bg-[#fdf8ee] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 bg-[#f0b429]" />
            <div className="w-12 h-12 rounded-full bg-[#7a1224]/10 flex items-center justify-center">
              <FileTextIcon className="w-6 h-6 text-[#7a1224]" />
            </div>
            <span className="h-px w-12 bg-[#f0b429]" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#3a0613]">
            <span className="text-[#f0b429]">Rules</span> and Conditions
          </h2>
          <p className="mt-3 text-gray-600 text-lg max-w-3xl mx-auto">
            Following the rules of BABA LAGIN Vadhu-Var Kendra is mandatory for all members.
            These rules are for the safety and respect of everyone.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {ruleCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
                activeCategory === index
                  ? "bg-[#7a1224] text-white shadow-lg"
                  : "bg-white text-[#3a0613] border border-[#d8c39a] hover:bg-[#fdf3da]"
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.title}</span>
            </button>
          ))}
        </div>

        {/* Rules Display */}
        <div className="bg-white rounded-xl shadow-lg border border-[#f0e4c8] overflow-hidden">
          <div className="bg-gradient-to-r from-[#7a1224] to-[#5c0e1c] px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#f0b429]">
              {ruleCategories[activeCategory].icon({ className: "w-5 h-5" })}
            </div>
            <h3 className="text-white font-bold text-xl">
              {ruleCategories[activeCategory].title}
            </h3>
          </div>

          <div className="p-6 lg:p-8">
            <ul className="space-y-4">
              {ruleCategories[activeCategory].rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <div className="mt-1 min-w-[24px]">
                    <div className="w-6 h-6 rounded-full bg-[#f0b429]/10 flex items-center justify-center group-hover:bg-[#f0b429]/20 transition-all">
                      <CheckCircleIcon className="w-4 h-4 text-[#f0b429]" />
                    </div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">{rule}</p>
                </li>
              ))}
            </ul>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-[#fdf3da] rounded-lg border border-[#f0e4c8]">
              <div className="flex items-start gap-3">
                <AlertCircleIcon className="w-5 h-5 text-[#f0b429] mt-1" />
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-[#7a1224]">Important:</span> Violation of these rules will result in membership termination.
                    Please carefully follow all rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setActiveCategory(Math.max(0, activeCategory - 1))}
            disabled={activeCategory === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeCategory === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#7a1224] hover:bg-[#fdf3da]"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {ruleCategories.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeCategory === index
                    ? "bg-[#f0b429] w-8"
                    : "bg-[#d8c39a] hover:bg-[#c4b086]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveCategory(Math.min(ruleCategories.length - 1, activeCategory + 1))}
            disabled={activeCategory === ruleCategories.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeCategory === ruleCategories.length - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#7a1224] hover:bg-[#fdf3da]"
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Last Updated: January 1, 2026 | 
            <a href="#" className="text-[#7a1224] hover:underline ml-1">Read Full Terms</a>
          </p>
        </div>
      </div>
    </section>
  );
}

// Helper Icons (reusing from your Main component)
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