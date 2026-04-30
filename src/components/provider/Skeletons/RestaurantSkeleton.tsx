const RestaurantSkeleton = () => (
  <div className="animate-pulse max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-10">
      <div className="h-10 w-64 bg-slate-200 rounded-2xl" />
      <div className="flex gap-4">
        <div className="h-12 w-32 bg-slate-200 rounded-2xl" />
        <div className="h-12 w-32 bg-slate-200 rounded-2xl" />
      </div>
    </div>
    <div className="h-100 w-full bg-slate-200 rounded-[2.5rem] mb-16" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-100 bg-slate-100 rounded-[3rem]" />
      <div className="space-y-6">
        <div className="h-64 bg-slate-900 rounded-[3rem]" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-slate-200 rounded-[2rem]" />
          <div className="h-32 bg-slate-200 rounded-[2rem]" />
        </div>
      </div>
    </div>
  </div>
);

export default RestaurantSkeleton;
