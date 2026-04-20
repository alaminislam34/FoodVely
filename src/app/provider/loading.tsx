export default function ProviderLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="mt-3 text-sm font-semibold text-slate-600">
          Loading provider dashboard...
        </p>
      </div>
    </div>
  );
}
