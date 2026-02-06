"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import API_ENDPOINTS from "@/api/ApiEndpoints";

interface UpdateRestaurantFormProps {
  restaurantId: string;
  restaurant: Record<string, unknown> | null;
  onUpdated?: (updated: Record<string, unknown>) => void;
}

type FormValues = {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  lat?: number | string;
  lng?: number | string;
  phone?: string;
  logoUrl?: string;
  coverUrl?: string;
  deliveryTime?: string;
  deliveryFee?: number | string;
  minOrderAmount?: number | string;
  isDeliveryAvailable?: boolean;
  cuisineTypes?: string;
  openingHours?: string;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export default function UpdateRestaurantForm({
  restaurantId,
  restaurant,
  onUpdated,
}: UpdateRestaurantFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState<Record<string, unknown> | null>(null);
  const defaultValues = useMemo<FormValues>(
    () => ({
      name: (restaurant?.name as string | undefined) || "",
      description: (restaurant?.description as string | undefined) || "",
      address: (restaurant?.address as string | undefined) || "",
      city: (restaurant?.city as string | undefined) || "",
      lat: (restaurant?.lat as number | string | undefined) ?? "",
      lng: (restaurant?.lng as number | string | undefined) ?? "",
      phone: (restaurant?.phone as string | undefined) || "",
      logoUrl: (restaurant?.logoUrl as string | undefined) || "",
      coverUrl: (restaurant?.coverUrl as string | undefined) || "",
      deliveryTime: (restaurant?.deliveryTime as string | undefined) || "",
      deliveryFee: (restaurant?.deliveryFee as number | string | undefined) ?? "",
      minOrderAmount:
        (restaurant?.minOrderAmount as number | string | undefined) ?? "",
      isDeliveryAvailable:
        (restaurant?.isDeliveryAvailable as boolean | undefined) ?? false,
      cuisineTypes: Array.isArray(restaurant?.cuisineTypes)
        ? (restaurant?.cuisineTypes as string[]).join(", ")
        : "",
      openingHours: restaurant?.openingHours
        ? JSON.stringify(restaurant.openingHours, null, 2)
        : "",
    }),
    [restaurant],
  );

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const updateMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const token = getAccessToken();
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.UPDATE_RESTAURANT}/${restaurantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        },
      );

      const text = await response.text();
      const data = text ? (JSON.parse(text) as unknown) : undefined;

      if (!response.ok) {
        const message =
          (data as { message?: string } | undefined)?.message ||
          response.statusText ||
          "Update failed";
        throw new Error(message);
      }

      return data;
    },
    onSuccess: (data) => {
      const next =
        (data as { data?: Record<string, unknown> } | undefined)?.data ??
        (data as Record<string, unknown> | undefined);
      if (next && onUpdated) onUpdated(next);
      setLatestUpdate(next ?? null);
      setIsModalOpen(true);
      toast.success("Restaurant updated successfully");
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Update failed";
      toast.error(message);
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const payload: Record<string, unknown> = {};

    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === "") return;
      if (key === "cuisineTypes") {
        const list = String(value)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        if (list.length) payload.cuisineTypes = list;
        return;
      }
      if (key === "openingHours") {
        try {
          if (String(value).trim().length > 0) {
            payload.openingHours = JSON.parse(String(value));
          }
        } catch {
          toast.error("Opening hours must be valid JSON");
          return;
        }
        return;
      }
      if (key === "lat" || key === "lng" || key === "deliveryFee" || key === "minOrderAmount") {
        const num = Number(value);
        if (!Number.isNaN(num)) payload[key] = num;
        return;
      }
      payload[key] = value;
    });

    if (Object.keys(payload).length === 0) return;
    await updateMutation.mutateAsync(payload);
  });

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl border border-gray-200">
            <h4 className="text-xl font-Sofia font-bold text-gray-900 mb-2">
              Restaurant Updated
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Your restaurant information has been updated successfully.
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {(latestUpdate?.name as string | undefined) ||
                  (restaurant?.name as string | undefined) ||
                  "Not provided"}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {(latestUpdate?.address as string | undefined) ||
                  (restaurant?.address as string | undefined) ||
                  "Not provided"}
              </p>
              <p>
                <span className="font-semibold">City:</span>{" "}
                {(latestUpdate?.city as string | undefined) ||
                  (restaurant?.city as string | undefined) ||
                  "Not provided"}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {(latestUpdate?.phone as string | undefined) ||
                  (restaurant?.phone as string | undefined) ||
                  "Not provided"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Name
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Phone
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Description
        </label>
        <textarea
          rows={3}
          {...register("description")}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Address
          </label>
          <input
            type="text"
            {...register("address")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            City
          </label>
          <input
            type="text"
            {...register("city")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            {...register("lat")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            {...register("lng")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Logo URL
          </label>
          <input
            type="url"
            {...register("logoUrl")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Cover URL
          </label>
          <input
            type="url"
            {...register("coverUrl")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Delivery Time
          </label>
          <input
            type="text"
            {...register("deliveryTime")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Delivery Fee
          </label>
          <input
            type="number"
            {...register("deliveryFee")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Min Order Amount
          </label>
          <input
            type="number"
            {...register("minOrderAmount")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Delivery Available
          </label>
          <label className="flex items-center gap-3 mt-2 text-sm text-gray-700">
            <input type="checkbox" {...register("isDeliveryAvailable")} />
            Delivery is available
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Cuisine Types (comma separated)
        </label>
        <input
          type="text"
          {...register("cuisineTypes")}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Opening Hours (JSON)
        </label>
        <textarea
          rows={6}
          {...register("openingHours")}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm font-mono"
        />
      </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 disabled:opacity-75"
        >
          {updateMutation.isPending ? "Updating..." : "Update Restaurant"}
        </button>
      </form>
    </>
  );
}
