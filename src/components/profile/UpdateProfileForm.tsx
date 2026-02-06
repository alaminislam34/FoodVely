"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import API_ENDPOINTS from "@/api/ApiEndpoints";
import toast from "react-hot-toast";

interface UpdateProfileFormProps {
  user: Record<string, unknown> | null;
  isAdmin: boolean;
  onUpdated?: (updated: Record<string, unknown>) => void;
}

type FormValues = {
  name?: string;
  username?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  status?: string;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export default function UpdateProfileForm({
  user,
  isAdmin,
  onUpdated,
}: UpdateProfileFormProps) {
  const defaultValues = useMemo<FormValues>(
    () => ({
      name: (user?.name as string | undefined) || "",
      username: (user?.username as string | undefined) || "",
      phone: (user?.phone as string | undefined) || "",
      avatar: (user?.avatar as string | undefined) || "",
      role: (user?.role as string | undefined) || "",
      status: (user?.status as string | undefined) || "",
    }),
    [user],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const allowedFields = isAdmin
    ? ["name", "username", "phone", "avatar", "role", "status"]
    : ["name", "username", "phone", "avatar"];

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<FormValues>) => {
      const token = getAccessToken();
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.UPDATE_PROFILE}`,
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
      toast.success("Profile updated successfully");
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const payload: Partial<FormValues> = {};
    allowedFields.forEach((field) => {
      const key = field as keyof FormValues;
      const value = values[key];
      if (value !== undefined && value !== "") payload[key] = value;
    });

    if (Object.keys(payload).length === 0) return;
    await updateMutation.mutateAsync(payload);
  });

  return (
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
            Username
          </label>
          <input
            type="text"
            {...register("username")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Avatar URL
          </label>
          <input
            type="url"
            {...register("avatar")}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Role
            </label>
            <input
              type="text"
              {...register("role")}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Status
            </label>
            <input
              type="text"
              {...register("status")}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {errors.root?.message && (
        <p className="text-sm text-red-500">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 disabled:opacity-75"
      >
        {updateMutation.isPending ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
