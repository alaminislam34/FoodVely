"use client";

import {
  ArrowLeft,
  Clock3,
  MapPin,
  Phone,
  Store,
  Utensils,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "../FormField";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { RestaurantFormData } from "../types";

type RestaurantStepProps = {
  register: UseFormRegister<any>; // React Hook Form register
  errors: FieldErrors<any>;
  values: any; // watch() থেকে আসা ভ্যালু
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onFileChange: (
    field: "logoFile" | "coverImageFile",
    file: File | null,
  ) => void;
};

const inputClassName =
  "h-12 w-full rounded-xl border border-slate-100 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-50";

export function RestaurantStep({
  register,
  errors,
  values,
  isLoading,
  onBack,
  onSubmit,
  onFileChange,
}: RestaurantStepProps) {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Restaurant Name */}
        <FormField
          label="Restaurant Name"
          htmlFor="restaurantName"
          required
          error={errors.restaurantName?.message as string}
        >
          <div className="relative">
            <Store
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              id="restaurantName"
              {...register("restaurantName")}
              type="text"
              className={`${inputClassName} pl-11`}
              placeholder="e.g. Chillox"
            />
          </div>
        </FormField>

        {/* Slug (Read-only) */}
        <FormField
          label="Slug (URL)"
          htmlFor="slug"
          error={errors.slug?.message as string}
        >
          <input
            id="slug"
            {...register("slug")}
            type="text"
            readOnly
            className={`${inputClassName} bg-slate-50 text-slate-400 cursor-not-allowed border-dashed`}
            placeholder="auto-generated-url"
          />
        </FormField>

        {/* City & Contact Number Row */}
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="City"
            htmlFor="city"
            required
            error={errors.city?.message as string}
          >
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="city"
                {...register("city")}
                type="text"
                className={`${inputClassName} pl-11`}
                placeholder="e.g. Dhaka"
              />
            </div>
          </FormField>

          <FormField
            label="Contact Number"
            htmlFor="contactNumber"
            required
            error={errors.contactNumber?.message as string}
          >
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="contactNumber"
                {...register("contactNumber")}
                type="text"
                className={`${inputClassName} pl-11`}
                placeholder="+8801XXXXXXXXX"
              />
            </div>
          </FormField>
        </div>

        {/* Address */}
        <FormField
          label="Full Address"
          htmlFor="address"
          required
          error={errors.address?.message as string}
        >
          <textarea
            id="address"
            {...register("address")}
            rows={2}
            className={`${inputClassName} h-auto py-3 resize-none`}
            placeholder="Street address, Area, Postcode"
          />
        </FormField>

        {/* Cuisine & Opening Hours Row */}
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Cuisine Type"
            htmlFor="cuisine"
            error={errors.cuisine?.message as string}
          >
            <div className="relative">
              <Utensils
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="cuisine"
                {...register("cuisine")}
                type="text"
                className={`${inputClassName} pl-11`}
                placeholder="e.g. Italian, Thai"
              />
            </div>
          </FormField>

          <FormField
            label="Business Hours"
            htmlFor="openingHours"
            error={errors.openingHours?.message as string}
          >
            <div className="relative">
              <Clock3
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="openingHours"
                {...register("openingHours")}
                type="text"
                className={`${inputClassName} pl-11`}
                placeholder="09:00 AM - 10:00 PM"
              />
            </div>
          </FormField>
        </div>

        {/* File Uploads */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Logo</label>
            <div className="relative group">
              <input
                id="logoFile"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  onFileChange("logoFile", e.target.files?.[0] || null)
                }
                className="hidden"
              />
              <label
                htmlFor="logoFile"
                className={`flex h-12 w-full cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-xs font-medium text-slate-500 transition-all hover:border-rose-400 hover:bg-rose-50/30 ${values.logoFile ? "border-solid border-rose-200 bg-rose-50/20 text-rose-600" : ""}`}
              >
                <ImageIcon size={16} />
                <span className="truncate">
                  {values.logoFile ? values.logoFile.name : "Upload Logo"}
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Cover Photo
            </label>
            <div className="relative group">
              <input
                id="coverImageFile"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  onFileChange("coverImageFile", e.target.files?.[0] || null)
                }
                className="hidden"
              />
              <label
                htmlFor="coverImageFile"
                className={`flex h-12 w-full cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-xs font-medium text-slate-500 transition-all hover:border-rose-400 hover:bg-rose-50/30 ${values.coverImageFile ? "border-solid border-rose-200 bg-rose-50/20 text-rose-600" : ""}`}
              >
                <ImageIcon size={16} />
                <span className="truncate">
                  {values.coverImageFile
                    ? values.coverImageFile.name
                    : "Upload Cover"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="h-12 flex-1 rounded-2xl font-bold text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 flex-1 rounded-2xl bg-rose-500 font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Complete Registration"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
