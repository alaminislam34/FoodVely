import { Globe, Clock, AlertCircle, ExternalLink } from "lucide-react";

interface SidebarProps {
  slug: string;
  completion: number;
  openingHours: string;
}

export default function SidebarCards({
  slug,
  completion,
  openingHours,
}: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* Live Storefront Card */}
      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl group-hover:bg-rose-500/40 transition-all" />

        <h3 className="text-2xl font-black mb-1">Live Storefront</h3>
        <p className="text-slate-400 text-sm font-medium mb-8 flex items-center gap-2">
          <Globe size={14} /> foodvally.com/{slug}
        </p>

        <button
          onClick={() => window.open(`/restaurant/${slug}`, "_blank")}
          className="w-full flex items-center justify-between bg-white text-slate-900 p-5 rounded-2xl font-black hover:scale-[1.02] transition-all active:scale-95 shadow-xl"
        >
          <span>View Public Store</span>
          <div className="bg-slate-900 text-white p-1.5 rounded-xl">
            <ExternalLink size={18} />
          </div>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Timing Card */}
        <div className="bg-emerald-500 p-6 rounded-[2rem] text-white shadow-lg shadow-emerald-100">
          <Clock size={24} className="mb-4 opacity-80" />
          <p className="text-xs font-bold uppercase opacity-80 tracking-wider">
            Timing
          </p>
          <p className="font-black truncate text-lg">
            {openingHours || "Always Open"}
          </p>
        </div>

        {/* Profile Health Card */}
        <div className="bg-amber-400 p-6 rounded-[2rem] text-slate-900 shadow-lg shadow-amber-100">
          <AlertCircle size={24} className="mb-4 opacity-80" />
          <p className="text-xs font-bold uppercase opacity-80 tracking-wider">
            Profile
          </p>
          <p className="font-black text-lg">{completion}% Complete</p>
        </div>
      </div>

      {/* Extra Tip Card */}
      <div className="bg-indigo-50 p-6 rounded-[2.5rem] border border-indigo-100">
        <p className="text-indigo-900 text-xs font-bold leading-relaxed italic">
          "Pro tip: Completing your profile with a high-quality cover image can
          increase customer trust by up to 40%."
        </p>
      </div>
    </div>
  );
}
