"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-rose-400 uppercase">
          FoodValy
        </p>
        <h1 className="text-2xl font-black text-slate-900 mt-3">
          Something went wrong
        </h1>
        <p className="text-slate-500 mt-3">
          We hit an unexpected issue. You can try reloading this section or
          return to the home page.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 rounded-2xl bg-slate-900 text-white py-3 font-semibold"
          >
            Try again
          </button>
          <Link
            href="/"
            className="flex-1 rounded-2xl border border-slate-200 py-3 font-semibold text-slate-700"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
