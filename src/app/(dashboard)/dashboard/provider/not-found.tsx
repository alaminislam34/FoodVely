import Link from "next/link";

export default function ProviderNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-orange-500 uppercase">
          Provider Panel
        </p>
        <h1 className="text-2xl font-black text-slate-900 mt-3">
          Provider page not found
        </h1>
        <p className="text-slate-500 mt-3">
          This provider route does not exist or has been moved.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/provider"
            className="flex-1 rounded-2xl bg-orange-500 text-white py-3 font-semibold"
          >
            Go to Provider Home
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-2xl border border-slate-200 py-3 font-semibold text-slate-700"
          >
            Site Home
          </Link>
        </div>
      </div>
    </div>
  );
}
