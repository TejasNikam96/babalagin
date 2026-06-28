import React from "react";
import { Heart } from "lucide-react";
import LoginForm from "./LoginForm";

/**
 * Standalone /login page: the profile login form on the maroon hero theme.
 * (The home page shows the same form inside the hero's right-side card.)
 */
export default function Login({ onSubmit }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#3a0613] via-[#5c0a1e] to-[#7a1224] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#f0b429] opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#f0b429] opacity-10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-2 border-dashed border-[#D4A017]/50" />
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#7A2238] to-[#3F0E1C] ring-4 ring-[#FBF3DC] shadow-lg flex items-center justify-center">
          <Heart className="w-8 h-8 text-[#E8C547]" strokeWidth={2} fill="#E8C547" />
        </div>

        <div className="bg-[#fdf3da] rounded-2xl shadow-2xl border border-[#f0e4c8] pt-14 pb-9 px-6 sm:px-9">
          <LoginForm onSubmit={onSubmit} />
        </div>

        <p className="mt-6 text-center text-xs text-[#e7d3a8]">
          © BABA LAGIN Vadhu-Var Kendra — Trusted Matrimonial Service for the Marathi Community
        </p>
      </div>
    </div>
  );
}
