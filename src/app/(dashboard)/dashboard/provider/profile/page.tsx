"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  CheckCircle,
  Utensils,
  ShoppingBag,
  Info,
  Camera,
  Globe,
  Settings,
  Store,
  X,
  Save,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/hooks/useAuth";

// --- Skeleton Component ---
const RestaurantSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-8 w-48 bg-gray-200 rounded-lg" />
      <div className="h-10 w-32 bg-gray-200 rounded-xl" />
    </div>
    <div className="h-56 md:h-80 w-full bg-gray-200 rounded-4xl mb-16" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-64 bg-gray-100 rounded-4xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-3xl" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-40 bg-gray-100 rounded-4xl" />
        <div className="h-60 bg-gray-100 rounded-4xl" />
      </div>
    </div>
  </div>
);

export default function RestaurantProfile() {
  const { providerRestaurant, providerRestaurantLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  console.log(providerRestaurant);
  // Sync provider data to local state for editing
  useEffect(() => {
    if (providerRestaurant) {
      setFormData(providerRestaurant);
    }
  }, [providerRestaurant]);

  if (providerRestaurantLoading || !formData) return <RestaurantSkeleton />;

  const handleToggleStatus = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
    toast.success(
      `Restaurant is now ${!formData.isActive ? "Open" : "Closed"}`,
      {
        icon: "🏪",
      },
    );
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "coverImage",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({
          ...prev,
          [type]: reader.result as string,
        }));
        toast.success(`${type === "logo" ? "Logo" : "Cover"} updated locally!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDetails = async () => {
    setIsEditing(false);
    // Logic to call your update API would go here
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="">
      <Toaster position="top-center" />

      <input
        type="file"
        hidden
        ref={coverInputRef}
        onChange={(e) => handleImageUpload(e, "coverImage")}
        accept="image/*"
      />
      <input
        type="file"
        hidden
        ref={logoInputRef}
        onChange={(e) => handleImageUpload(e, "logo")}
        accept="image/*"
      />

      {/* 1. Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Store className="text-rose-600" /> Restaurant Profile
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <span
              className={`w-2.5 h-2.5 rounded-full ${formData.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
            />
            <span className="text-sm font-bold text-gray-700">
              {formData.isActive ? "Open" : "Closed"}
            </span>
            <button
              onClick={handleToggleStatus}
              className="ml-2 text-xs text-rose-600 hover:underline font-bold"
            >
              Toggle
            </button>
          </div>
          <button
            onClick={() =>
              isEditing ? handleSaveDetails() : setIsEditing(true)
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${isEditing ? "bg-green-600" : "bg-rose-600"} text-white`}
          >
            {isEditing ? (
              <>
                <Save size={16} /> Save
              </>
            ) : (
              <>
                <Settings size={16} /> Edit
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Banner Section */}
      <div className="relative group mb-16">
        <div className="h-56 md:h-80 w-full rounded-4xl overflow-hidden relative shadow-lg bg-gray-200">
          <img
            src={formData.restaurant.coverImage || "/placeholder-cover.jpg"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all"
          >
            <Camera size={18} /> Update Cover
          </button>
        </div>

        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <div className="relative group/logo">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-4xl border-8 border-white bg-white shadow-2xl overflow-hidden">
              <img
                src={formData.restaurant.logo || "/placeholder-logo.jpg"}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => logoInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-4xl opacity-0 group-hover/logo:opacity-100"
            >
              <Camera size={24} className="text-white" />
            </button>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {formData.restaurant.restaurantName}
              </h1>
              {formData.isVerified && (
                <CheckCircle size={24} className="fill-blue-500 text-white" />
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 bg-black/20 backdrop-blur-sm p-1 px-3 rounded-lg w-fit">
              <span className="flex items-center gap-1 text-sm font-bold text-yellow-400">
                <Star size={16} className="fill-yellow-400" />{" "}
                {formData.restaurant.rating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            layout
            className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Info size={18} className="text-rose-500" /> Business Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      className="w-full mt-2 p-3 border rounded-xl text-sm"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-gray-700 text-sm mt-2">
                      {formData.description || "No description provided."}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Cuisine
                  </label>
                  <p className="text-sm font-bold text-rose-600 mt-2">
                    {formData.restaurant.cuisine || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-2xl text-rose-500">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Address
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {formData.restaurant.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-2xl text-blue-500">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Contact
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {formData.restaurant.contactNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-4">
            <StatCard
              icon={ShoppingBag}
              label="Total Orders"
              val={formData.totalOrders}
              color="text-rose-500"
            />
            <StatCard
              icon={Utensils}
              label="Cuisine Type"
              val={formData.restaurant.cuisine || "Mix"}
              color="text-orange-500"
            />
            <StatCard
              icon={Clock}
              label="Opening Hours"
              val={formData.restaurant.openingHours || "Check Menu"}
              color="text-blue-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-4xl shadow-xl">
            <h3 className="text-xl font-bold mb-2">Live Storefront</h3>
            <p className="text-gray-400 text-sm mb-6">Slug: /{formData.slug}</p>
            <button className="w-full flex items-center justify-between bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all">
              <span className="flex items-center gap-3">
                <Globe size={18} /> Public Link
              </span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, val, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
      <Icon className={`mx-auto mb-2 ${color}`} size={24} />
      <p className="text-xl font-bold text-gray-800 truncate">{val}</p>
      <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
    </div>
  );
}
