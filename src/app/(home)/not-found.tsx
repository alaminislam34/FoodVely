import Link from "next/link";

export default function HomeNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-rose-400 uppercase">
          FoodVely
        </p>
        <h1 className="text-2xl font-black text-slate-900 mt-3">
          Page not found
        </h1>
        <p className="text-slate-500 mt-3">
          We could not find this page. Try exploring our menu or products.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/menu"
            className="flex-1 rounded-2xl bg-rose-500 text-white py-3 font-semibold"
          >
            Browse Menu
          </Link>
          <Link
            href="/products"
            className="flex-1 rounded-2xl border border-slate-200 py-3 font-semibold text-slate-700"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}
