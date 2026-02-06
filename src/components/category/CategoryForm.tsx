"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/category.hooks";

type CategoryFormValues = {
  id?: string;
  name: string;
  slug: string;
  imageUrl?: string;
};

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormValues>;
  onSuccess?: (data: unknown) => void;
}

export default function CategoryForm({
  defaultValues,
  onSuccess,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: defaultValues?.name || "",
      slug: defaultValues?.slug || "",
      imageUrl: defaultValues?.imageUrl || "",
      id: defaultValues?.id,
    },
  });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const apiError = createMutation.error || updateMutation.error;

  useEffect(() => {
    reset({
      name: defaultValues?.name || "",
      slug: defaultValues?.slug || "",
      imageUrl: defaultValues?.imageUrl || "",
      id: defaultValues?.id,
    });
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (values.id) {
      const data = await updateMutation.mutateAsync({
        id: values.id,
        payload: {
          name: values.name,
          slug: values.slug,
          imageUrl: values.imageUrl || undefined,
        },
      });
      onSuccess?.(data);
      return;
    }

    const data = await createMutation.mutateAsync({
      name: values.name,
      slug: values.slug,
      imageUrl: values.imageUrl || undefined,
    });
    onSuccess?.(data);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Name
        </label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
        />
        {errors.name?.message && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Slug
        </label>
        <input
          type="text"
          {...register("slug", { required: "Slug is required" })}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
        />
        {errors.slug?.message && (
          <p className="text-sm text-red-500">{errors.slug.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Image URL
        </label>
        <input
          type="url"
          {...register("imageUrl")}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
        />
      </div>

      {apiError && (
        <p className="text-sm text-red-500">
          {apiError instanceof Error ? apiError.message : "Request failed"}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 disabled:opacity-75"
      >
        {isLoading ? "Saving..." : valuesLabel(defaultValues?.id)}
      </button>
    </form>
  );
}

function valuesLabel(id?: string) {
  return id ? "Update Category" : "Create Category";
}
