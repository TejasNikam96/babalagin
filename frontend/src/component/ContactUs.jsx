import React, { useState } from "react";
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock3,
  MessageCircle,
  User,
  Tag,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";

/**
 * `Facebook` / `Instagram` icons were removed from newer lucide-react
 * versions, so these two are recreated locally in the same outline style
 * (24x24, currentColor stroke) to keep the social row visually consistent.
 */
function FacebookIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/**
 * ContactUs — "Contact Us" page for BABA LAGIN Vadhu-Var Kendra.
 *
 * Visual direction continues the brand language from Login.jsx (maroon +
 * gold + cream, heart motif, dashed accents) but takes a different shape:
 * a dark maroon "info" panel (phone / email / address / hours / socials)
 * paired with a light invitation-style form panel, rather than a single
 * centered card. Reads as one cohesive piece, not two unrelated halves.
 */

const SUBJECT_OPTIONS = [
  { value: "", label: "Select Subject" },
  { value: "general", label: "General Inquiry" },
  { value: "registration", label: "Registration Related" },
  { value: "complaint", label: "Complaint" },
  { value: "other", label: "Other" },
];

const CONTACT_ITEMS = [
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: MessageCircle, label: "WhatsApp", value: "+91 98765 43210" },
  { icon: Mail, label: "Email", value: "support@babalagin.in" },
  { icon: MapPin, label: "Office", value: "FC Road, Pune, Maharashtra 411005" },
  { icon: Clock3, label: "Office Hours", value: "Mon - Sat, 10:00 AM to 7:00 PM" },
];

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your full name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (!/^[0-9+\s-]{8,15}$/.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!values.subject) errors.subject = "Please select a subject.";
  if (!values.message.trim()) errors.message = "Please write your message.";
  return errors;
}

export default function ContactUs({ onSubmit }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("failed");
      if (onSubmit) await onSubmit(values);
      setSubmitted(true);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setValues({ name: "", email: "", phone: "", subject: "", message: "" });
    setErrors({});
    setSubmitted(false);
  }

  return (
    <div className="min-h-screen w-full bg-[#FBF3DC] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* ambient brand-color glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#5C1B2E] opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#D4A017] opacity-15 blur-3xl" />

      <div className="relative w-full max-w-5xl rounded-3xl shadow-xl border border-[#D4A017]/25 overflow-hidden grid lg:grid-cols-[0.95fr_1.25fr] bg-[#FFFDF7]">
        {/* ===== Left: info panel ===== */}
        <div className="relative bg-gradient-to-br from-[#3F0E1C] to-[#7A2238] text-white p-9 sm:p-10 overflow-hidden">
          <Heart
            className="absolute -right-8 -top-8 w-44 h-44 text-white opacity-[0.06] rotate-12"
            fill="currentColor"
          />
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#E8C547]">
            Contact Us
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold leading-snug">
            Get in Touch
          </h1>
          <p className="mt-3 text-sm text-white/75 leading-relaxed max-w-xs">
            Have questions about finding your perfect match? Our team is always ready to help you.
          </p>

          <div className="flex items-center gap-3 my-7">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4A017]/70" />
            <Heart className="w-3.5 h-3.5 text-[#E8C547]" fill="#E8C547" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4A017]/70" />
          </div>

          <ul className="space-y-5">
            {CONTACT_ITEMS.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-white/10 ring-1 ring-[#D4A017]/40">
                  <Icon className="w-4 h-4 text-[#E8C547]" />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-wide text-white/55">
                    {label}
                  </span>
                  <span className="block text-sm font-medium text-white/95">{value}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-3">
            {[FacebookIcon, InstagramIcon, MessageCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Connect with us on social media"
                className="grid place-items-center w-9 h-9 rounded-full bg-white/10 ring-1 ring-[#D4A017]/40 text-white/85 hover:bg-[#D4A017] hover:text-[#3F0E1C] hover:-translate-y-0.5 transition"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* ===== Right: form panel ===== */}
        <div className="p-8 sm:p-10">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="grid place-items-center w-16 h-16 rounded-full bg-[#3F0E1C]/8 mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#7A2238]" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#3F0E1C]">Thank You!</h2>
              <p className="mt-2 text-sm text-[#6B4A52] max-w-xs">
                Your message has been received. Our team will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-6 text-sm font-semibold text-[#7A2238] underline-offset-4 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-2xl font-bold text-[#3F0E1C]">Send a Message</h2>
              <p className="mt-1.5 text-sm text-[#6B4A52]">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <Field
                    id="name"
                    label="Full Name"
                    icon={User}
                    error={errors.name}
                  >
                    <input
                      id="name"
                      type="text"
                      value={values.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                      className={inputClass(errors.name)}
                    />
                  </Field>

                  {/* Phone */}
                  <Field
                    id="phone"
                    label="Phone Number"
                    icon={Phone}
                    error={errors.phone}
                  >
                    <input
                      id="phone"
                      type="tel"
                      value={values.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      className={inputClass(errors.phone)}
                    />
                  </Field>
                </div>

                {/* Email */}
                <Field id="email" label="Email Address" icon={Mail} error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className={inputClass(errors.email)}
                  />
                </Field>

                {/* Subject */}
                <Field id="subject" label="Subject" icon={Tag} error={errors.subject}>
                  <select
                    id="subject"
                    value={values.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className={`${inputClass(errors.subject)} appearance-none`}
                  >
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Message */}
                <Field id="message" label="Message" icon={MessageSquare} error={errors.message}>
                  <textarea
                    id="message"
                    rows={4}
                    value={values.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Write your message here..."
                    className={`${inputClass(errors.message)} resize-none pt-2.5`}
                  />
                </Field>

                {errors.form && (
                  <p role="alert" className="text-sm text-[#7A2238]">
                    {errors.form}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5C1B2E] to-[#7A2238] py-3 font-semibold text-white tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:hover:translate-y-0 transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- small field wrapper to keep label / icon / error consistent ---- */
function Field({ id, label, icon: Icon, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#3F0E1C] mb-1.5">
        {label} <span className="text-[#7A2238]">*</span>
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-3.5 w-4.5 h-4.5 text-[#B8860B] pointer-events-none" />
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-[#7A2238]">{error}</p>}
    </div>
  );
}

function inputClass(hasError) {
  return `w-full pl-10 pr-3 py-2.5 rounded-lg border bg-white text-[#3F0E1C] placeholder:text-[#B59A9F] focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition ${
    hasError ? "border-[#7A2238]/60" : "border-[#D4A017]/30 focus:border-[#D4A017]"
  }`;
}