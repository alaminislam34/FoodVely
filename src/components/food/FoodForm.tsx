"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useCategories } from "@/hooks/category.hooks";
import { useCreateFood, useUpdateFood } from "@/hooks/food.hooks";
import FoodFormFields, { type FoodFormValues } from "./FoodFormFields";

interface FoodFormProps {
  defaultValues?: Partial<FoodFormValues>;
  onSuccess?: (data: unknown) => void;
}

type CategoryOption = { id: string; name: string };

const normalizeCategories = (payload: unknown): CategoryOption[] => {
  const data = (payload as { data?: unknown } | undefined)?.data ?? payload;
  const list =
    (data as { data?: CategoryOption[] } | undefined)?.data ??
    (data as { items?: CategoryOption[] } | undefined)?.items ??
    (Array.isArray(data) ? data : []);
  return (list as CategoryOption[]).map((category) => ({
    id: category.id,
    name: category.name,
  }));
};

export default function FoodForm({ defaultValues, onSuccess }: FoodFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FoodFormValues>({
    defaultValues: {
      id: defaultValues?.id,
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      price: defaultValues?.price ?? 0,
      stock: defaultValues?.stock ?? 0,
      imageUrl: defaultValues?.imageUrl || "",
      categoryId: defaultValues?.categoryId || "",
      isAvailable: defaultValues?.isAvailable ?? true,
    },
  });

  useEffect(() => {
    reset({
      id: defaultValues?.id,
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      price: defaultValues?.price ?? 0,
      stock: defaultValues?.stock ?? 0,
      imageUrl: defaultValues?.imageUrl || "",
      categoryId: defaultValues?.categoryId || "",
      isAvailable: defaultValues?.isAvailable ?? true,
    });
  }, [defaultValues, reset]);

  const categoriesQuery = useCategories();
  const categories = useMemo(
    () => normalizeCategories(categoriesQuery.data),
    [categoriesQuery.data],
  );

  const createMutation = useCreateFood();
  const updateMutation = useUpdateFood();
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const apiError = createMutation.error || updateMutation.error;

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      price: values.price,
      stock: values.stock,
      imageUrl: values.imageUrl || undefined,
      categoryId: values.categoryId,
      isAvailable: values.isAvailable,
    };

    if (values.id) {
      const data = await updateMutation.mutateAsync({
        id: values.id,
        payload,
      });
      onSuccess?.(data);
      return;
    }

    const data = await createMutation.mutateAsync(payload);
    onSuccess?.(data);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FoodFormFields
        register={register}
        errors={errors}
        categories={categories}
        isCategoryLoading={categoriesQuery.isLoading}
      />

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
        {isLoading ? "Saving..." : defaultValues?.id ? "Update Food" : "Create Food"}
      </button>
    </form>
  );
}
