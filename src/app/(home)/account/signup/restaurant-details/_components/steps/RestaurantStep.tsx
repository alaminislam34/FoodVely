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
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
// removed duplicate useState import
import { useEffect, useState } from "react";
import { RestaurantFormValues } from "../ProviderSignupFlow";
import { useCategory } from "@/hooks/hooks/useCategory";

type RestaurantStepProps = {
  register: UseFormRegister<RestaurantFormValues>;
  errors: FieldErrors<RestaurantFormValues>;
  values: RestaurantFormValues;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onFileChange: (
    field: "logoFile" | "coverImageFile",
    file: File | null,
  ) => void;
  setValue?: UseFormSetValue<RestaurantFormValues>;
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
  setValue,
}: RestaurantStepProps) {
  // Food categories state for popover
  const { categories, isLoading: isCategoriesLoading } = useCategory();
  const [categorySearch, setCategorySearch] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const filteredCategories = categories.filter((cat: any) =>
    cat.title.toLowerCase().includes(categorySearch.toLowerCase()),
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!values.logoFile) {
      setLogoPreview(null);
      return;
    }

    const url = URL.createObjectURL(values.logoFile);
    setLogoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [values.logoFile]);

  useEffect(() => {
    if (!values.coverImageFile) {
      setCoverPreview(null);
      return;
    }

    const url = URL.createObjectURL(values.coverImageFile);
    setCoverPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [values.coverImageFile]);

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Restaurant Name */}
        <FormField
          label="Restaurant Name"
          htmlFor="restaurantName"
          required
          error={errors.restaurantName?.message}
        >
          <div className="relative">
            <Store
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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

        {/* City + Contact */}
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="City"
            htmlFor="city"
            required
            error={errors.city?.message}
          >
            <div className="relative">
              <MapPin
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
            error={errors.contactNumber?.message}
          >
            <div className="relative">
              <Phone
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="contactNumber"
                {...register("contactNumber")}
                type="tel"
                inputMode="numeric"
                className={`${inputClassName} pl-11`}
                placeholder="017XXXXXXXX"
              />
            </div>
          </FormField>
        </div>

        {/* Address */}
        <FormField
          label="Full Address"
          htmlFor="address"
          required
          error={errors.address?.message}
        >
          <textarea
            id="address"
            {...register("address")}
            rows={2}
            className={`${inputClassName} h-auto py-3 resize-none`}
            placeholder="Street, Area, City"
          />
        </FormField>

        {/* Food Categories (Multi-select popover) */}
        <FormField
          label="Food Categories"
          htmlFor="foodCategories"
          required
          error={errors.foodCategories?.message as string}
        >
          <div className="relative">
            <button
              type="button"
              className="w-full h-12 rounded-xl border border-slate-100 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition-all flex items-center justify-between"
              onClick={() => setShowPopover((v) => !v)}
            >
              {values.foodCategories.length > 0
                ? `${values.foodCategories.length} selected`
                : "Select food categories"}
              <span className="ml-2 text-xs text-slate-400">▼</span>
            </button>
            {showPopover && (
              <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg p-3">
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="mb-2 w-full rounded border px-2 py-1 text-sm"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
                {isCategoriesLoading ? (
                  <div className="text-center py-4 text-slate-400 text-sm">
                    Loading...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {filteredCategories.length === 0 && (
                      <div className="col-span-2 text-center text-slate-400 text-xs">
                        No categories found
                      </div>
                    )}
                    {filteredCategories.map((cat: any) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 cursor-pointer rounded px-2 py-1 hover:bg-rose-50"
                      >
                        <input
                          type="checkbox"
                          checked={values.foodCategories.includes(cat.title)}
                          onChange={(e) => {
                            if (!setValue) return;
                            const newCats = e.target.checked
                              ? [...values.foodCategories, cat.title]
                              : values.foodCategories.filter(
                                  (c) => c !== cat.title,
                                );
                            setValue("foodCategories", newCats, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                        />
                        <span>{cat.title}</span>
                      </label>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="mt-2 w-full rounded bg-rose-500 text-white py-1 text-sm font-semibold hover:bg-rose-600"
                  onClick={() => setShowPopover(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </FormField>

        {/* Cuisine + Hours */}
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Cuisine Type"
            htmlFor="cuisine"
            error={errors.cuisine?.message}
          >
            <div className="relative">
              <Utensils
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="cuisine"
                {...register("cuisine")}
                type="text"
                className={`${inputClassName} pl-11`}
                placeholder="e.g. Burger, Fast Food"
              />
            </div>
          </FormField>

          <FormField
            label="Business Hours"
            htmlFor="openingHours"
            error={errors.openingHours?.message}
          >
            <div className="relative">
              <Clock3
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="openingHours"
                {...register("openingHours")}
                type="text"
                className={`${inputClassName} pl-11`}
                placeholder="9 AM - 10 PM"
              />
            </div>
          </FormField>
        </div>

        {/* Upload Section */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Logo */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Logo</label>

            <input
              id="logoFile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                onFileChange("logoFile", e.target.files?.[0] || null)
              }
            />

            <label
              htmlFor="logoFile"
              className={`flex h-12 w-full cursor-pointer items-center gap-2 rounded-xl border border-dashed px-4 text-xs font-medium transition-all ${
                values.logoFile
                  ? "border-rose-300 bg-rose-50 text-rose-600"
                  : "border-slate-300 bg-slate-50 text-slate-500"
              }`}
            >
              <ImageIcon size={16} />
              {values.logoFile?.name || "Upload Logo"}
            </label>

            {logoPreview && (
              <img
                src={logoPreview}
                alt="logo preview"
                className="h-12 w-12 rounded object-cover"
              />
            )}
          </div>

          {/* Cover */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Cover Image
            </label>

            <input
              id="coverImageFile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                onFileChange("coverImageFile", e.target.files?.[0] || null)
              }
            />

            <label
              htmlFor="coverImageFile"
              className={`flex h-12 w-full cursor-pointer items-center gap-2 rounded-xl border border-dashed px-4 text-xs font-medium transition-all ${
                values.coverImageFile
                  ? "border-rose-300 bg-rose-50 text-rose-600"
                  : "border-slate-300 bg-slate-50 text-slate-500"
              }`}
            >
              <ImageIcon size={16} />
              {values.coverImageFile?.name || "Upload Cover"}
            </label>

            {coverPreview && (
              <img
                src={coverPreview}
                alt="cover preview"
                className="h-20 w-full rounded object-cover"
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="h-12 flex-1 rounded-2xl font-bold text-slate-500"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 flex-1 rounded-2xl bg-rose-500 font-bold text-white hover:bg-rose-600"
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
