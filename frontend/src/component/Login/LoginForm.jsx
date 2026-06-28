import React, { useState, useEffect, useCallback } from "react";
import { Heart, Ticket, Mail, ShieldCheck, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../Slices/authSlice";

function generateCaptcha(length = 5) {
  const chars = "23456789"; // avoids ambiguous 0/1
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * The profile-login form (without any page/card wrapper) so it can be dropped
 * into the home hero's right-side card or the standalone /login page.
 */
export default function LoginForm({ onSubmit }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registrationId, setRegistrationId] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setRefreshing(true);
    setCaptcha(generateCaptcha());
    setVerificationCode("");
    setTimeout(() => setRefreshing(false), 350);
  }, []);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(null);

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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: registrationId.trim(), email: email.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(data);
        dispatch(loginSuccess({
          name: data.name,
          registrationCode: data.registrationCode,
          email: data.email,
          serverInstanceId: data.instanceId,
          token: data.token,
        }));
        if (onSubmit) await onSubmit({ registrationId, email, profile: data });
        setTimeout(() => navigate("/"), 1200);
      } else {
        let msg = "Invalid Registration ID or Email.";
        try {
          const body = await res.json();
          if (body && body.message) msg = body.message;
        } catch (_) { /* ignore */ }
        setError(msg);
        refreshCaptcha();
      }
    } catch (err) {
      setError("Something went wrong during login. Please try again.");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B8860B]">
        BABA LAGIN Vadhu-Var Kendra
      </p>
      <h1 className="mt-1 text-center font-serif text-2xl font-bold text-[#3F0E1C]">
        Profile Login
      </h1>
      <p className="mt-1 text-center text-sm text-[#6B4A52]">
        Login to access your profile.
      </p>

      <div className="flex items-center justify-center gap-3 my-4">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4A017]/60" />
        <Heart className="w-3.5 h-3.5 text-[#D4A017]" fill="#D4A017" />
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4A017]/60" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="registrationId" className="block text-sm font-semibold text-[#3F0E1C] mb-1.5">
            Your Registration ID <span className="text-[#7A2238]">*</span>
          </label>
          <div className="relative">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#B8860B]" />
            <input
              id="registrationId"
              type="text"
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value)}
              placeholder="e.g. REG00001"
              autoComplete="off"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#D4A017]/30 bg-white text-[#3F0E1C] placeholder:text-[#B59A9F] focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#D4A017] transition"
            />
          </div>
          <p className="mt-1.5 text-xs text-[#8A6F75]">
            Your Registration ID is shown after you submit the enroll form (e.g. REG00001)
          </p>
        </div>

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

        <div>
          <span className="block text-sm font-semibold text-[#3F0E1C] mb-1.5">Verification Code</span>
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

        {success && (
          <div role="status" className="rounded-lg bg-green-50 border border-green-300 px-3 py-2 text-sm text-green-800">
            Welcome{success.name ? `, ${success.name}` : ""}! Login successful.
            {success.registrationCode ? ` (ID: ${success.registrationCode})` : ""}
          </div>
        )}

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-lg bg-[#7A2238]/8 border border-[#7A2238]/25 px-3 py-2 text-sm text-[#7A2238]">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5C1B2E] to-[#7A2238] py-3 font-semibold text-white tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:hover:translate-y-0 transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </>
  );
}
