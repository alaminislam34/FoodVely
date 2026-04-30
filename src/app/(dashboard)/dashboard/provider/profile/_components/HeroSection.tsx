import { Camera, BadgeCheck, Star, ShoppingBag } from "lucide-react";
import { useRef, useState } from "react";

export default function HeroSection({
  providerData,
  setValue,
  completion,
  errors,
}: any) {
  const coverRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  // লোড হওয়ার সময় প্রিভিউ দেখানোর জন্য লোকাল স্টেট (Optional but good for UX)
  const [preview, setPreview] = useState({
    logo: providerData?.logo,
    coverImage: providerData?.coverImage,
  });

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "coverImage",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // React Hook Form এ ফাইল অবজেক্ট সেট করা
      setValue(`${type}File`, file, { shouldDirty: true });

      // UI তে সাথে সাথে প্রিভিউ দেখানোর জন্য
      const objectUrl = URL.createObjectURL(file);
      setPreview((prev) => ({ ...prev, [type]: objectUrl }));
    }
  };

  if (!providerData) return null;

  return (
    <div className="relative mb-24">
      <input
        type="file"
        hidden
        ref={coverRef}
        onChange={(e) => handleFile(e, "coverImage")}
        accept="image/*"
      />
      <input
        type="file"
        hidden
        ref={logoRef}
        onChange={(e) => handleFile(e, "logo")}
        accept="image/*"
      />

      {/* Cover Image */}
      <div className="h-64 md:h-100 w-full rounded-[2.5rem] overflow-hidden relative shadow-2xl bg-slate-200">
        <img
          src={preview.coverImage}
          className="w-full h-full object-cover"
          alt="Banner"
        />
        {
          /* Overlay & Edit Button */
          errors.coverImageFile && (
            <div className="absolute inset-0 bg-red-100/80 flex items-center justify-center rounded-[2.5rem]">
              <p className="text-sm text-rose-500">
                {errors.coverImageFile.message as string}
              </p>
            </div>
          )
        }
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        <button
          type="button"
          onClick={() => coverRef.current?.click()}
          className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl border border-white/30 hover:bg-white/40"
        >
          <Camera size={20} />
        </button>

        {/* Quality Meter */}
        <div className="absolute bottom-6 right-8 hidden md:block bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 text-white w-48">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span>Profile Quality</span>
            <span>{completion}%</span>
          </div>
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Logo & Basic Info */}
      <div className="absolute -bottom-16 left-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
        <div className="relative group">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2rem] border-10 border-white bg-white shadow-2xl overflow-hidden">
            <img
              src={preview.logo || "/placeholder-logo.jpg"}
              className="w-full h-full object-cover"
              alt="Logo"
            />
            {
              /* Error Overlay */
              errors.logoFile && (
                <div className="absolute inset-0 bg-red-100/80 flex items-center justify-center rounded-[2rem]">
                  <p className="text-sm text-rose-500">
                    {errors.logoFile.message as string}
                  </p>
                </div>
              )
            }
          </div>
          <button
            type="button"
            onClick={() => logoRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-[2rem] text-white"
          >
            <Camera size={28} />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-4xl font-black text-slate-900 drop-shadow-sm">
              {providerData.restaurantName}
            </h1>
            {providerData.isVerified && (
              <BadgeCheck size={28} className="text-blue-500" fill="white" />
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 font-bold text-sm text-slate-500 justify-center md:justify-start">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-slate-900 rounded-xl">
              <Star size={14} fill="currentColor" /> {providerData.rating || 0}
            </span>
            <span className="flex items-center gap-1">
              <ShoppingBag size={14} /> {providerData.totalOrders || 0} Orders
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
