import { Award, ShieldCheck, Heart } from "lucide-react";

const diffCards = [
  { icon: Award, title: "Genuine profiles", desc: "Contact genuine profiles with 100% verified details" },
  { icon: ShieldCheck, title: "Most trusted", desc: "27+ years as the most trusted maratha matrimony platform" },
  { icon: Heart, title: "30,000+ weddings", desc: "Thousands of people have found their life partners through us" },
];

export default function WhatMakesUsDifferent() {
  return (
    <section className="relative">
      {/* Maroon gradient background (no external images) */}
      <div className="relative pt-20 pb-32 px-4 bg-gradient-to-br from-[#3a0613] via-[#5c0a1e] to-[#7a1224]">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-base md:text-lg font-semibold mb-2">
            <span className="text-[#f0b429]">BEST</span>{" "}
            <span className="text-[#f0b429]/80 tracking-wide">MARATHA MATRIMONY</span>
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#1de9a8] to-[#29b6f6] bg-clip-text text-transparent">
            What Makes Us Different
          </h2>
          <p className="text-white/90 text-sm md:text-base leading-relaxed">
            Most popular &amp; trusted marriage bureau only for maratha caste having profiles from
            all over nearby states, maharashtra &amp; abroad.
          </p>
        </div>
      </div>

      {/* Overlapping cards */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {diffCards.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-[#fbe9b8] flex items-center justify-center text-[#b5790a] mb-4">
                <Icon className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <h3 className="font-bold text-[#3a0613] mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Spacer so the next section isn't crowded by the overlap */}
      <div className="h-16 md:h-10" />
    </section>
  );
}