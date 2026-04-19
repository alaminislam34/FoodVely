"use client";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

export default function CustomerProfileSkeleton() {
  return (
    <div>
      {/* --- TOP HEADER SKELETON --- */}
      {/* Fixed height (h-64) ensures the page doesn't start at 0px height */}
      <div className="max-w-6xl mx-auto px-6 h-64 flex items-end pb-10">
        <div className="flex flex-col md:flex-row items-center gap-6 translate-y-16">
          {/* Profile Image Skeleton */}
          <div className="w-40 h-40 rounded-[3rem] border-8 border-white bg-slate-100/20 shadow-xl" />

          <div className="text-center md:text-left space-y-3 md:pb-4">
            {/* Name Skeleton */}
            <Skeleton className="h-10 w-48 md:w-64" />
            {/* Location Skeleton */}
            <Skeleton className="h-5 w-32 mx-auto md:mx-0" />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-6xl mx-auto px-6 mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side */}
        <div className="lg:col-span-8 space-y-10">
          {/* Active Order Skeleton */}
          <div className="bg-white/20 border border-rose-50 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-10 h-10 rounded-lg bg-rose-100" />
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-rose-50/30 p-6 rounded-3xl border border-rose-100">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl bg-white/20" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24 bg-rose-200" />
                </div>
              </div>
              <Skeleton className="h-12 w-40 rounded-2xl bg-rose-200" />
            </div>
          </div>

          {/* Favorites Grid Skeleton */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-10 h-10 rounded-lg bg-rose-100" />
              <Skeleton className="h-8 w-36" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white/20 p-6 rounded-3xl border border-rose-50 flex flex-col items-center gap-3"
                >
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>

          {/* Order History Skeleton */}
          <div className="pb-10">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-10 h-10 rounded-lg bg-rose-100" />
              <Skeleton className="h-8 w-44" />
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex justify-between p-5 bg-white/20 border border-rose-50 rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-6" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="backdrop-blur-xl bg-white/20 border border-rose-100 rounded-[2.5rem] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <Skeleton className="h-7 w-24 bg-rose-200" />
              <Skeleton className="h-6 w-12 rounded-full bg-rose-200" />
            </div>

            <div className="space-y-6 mb-8">
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="w-8 h-8 rounded-md" />
                </div>
              ))}
            </div>

            <div className="border-t border-rose-100 pt-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>

            <Skeleton className="w-full h-14 mt-8 rounded-2xl bg-linear-to-r from-rose-200 to-orange-200" />
          </div>

          {/* Payment Method Skeleton */}
          <div className="bg-white/20 border border-rose-50 rounded-4xl p-6">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Skeleton className="w-6 h-6 rounded-md" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
