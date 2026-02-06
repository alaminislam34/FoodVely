"use client";

import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  Utensils,
  ShoppingBag,
  Info,
  Globe,
  Store,
  Edit,
  StoreIcon,
  User,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import UpdateProfileForm from "@/components/profile/UpdateProfileForm";
import UpdateRestaurantForm from "@/components/profile/UpdateRestaurantForm";
import Image from "next/image";

export default function RestaurantProfile() {
  const { user, setUser } = useAuthContext();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const restaurant =
    (user?.providerRestaurant as
      | {
          name?: string;
          description?: string | null;
          logoUrl?: string | null;
          coverUrl?: string | null;
          phone?: string | null;
          city?: string | null;
          address?: string | null;
          cuisineTypes?: string[] | null;
          deliveryFee?: string | number | null;
          deliveryTime?: string | null;
        }
      | undefined) ?? null;
  const restaurantId = (restaurant as { id?: string } | undefined)?.id || "";
  const ownerEmail = (user?.email as string | undefined) || "";
  const ownerPhone = (user?.phone as string | undefined) || "";
  const cuisines = restaurant?.cuisineTypes ?? [];
  const coverUrl = restaurant?.coverUrl || "";
  const logoUrl = restaurant?.logoUrl || "";

  return (
    <div className="">
      <Toaster position="top-center" />

      {/* 1. Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-Sofia font-bold text-gray-800 flex items-center gap-2">
          <Store className="text-rose-600" /> Restaurant Profile
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center justify-center gap-4 py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300"
          >
            <Edit size={18} className="md:hidden" />{" "}
            <User size={18} className="md:hidden" />{" "}
            <span className="hidden md:block">Edit Profile</span>
          </button>

          {restaurantId && (
            <button
              type="button"
              onClick={() => setIsRestaurantModalOpen(true)}
              className="flex items-center justify-center gap-4  py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300"
            >
              <Edit size={18} className="md:hidden" />
              <StoreIcon size={18} className="md:hidden" />{" "}
              <span className="hidden md:block">Edit Restaurant</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Banner & Profile Picture Section */}
      <div className="relative group mb-16">
        <div className="h-56 md:h-80 w-full rounded-4xl overflow-hidden relative shadow-lg bg-gray-200">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
              No cover image
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
        </div>

        {/* Logo Overlay */}
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <div className="relative group/logo">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-4xl border-8 border-white bg-white shadow-2xl overflow-hidden">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                  No logo
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-white drop-shadow-lg">
                {restaurant?.name || ""}
              </h1>
              {restaurant?.name && (
                <CheckCircle size={24} className="fill-blue-500 text-white" />
              )}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Description
                  </label>
                  <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                    {restaurant?.description || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Cuisine Categories
                  </label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {cuisines.length > 0 ? (
                      cuisines.map((cat) => (
                        <span
                          key={cat}
                          className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          {cat}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">
                        Not provided
                      </span>
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
                    <p className="text-sm font-bold text-gray-800">
                      {restaurant?.address || "Not provided"}
                      {restaurant?.city ? `, ${restaurant.city}` : ""}
                    </p>
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
                    <p className="text-sm font-bold text-gray-800">
                      {restaurant?.phone || ownerPhone || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-2xl text-rose-500">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Contact Email
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {ownerEmail || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Prep Time",
                val: restaurant?.deliveryTime || "Not provided",
                icon: Clock,
                color: "text-blue-500",
              },
              {
                label: "Delivery Fee",
                val:
                  restaurant?.deliveryFee !== null &&
                  restaurant?.deliveryFee !== undefined
                    ? `৳${restaurant.deliveryFee}`
                    : "Not provided",
                icon: ShoppingBag,
                color: "text-rose-500",
              },
              {
                label: "Cuisine Count",
                val: cuisines.length ? `${cuisines.length}` : "Not provided",
                icon: Utensils,
                color: "text-orange-500",
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
              <div className="mb-6 space-y-1 text-sm">
                <div className="flex gap-4">
                  <Image
                    src={`${user?.avatarUrl || "/default-avatar.png"}`}
                    alt="User Avatar"
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-white object-cover"
                  />
                  <div className="flex flex-col gap-2 justify-start">
                    <p className="text-white font-semibold">
                      {(user?.name as string | undefined) || "Not provided"}
                    </p>
                    <p className="text-gray-300">
                      username:{" "}
                      {(user?.username as string | undefined) || "not-set"}
                    </p>
                  </div>
                </div>
                <br />
                <p className="text-gray-400">
                  email: {(user?.email as string | undefined) || "Not provided"}
                </p>
                <p className="text-gray-400">
                  Role: {(user?.role as string | undefined) || "Not provided"}
                </p>
              </div>
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
                  Delivery Fee
                </span>
                <span className="font-bold text-gray-800">
                  {restaurant?.deliveryFee !== null &&
                  restaurant?.deliveryFee !== undefined
                    ? `৳${restaurant.deliveryFee}`
                    : "Not provided"}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <span className="text-sm text-gray-500 font-medium">
                  Delivery Time
                </span>
                <span className="font-bold text-gray-800">
                  {restaurant?.deliveryTime || "Not provided"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsProfileModalOpen(false)}
          />
          <div className="relative max-w-2xl w-11/12 rounded-3xl bg-white p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-Sofia font-bold text-gray-900">
                Update Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="text-sm font-semibold text-rose-600 hover:underline"
              >
                Close
              </button>
            </div>
            <UpdateProfileForm
              user={user}
              isAdmin={
                (user?.role as string | undefined)?.toUpperCase() === "ADMIN"
              }
              onUpdated={(updated) => setUser(updated)}
            />
          </div>
        </div>
      )}

      {isRestaurantModalOpen && restaurantId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsRestaurantModalOpen(false)}
          />
          <div className="relative w-11/12 max-w-3xl rounded-3xl bg-white p-6 shadow-xl border border-gray-200 max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-Sofia font-bold text-gray-900">
                Update Restaurant
              </h3>
              <button
                type="button"
                onClick={() => setIsRestaurantModalOpen(false)}
                className="text-sm font-semibold text-rose-600 hover:underline"
              >
                Close
              </button>
            </div>
            <UpdateRestaurantForm
              restaurantId={restaurantId}
              restaurant={restaurant}
              onUpdated={(updated) =>
                setUser((prev) =>
                  prev ? { ...prev, providerRestaurant: updated } : prev,
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
