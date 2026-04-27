"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ProviderError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Provider route error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-orange-100 rounded-3xl p-8 shadow-xl text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-orange-500 uppercase">
          Provider Panel
        </p>
        <h1 className="text-2xl font-black text-slate-900 mt-3">
          Provider page failed to load
        </h1>
        <p className="text-slate-500 mt-3">
          We could not load this provider section. Please try again.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 rounded-2xl bg-orange-500 text-white py-3 font-semibold"
          >
            Try again
          </button>
          <Link
            href="/dashboard/provider"
            className="flex-1 rounded-2xl border border-slate-200 py-3 font-semibold text-slate-700"
          >
            Provider Home
          </Link>
        </div>
      </div>
    </div>
  );
}
