import React from "react";

/** Shimmer placeholder cards shown while profile lists load. */
export default function SkeletonCards({ count = 6 }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-amber-100 shadow-sm p-4">
            <div className="flex gap-4">
              <div className="w-24 h-28 rounded-lg bg-gray-200 sk-shimmer" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-2/3 rounded bg-gray-200 sk-shimmer" />
                <div className="h-3 w-1/3 rounded bg-gray-200 sk-shimmer" />
                <div className="h-3 w-1/2 rounded bg-gray-200 sk-shimmer" />
                <div className="h-3 w-1/2 rounded bg-gray-200 sk-shimmer" />
                <div className="h-3 w-2/5 rounded bg-gray-200 sk-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`.sk-shimmer{background:linear-gradient(90deg,#eee 25%,#f5f5f5 37%,#eee 63%);background-size:400% 100%;animation:sksh 1.2s ease-in-out infinite}@keyframes sksh{0%{background-position:100% 50%}100%{background-position:0 50%}}`}</style>
    </>
  );
}
