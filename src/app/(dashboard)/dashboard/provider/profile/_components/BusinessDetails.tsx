import { LayoutDashboard, Utensils, MapPin, Phone } from "lucide-react";

export default function BusinessDetails({
  isEditing,
  register,
  errors,
  formData,
}: any) {
  return (
    <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
      <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
          <LayoutDashboard size={20} />
        </div>
        Business Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Description & Cuisine */}
        <div className="space-y-6">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Description
            </label>
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  className={`w-full mt-3 p-4 bg-slate-50 border-2 rounded-2xl text-sm outline-none transition-all ${
                    errors?.description
                      ? "border-rose-500"
                      : "border-slate-100 focus:border-rose-500"
                  }`}
                  {...register("description")}
                  rows={4}
                  placeholder="Tell us about your restaurant..."
                />
                {errors?.description && (
                  <p className="text-xs text-rose-500 font-medium mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                {formData?.description || "No description provided."}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
              <Utensils size={22} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Cuisine
              </p>
              {isEditing ? (
                <input
                  {...register("cuisine")}
                  className="w-full mt-1 p-2 bg-transparent border-b border-slate-200 outline-none focus:border-rose-500 text-sm font-bold text-slate-900"
                />
              ) : (
                <p className="font-bold text-slate-900">
                  {formData?.cuisine || "Not Specified"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Location & Contact */}
        <div className="space-y-6">
          {isEditing ? (
            <>
              <div className="space-y-4">
                <EditItemInput
                  register={register}
                  name="address"
                  label="Address"
                  icon={MapPin}
                  error={errors?.address}
                />
                <EditItemInput
                  register={register}
                  name="contactNumber"
                  label="Contact"
                  icon={Phone}
                  error={errors?.contactNumber}
                />
              </div>
            </>
          ) : (
            <>
              <DetailItem
                icon={MapPin}
                label="Location"
                value={formData?.address}
                color="text-emerald-500"
              />
              <DetailItem
                icon={Phone}
                label="Contact"
                value={formData?.contactNumber}
                color="text-blue-500"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ভিউ মোড এর জন্য ছোট কম্পোনেন্ট
function DetailItem({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
      <div className={`p-3 bg-white rounded-xl shadow-sm ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase">{label}</p>
        <p className="text-sm font-bold text-slate-800 mt-1">
          {value || "Not Set"}
        </p>
      </div>
    </div>
  );
}

// এডিট মোড এর ইনপুটের জন্য ছোট কম্পোনেন্ট
function EditItemInput({ register, name, label, icon: Icon, error }: any) {
  return (
    <div className="relative">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
        {label}
      </label>
      <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-rose-500 transition-all">
        <Icon size={18} className="text-slate-400" />
        <input
          {...register(name)}
          className="bg-transparent w-full outline-none text-sm font-bold text-slate-900"
        />
      </div>
      {error && (
        <p className="text-[10px] text-rose-500 mt-1 ml-2">{error.message}</p>
      )}
    </div>
  );
}
