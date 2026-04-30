import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  Controller,
} from "react-hook-form";
import { RestaurantFormValues } from "../ProviderSignupFlow";
import { Upload, X, MapPin, Phone, Utensils, Clock } from "lucide-react";
import { useCategory } from "@/module/hooks/useCategory";

interface Props {
  register: UseFormRegister<RestaurantFormValues>;
  errors: FieldErrors<RestaurantFormValues>;
  values: RestaurantFormValues;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileChange: (field: "logo" | "coverImage", file: File | null) => void;
  setValue: UseFormSetValue<RestaurantFormValues>;
}

export function RestaurantStep({
  register,
  errors,
  values,
  isLoading,
  onSubmit,
  onFileChange,
  setValue,
  control,
}: Props & { control?: any }) {
  const { categoriesForPublic, isLoading: isCategoriesLoading } = useCategory();

  // Handle checkbox change for foodCategories
  const handleCategoryChange = (category: string) => {
    let updated = Array.isArray(values.foodCategories)
      ? [...values.foodCategories]
      : [];
    if (updated.includes(category)) {
      updated = updated.filter((c) => c !== category);
    } else {
      updated.push(category);
    }
    setValue("foodCategories", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Photo Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Restaurant Logo
          </label>
          <div
            className={`relative h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all ${errors.logo ? "border-rose-300 bg-rose-50" : "border-slate-200 hover:border-rose-400"}`}
          >
            {values.logo ? (
              <div className="relative h-full w-full p-2">
                <img
                  src={URL.createObjectURL(values.logo)}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => onFileChange("logo", null)}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="text-slate-400 mb-2" size={24} />
                <span className="text-xs text-slate-500">Upload Logo</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    onFileChange("logo", e.target.files?.[0] || null)
                  }
                />
              </label>
            )}
          </div>
          {errors.logo && (
            <p className="text-xs text-rose-500">
              {errors.logo.message as string}
            </p>
          )}
        </div>

        {/* Cover Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Cover Image
          </label>
          <div
            className={`relative h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all ${errors.coverImage ? "border-rose-300 bg-rose-50" : "border-slate-200 hover:border-rose-400"}`}
          >
            {values.coverImage ? (
              <div className="relative h-full w-full p-2">
                <img
                  src={URL.createObjectURL(values.coverImage)}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => onFileChange("coverImage", null)}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="text-slate-400 mb-2" size={24} />
                <span className="text-xs text-slate-500">Upload Cover</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    onFileChange("coverImage", e.target.files?.[0] || null)
                  }
                />
              </label>
            )}
          </div>
          {errors.coverImage && (
            <p className="text-xs text-rose-500">
              {errors.coverImage.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Food Categories Multi-select */}
      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700 block mb-2">
          Food Categories
        </label>
        {isCategoriesLoading ? (
          <div className="text-xs text-slate-400">Loading categories...</div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {categoriesForPublic.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(values.foodCategories) &&
                    values.foodCategories.includes(cat.title)
                  }
                  onChange={() => handleCategoryChange(cat.title)}
                  className="accent-rose-500"
                />
                <span className="text-xs">{cat.title}</span>
              </label>
            ))}
          </div>
        )}
        {errors.foodCategories && (
          <p className="text-xs text-rose-500 mt-1">
            {errors.foodCategories.message as string}
          </p>
        )}
      </div>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Restaurant Name */}
        <div className="col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Restaurant Name
          </label>
          <input
            {...register("restaurantName")}
            placeholder="e.g. Food Vally Premium"
            className="w-full rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500 bg-slate-50/50 p-3 text-sm transition-all outline-none border"
          />
          {errors.restaurantName && (
            <p className="text-xs text-rose-500 font-medium">
              {errors.restaurantName.message}
            </p>
          )}
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">City</label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />
            <input
              {...register("city")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 pl-10 text-sm outline-none focus:border-rose-500"
              placeholder="Dhaka"
            />
          </div>
          {errors.city && (
            <p className="text-xs text-rose-500 font-medium">
              {errors.city.message}
            </p>
          )}
        </div>

        {/* Contact Number */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Contact Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              {...register("contactNumber")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 pl-10 text-sm outline-none focus:border-rose-500"
              placeholder="+8801xxxxxxxxx"
            />
          </div>
          {errors.contactNumber && (
            <p className="text-xs text-rose-500 font-medium">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Full Address
          </label>
          <textarea
            {...register("address")}
            rows={2}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm outline-none focus:border-rose-500"
            placeholder="Street address, House no, Area..."
          />
          {errors.address && (
            <p className="text-xs text-rose-500 font-medium">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Cuisine & Opening Hours */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Cuisine Type
          </label>
          <div className="relative">
            <Utensils
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />
            <input
              {...register("cuisine")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 pl-10 text-sm outline-none focus:border-rose-500"
              placeholder="Bengali, Italian..."
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Opening Hours
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              {...register("openingHours")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 pl-10 text-sm outline-none focus:border-rose-500"
              placeholder="10:00 AM - 11:00 PM"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-6 py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Create Profile & Finish"
        )}
      </button>
    </form>
  );
}
