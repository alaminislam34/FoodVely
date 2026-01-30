"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  Utensils,
  ShoppingBag,
  Info,
  Camera,
  Edit3,
  Globe,
  Settings,
  Store,
  X,
  Save,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function RestaurantProfile() {
  // --- State Management ---
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [restaurant, setRestaurant] = useState({
    name: "FoodVally Kitchen",
    description: "Best homemade food with authentic Bangla taste.",
    owner: {
      name: "Rahim Uddin",
      phone: "017XXXXXXXX",
      email: "FoodVally@gmail.com",
    },
    location: { address: "Dhanmondi 27, Dhaka", city: "Dhaka" },
    categories: ["Biriyani", "Chicken", "Rice Bowls"],
    images: {
      logo: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&h=200&auto=format&fit=crop",
      cover:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&h=400&auto=format&fit=crop",
    },
    rating: { average: 4.6, totalReviews: 320 },
    delivery: { deliveryTime: "30-45 min", minimumOrder: 300 },
    stats: { totalFoods: 48, totalOrders: 1250 },
  });

  // Refs for hidden file inputs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleToggleStatus = () => {
    setIsOpen(!isOpen);
    toast.success(`Restaurant is now ${!isOpen ? "Open" : "Closed"}`, {
      icon: "🏪",
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRestaurant((prev) => ({
          ...prev,
          images: { ...prev.images, [type]: reader.result as string },
        }));
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} updated locally!`,
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDetails = () => {
    setIsEditing(false);
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: "Saving changes...",
      success: "Profile updated successfully!",
      error: "Could not save.",
    });
  };

  return (
    <div className="">
      <Toaster position="top-center" />

      {/* Hidden Inputs for Images */}
      <input
        type="file"
        hidden
        ref={coverInputRef}
        onChange={(e) => handleImageUpload(e, "cover")}
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
        <h2 className="text-2xl font-Sofia font-bold text-gray-800 flex items-center gap-2">
          <Store className="text-rose-600" /> Restaurant Profile
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
            />
            <span className="text-sm font-bold text-gray-700">
              {isOpen ? "Open" : "Closed"}
            </span>
            <button
              onClick={handleToggleStatus}
              className="ml-2 text-xs text-rose-600 hover:underline font-bold transition-all"
            >
              Toggle
            </button>
          </div>
          <button
            onClick={() =>
              isEditing ? handleSaveDetails() : setIsEditing(true)
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${
              isEditing
                ? "bg-green-600 hover:bg-green-700"
                : "bg-rose-600 hover:bg-rose-700"
            } text-white`}
          >
            {isEditing ? (
              <>
                <Save size={16} /> Save Changes
              </>
            ) : (
              <>
                <Settings size={16} /> Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Banner & Profile Picture Section */}
      <div className="relative group mb-16">
        <div className="h-56 md:h-80 w-full rounded-4xl overflow-hidden relative shadow-lg bg-gray-200">
          <img
            src={restaurant.images.cover}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold text-gray-800 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
          >
            <Camera size={18} /> Update Cover
          </button>
        </div>

        {/* Logo Overlay */}
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <div className="relative group/logo">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-4xl border-8 border-white bg-white shadow-2xl overflow-hidden">
              <img
                src={restaurant.images.logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => logoInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-4xl opacity-0 group-hover/logo:opacity-100 transition-opacity"
            >
              <Camera size={24} className="text-white" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-white drop-shadow-lg">
                {restaurant.name}
              </h1>
              <CheckCircle size={24} className="fill-blue-500 text-white" />
            </div>
            <div className="flex items-center gap-4 mt-1 bg-black/20 backdrop-blur-sm p-1 rounded-lg w-fit">
              <span className="flex items-center gap-1 text-sm font-bold text-yellow-400">
                <Star size={16} className="fill-yellow-400" />{" "}
                {restaurant.rating.average}
              </span>
              <span className="text-white/60">|</span>
              <span className="text-sm text-white font-medium">
                {restaurant.rating.totalReviews} reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Editable Business Details */}
          <motion.div
            layout
            className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-Sofia font-bold text-gray-800 flex items-center gap-2">
                <Info size={18} className="text-rose-500" /> Business Details
              </h3>
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      className="w-full mt-2 p-3 border rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-hidden"
                      rows={3}
                      value={restaurant.description}
                      onChange={(e) =>
                        setRestaurant({
                          ...restaurant,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                      {restaurant.description}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Cuisine Categories
                  </label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {restaurant.categories.map((cat) => (
                      <span
                        key={cat}
                        className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        {cat}{" "}
                        {isEditing && (
                          <X size={12} className="cursor-pointer" />
                        )}
                      </span>
                    ))}
                    {isEditing && (
                      <button className="px-3 py-1 border border-dashed border-rose-300 text-rose-600 rounded-lg text-xs font-bold">
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-2xl text-rose-500">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Address
                    </p>
                    {isEditing ? (
                      <input
                        className="w-full mt-1 p-2 border rounded-lg text-sm"
                        value={restaurant.location.address}
                        onChange={(e) =>
                          setRestaurant({
                            ...restaurant,
                            location: {
                              ...restaurant.location,
                              address: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-800">
                        {restaurant.location.address},{" "}
                        {restaurant.location.city}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-2xl text-blue-500">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Contact Phone
                    </p>
                    {isEditing ? (
                      <input
                        className="w-full mt-1 p-2 border rounded-lg text-sm"
                        value={restaurant.owner.phone}
                        onChange={(e) =>
                          setRestaurant({
                            ...restaurant,
                            owner: {
                              ...restaurant.owner,
                              phone: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-800">
                        {restaurant.owner.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Orders",
                val: restaurant.stats.totalOrders,
                icon: ShoppingBag,
                color: "text-rose-500",
              },
              {
                label: "Items",
                val: restaurant.stats.totalFoods,
                icon: Utensils,
                color: "text-orange-500",
              },
              {
                label: "Prep Time",
                val: restaurant.delivery.deliveryTime,
                icon: Clock,
                color: "text-blue-500",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center hover:border-rose-200 transition-colors"
              >
                <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={24} />
                <p className="text-xl font-bold text-gray-800">{stat.val}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-4xl shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Live Storefront</h3>
              <p className="text-gray-400 text-sm mb-6">
                See how customers view your kitchen in Dhanmondi.
              </p>
              <button
                onClick={() =>
                  toast("Redirecting to Storefront...", { icon: "🚀" })
                }
                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all"
              >
                <span className="flex items-center gap-3">
                  <Globe size={18} /> View Public Link
                </span>
                <span>→</span>
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-rose-600 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
          </div>

          <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              Logistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <span className="text-sm text-gray-500 font-medium">
                  Min. Order
                </span>
                <span className="font-bold text-gray-800">
                  ৳{restaurant.delivery.minimumOrder}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <span className="text-sm text-gray-500 font-medium">
                  Platform Fee
                </span>
                <span className="font-bold text-green-600">৳60.00</span>
              </div>
            </div>
            <button
              onClick={() =>
                toast.error("Logistics settings are locked. Contact Support.")
              }
              className="w-full mt-6 text-rose-600 font-bold text-sm hover:underline"
            >
              Update Logistics Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
