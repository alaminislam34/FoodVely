import {
  ArrowLeft,
  Clock3,
  MapPin,
  Phone,
  Store,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "../FormField";
import type { FieldErrors, RestaurantFormData } from "../types";

type RestaurantStepProps = {
  values: RestaurantFormData;
  errors: FieldErrors;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof RestaurantFormData, value: string) => void;
  onFileChange: (
    field: "logoFile" | "coverImageFile",
    file: File | null,
  ) => void;
};

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100";

export function RestaurantStep({
  values,
  errors,
  isLoading,
  onBack,
  onSubmit,
  onChange,
  onFileChange,
}: RestaurantStepProps) {
  return (
    <section>
      <div className="mb-8 lg:mb-12 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202020] md:text-3xl lg:text-4xl">
            Set up Your Restaurant Profile
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#808080]">
            Set up your restaurant profile and get ready to receive orders from
            customers.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Restaurant Name"
          htmlFor="restaurantName"
          required
          error={errors.restaurantName}
        >
          <div className="relative">
            <Store
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              id="restaurantName"
              type="text"
              value={values.restaurantName}
              onChange={(e) => onChange("restaurantName", e.target.value)}
              className={`${inputClassName} pl-11`}
              placeholder="Food House"
            />
          </div>
        </FormField>

        <FormField label="Slug" htmlFor="slug" required error={errors.slug}>
          <input
            id="slug"
            type="text"
            value={values.slug}
            readOnly
            className={`${inputClassName} bg-slate-50`}
            placeholder="auto-generated"
          />
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="City" htmlFor="city" required error={errors.city}>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="city"
                type="text"
                value={values.city}
                onChange={(e) => onChange("city", e.target.value)}
                className={`${inputClassName} pl-11`}
                placeholder="Dhaka"
              />
            </div>
          </FormField>

          <FormField
            label="Contact Number"
            htmlFor="contactNumber"
            error={errors.contactNumber}
          >
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="contactNumber"
                type="text"
                value={values.contactNumber}
                onChange={(e) => onChange("contactNumber", e.target.value)}
                className={`${inputClassName} pl-11`}
                placeholder="+8801XXXXXXXXX"
              />
            </div>
          </FormField>
        </div>

        <FormField
          label="Address"
          htmlFor="address"
          required
          error={errors.address}
        >
          <textarea
            id="address"
            rows={3}
            value={values.address}
            onChange={(e) => onChange("address", e.target.value)}
            className={`${inputClassName} h-auto py-3`}
            placeholder="House 12, Road 5, Dhanmondi"
          />
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Cuisine" htmlFor="cuisine" error={errors.cuisine}>
            <div className="relative">
              <Utensils
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="cuisine"
                type="text"
                value={values.cuisine}
                onChange={(e) => onChange("cuisine", e.target.value)}
                className={`${inputClassName} pl-11`}
                placeholder="Fast Food"
              />
            </div>
          </FormField>

          <FormField
            label="Opening Hours"
            htmlFor="openingHours"
            error={errors.openingHours}
          >
            <div className="relative">
              <Clock3
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="openingHours"
                type="text"
                value={values.openingHours}
                onChange={(e) => onChange("openingHours", e.target.value)}
                className={`${inputClassName} pl-11`}
                placeholder="10:00-22:00"
              />
            </div>
          </FormField>
        </div>

        <FormField
          label="Description"
          htmlFor="description"
          error={errors.description}
        >
          <textarea
            id="description"
            rows={3}
            value={values.description}
            onChange={(e) => onChange("description", e.target.value)}
            className={`${inputClassName} h-auto py-3`}
            placeholder="Tell customers what makes your restaurant special"
          />
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Logo" htmlFor="logoFile" error={errors.logoFile}>
            <input
              id="logoFile"
              type="file"
              accept="image/*"
              onChange={(e) =>
                onFileChange("logoFile", e.target.files?.[0] || null)
              }
              className={`${inputClassName} cursor-pointer p-2`}
            />
            {values.logoFile ? (
              <p className="text-xs text-slate-500">
                Selected: {values.logoFile.name}
              </p>
            ) : null}
          </FormField>

          <FormField
            label="Cover Image"
            htmlFor="coverImageFile"
            error={errors.coverImageFile}
          >
            <input
              id="coverImageFile"
              type="file"
              accept="image/*"
              onChange={(e) =>
                onFileChange("coverImageFile", e.target.files?.[0] || null)
              }
              className={`${inputClassName} cursor-pointer p-2`}
            />
            {values.coverImageFile ? (
              <p className="text-xs text-slate-500">
                Selected: {values.coverImageFile.name}
              </p>
            ) : null}
          </FormField>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-11 flex-1 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="h-11 flex-1 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            {isLoading ? "Submitting..." : "Complete Setup"}
          </Button>
        </div>
      </form>
    </section>
  );
}
