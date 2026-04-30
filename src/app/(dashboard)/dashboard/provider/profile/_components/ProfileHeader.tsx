import { Store, Settings, Save, Loader2 } from "lucide-react";

interface ProfileHeaderProps {
  isActive: boolean;
  isEditing: boolean;
  isLoading: boolean;
  setIsEditing: (value: boolean) => void;
}

export default function ProfileHeader({
  isActive,
  isEditing,
  isLoading,
  setIsEditing,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-rose-500 rounded-2xl text-white shadow-lg shadow-rose-200">
            <Store size={24} />
          </div>
          Manage Profile
        </h2>
        <p className="text-slate-500 font-medium ml-12">
          Optimize your restaurant's digital presence
        </p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Status Toggle */}
        <button
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all border ${
            isActive
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isActive ? "bg-emerald-500 animate-ping" : "bg-slate-400"
            }`}
          />
          {isActive ? "Accepting Orders" : "Store Closed"}
        </button>

        {/* Action Button (Edit/Save) */}

        {isEditing && (
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg ${
              isEditing
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50"
            }`}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Save size={18} /> Save Changes
              </>
            )}
          </button>
        )}
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg ${
              isEditing
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50"
            }`}
          >
            <>
              <Settings size={18} /> Edit Profile
            </>
          </button>
        )}
      </div>
    </div>
  );
}
