import React from "react";

/**
 * Renders a "Not Active" badge when a profile's isActive flag is "N".
 * Renders nothing otherwise. Used wherever profiles are displayed.
 */
export default function NotActiveTag({ isActive, className = "" }) {
  if (isActive !== "N") return null;
  return (
    <span
      className={`inline-flex items-center gap-1 bg-gray-200 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-300 ${className}`}
      title="This profile is currently inactive"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Not Active
    </span>
  );
}
