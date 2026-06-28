import React, { useState, useEffect, useCallback } from "react";
import { Heart, Ticket, Mail, ShieldCheck, RefreshCw, Loader2, AlertCircle, RotateCcw, Calendar } from "lucide-react";

function generateCaptcha(length = 5) {
  const chars = "23456789"; // avoids ambiguous 0/1
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function Renewal({ onSubmit }) {
  const [registrationId, setRegistrationId] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [renewalPeriod, setRenewalPeriod] = useState("6"); // months

  const refreshCaptcha = useCallback(() => {
    setRefreshing(true);
    setCaptcha(generateCaptcha());
    setVerificationCode("");
    setTimeout(() => setRefreshing(false), 350);
  }, []);

  // regenerate once on mount so it differs per session
  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!registrationId.trim() || !email.trim() || !verificationCode.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (verificationCode.trim().toUpperCase() !== captcha) {
      setError("Verification code does not match. Please try again.");
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit({ registrationId, email, renewalPeriod });
      } else {
        await new Promise((res) => setTimeout(res, 900)); // demo only
      }
    } catch (err) {
      setError("Something went wrong during renewal. Please try again.");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FBF3DC] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* ambient brand-color glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#5C1B2E] opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#D4A017] opacity-15 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* dashed halo behind the seal */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-2 border-dashed border-[#D4A017]/50" />
        {/* wax-seal medallion - Renewal themed */}
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#D4A017] to-[#B8860B] ring-4 ring-[#FBF3DC] shadow-lg flex items-center justify-center">
          <RotateCcw className="w-8 h-8 text-white" strokeWidth={2} />
        </div>

        {/* card */}
        <div className="bg-[#FFFDF7] rounded-2xl shadow-xl border border-[#D4A017]/25 pt-14 pb-9 px-6 sm:px-9">
          <p className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B8860B]">
            BABA LAGIN Vadhu-Var Kendra
          </p>
          <h1 className="mt-2 text-center font-serif text-3xl font-bold text-[#3F0E1C]">
            Profile Renewal
          </h1>
          <p className="mt-2 text-center text-sm text-[#6B4A52]">
            Restart your profile and begin a new journey.
          </p>
          <p className="mt-1 text-center text-xs text-[#D4A017] font-medium">
            <RotateCcw className="inline w-3 h-3 mr-1" />
            Restart your journey
          </p>

          {/* divider */}
          <div className="flex items-center justify-center gap-3 my-6">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4A017]/60" />
            <RotateCcw className="w-3.5 h-3.5 text-[#D4A017]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4A017]/60" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Registration ID */}
            <div>
              <label
                htmlFor="registrationId"
                className="block text-sm font-semibold text-[#3F0E1C] mb-1.5"
              >
                Your Registration ID <span className="text-[#7A2238]">*</span>
              </label>
              <div className="relative">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#B8860B]" />
                <input
                  id="registrationId"
                  type="text"
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                  placeholder="e.g. MB12346"
                  autoComplete="off"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#D4A017]/30 bg-white text-[#3F0E1C] placeholder:text-[#B59A9F] focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#D4A017] transition"
                />
              </div>
              <p className="mt-1.5 text-xs text-[#8A6F75]">
                (e.g: MB12346, MG12347, MBD12348, MGD12349)
              </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#3F0E1C] mb-1.5">
                Your Email Address <span className="text-[#7A2238]">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#B8860B]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#D4A017]/30 bg-white text-[#3F0E1C] placeholder:text-[#B59A9F] focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#D4A017] transition"
                />
              </div>
            </div>

            {/* Renewal Period Selection */}
            <div>
              <label htmlFor="renewalPeriod" className="block text-sm font-semibold text-[#3F0E1C] mb-1.5">
                Renewal Period <span className="text-[#7A2238]">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#B8860B]" />
                <select
                  id="renewalPeriod"
                  value={renewalPeriod}
                  onChange={(e) => setRenewalPeriod(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-[#D4A017]/30 bg-white text-[#3F0E1C] focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#D4A017] transition appearance-none"
                >
                  <option value="3">3 Months (₹599)</option>
                  <option value="6" selected>6 Months (₹999) — Best Value</option>
                  <option value="12">12 Months (₹1499)</option>
                  <option value="24">24 Months (₹2499)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#B8860B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-[#8A6F75]">
                Renew your profile and continue your journey to find the perfect match.
              </p>
            </div>

            {/* Captcha */}
            <div>
              <span className="block text-sm font-semibold text-[#3F0E1C] mb-1.5">
                Verification Code
              </span>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 select-none overflow-hidden rounded-lg border-2 border-dashed border-[#D4A017]/50 bg-[#FBF3DC] py-2.5 text-center">
                  <span className="font-mono text-xl font-bold tracking-[0.35em] text-[#3F0E1C] -rotate-1 inline-block">
                    {captcha}
                  </span>
                  <span className="absolute left-0 top-1/3 w-full h-px bg-[#3F0E1C]/25 -rotate-3" />
                  <span className="absolute left-0 top-2/3 w-full h-px bg-[#3F0E1C]/15 rotate-2" />
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  aria-label="Get new code"
                  className="shrink-0 grid place-items-center w-11 h-11 rounded-lg border border-[#D4A017]/40 bg-white text-[#7A2238] hover:bg-[#FBF3DC] focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition"
                >
                  <RefreshCw className={`w-4.5 h-4.5 transition-transform duration-500 ${refreshing ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {/* Verification code input */}
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-semibold text-[#3F0E1C] mb-1.5">
                Enter the code above <span className="text-[#7A2238]">*</span>
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#B8860B]" />
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter the code above"
                  autoComplete="off"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#D4A017]/30 bg-white text-[#3F0E1C] placeholder:text-[#B59A9F] focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#D4A017] transition"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg bg-[#7A2238]/8 border border-[#7A2238]/25 px-3 py-2 text-sm text-[#7A2238]"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#D4A017] to-[#B8860B] py-3 font-semibold text-white tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:hover:translate-y-0 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Renewing...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4.5 h-4.5" />
                  Renew Now
                </>
              )}
            </button>

            {/* Additional Info */}
            <div className="mt-4 p-3 rounded-lg bg-[#FBF3DC] border border-[#D4A017]/20">
              <p className="text-xs text-[#6B4A52] flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#D4A017]" />
                <span>
                  <strong>After renewal,</strong> your profile will be reactivated and 
                  you can continue your journey to find a new partner.
                </span>
              </p>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#8A6F75]">
          © BABA LAGIN Vadhu-Var Kendra — Trusted Matrimonial Service for the Marathi Community
        </p>
      </div>
    </div>
  );
}