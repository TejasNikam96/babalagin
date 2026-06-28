import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ShieldCheck,
  BadgeCheck,
  Users,
  Headphones,
  Heart,
} from "lucide-react";

const quickLinks = [
  "Home",
  "Find Bride",
  "Find Groom",
  "Profile Login",
  "Member Registration",
  "About Us",
  "Success Stories",
  "Contact Us",
];

const services = [
  "Bride-Groom Matching",
  "Kundli Matching",
  "Family Counseling",
  "Marriage Guidance",
  "Premium Services",
];

const usefulInfo = [
  "Membership Plans",
  "Privacy Policy",
  "Terms & Conditions",
  "Refund Policy",
  "Security",
  "Help Center",
];

const trustBadges = [
  {
    icon: ShieldCheck,
    title: "100% Secure",
    subtitle: "Your Information is Safe",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Service",
    subtitle: "10+ Years of Experience",
  },
  {
    icon: Users,
    title: "Thousands of Success",
    subtitle: "Happy Families",
  },
  {
    icon: Headphones,
    title: "Expert Guidance",
    subtitle: "Family Counselors",
  },
];

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.91h-2.33V22c4.78-.78 8.44-4.94 8.44-9.94z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-1.27.06-2.15.26-2.91.56a5.87 5.87 0 0 0-2.13 1.39A5.87 5.87 0 0 0 .62 4.14c-.3.76-.5 1.64-.56 2.91C0 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.78.71 1.44 1.39 2.13.69.68 1.35 1.09 2.13 1.39.76.3 1.64.5 2.91.56C8.33 24 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.87 5.87 0 0 0 2.13-1.39 5.87 5.87 0 0 0 1.39-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.87 5.87 0 0 0-1.39-2.13A5.87 5.87 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0z" />
    <path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zM19.85 5.6a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.6 15.5v-7l6.27 3.5z" />
  </svg>
);

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.1h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.82c0 4.55-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.13-.16.25-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28z" />
  </svg>
);

const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="text-[#f0b429] font-bold text-xl mb-6">{title}</h3>
    <ul className="space-y-3.5">
      {links.map((link) => (
        <li key={link}>
          <a
            href="#"
            className="flex items-center gap-2 text-[#e8d9d4] hover:text-[#f0b429] transition-colors text-[15px]"
          >
            <ChevronRight size={16} className="text-[#f0b429] shrink-0" />
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-[#3a0613] pt-16">
      {/* divider heart at top */}
      <div className="flex items-center justify-center -mt-px mb-12">
        <div className="h-px w-full bg-[#f0b429]/20" />
        <Heart
          size={20}
          className="text-[#f0b429] mx-3 shrink-0 fill-[#f0b429]/20"
        />
        <div className="h-px w-full bg-[#f0b429]/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.1fr] gap-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 64 64"
                  className="w-12 h-12 text-[#f0b429]"
                  fill="currentColor"
                >
                  <path d="M32 56s-20-12.5-20-28C12 18 18 12 26 12c3.6 0 6 1.6 6 1.6S34.4 12 38 12c8 0 14 6 14 16 0 15.5-20 28-20 28z" />
                </svg>
              </div>
              <div className="leading-tight">
                <p className="text-[#f0b429] font-bold text-2xl">BABA LAGIN</p>
                <p className="text-[#f0b429] font-bold text-2xl -mt-1">
                  Vadhuvar Kendra
                </p>
              </div>
            </div>
            <p className="text-[#c9b8b2] text-[15px] leading-relaxed mb-4">
              A Trusted Marriage Organization
              <br />for the Marathi Community
            </p>
            <p className="text-[#c9b8b2] text-[15px] leading-relaxed mb-6">
              We make life's most important decision easier, secure, and
              trustworthy.
            </p>
            <div className="flex items-center gap-3">
              {[FacebookIcon, InstagramIcon, WhatsAppIcon, YoutubeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social link"
                  className="w-10 h-10 rounded-full border border-[#f0b429]/40 flex items-center justify-center text-[#f0b429] hover:bg-[#f0b429] hover:text-[#3a0613] transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Services" links={services} />
          <FooterColumn title="Useful Info" links={usefulInfo} />

          {/* Contact card */}
          <div className="bg-[#4a0a1c] rounded-xl p-6 h-fit">
            <h3 className="text-[#f0b429] font-bold text-xl mb-5">
              Contact Us
            </h3>
            <div className="space-y-4 mb-5">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[#f0b429] mt-0.5 shrink-0" />
                <span className="text-[#e8d9d4] text-[15px]">
                  +91 12345 67890
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[#f0b429] mt-0.5 shrink-0" />
                <span className="text-[#e8d9d4] text-[15px]">
                  info@shubhvivaah.com
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#f0b429] mt-0.5 shrink-0" />
                <span className="text-[#e8d9d4] text-[15px] leading-snug">
                  Pune, Maharashtra, India
                  <br />
                  411001
                </span>
              </div>
            </div>
            <div className="border-t border-[#f0b429]/20 pt-4">
              <p className="text-[#f0b429] font-semibold text-sm mb-2">
                Working Hours:
              </p>
              <p className="text-[#e8d9d4] text-[15px] leading-relaxed">
                Mon - Sat: 10:00 AM - 7:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="border-t border-[#f0b429]/20 mt-14 pt-10 pb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6">
            {trustBadges.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-center gap-4">
                <Icon size={36} className="text-[#f0b429] shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[#f1e9e7] font-semibold text-[15px]">
                    {title}
                  </p>
                  <p className="text-[#c9b8b2] text-sm">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#f0b429]/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#c9b8b2]">
          <p>© 2024 BABA LAGIN Vadhuvar Kendra. All rights reserved.</p>
          <Heart size={18} className="text-[#f0b429] fill-[#f0b429]" />
          <p className="flex items-center gap-1.5">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> for
            Marathi Community
          </p>
        </div>
      </div>
    </footer>
  );
}