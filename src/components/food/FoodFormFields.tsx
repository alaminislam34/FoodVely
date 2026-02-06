"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

export type FoodFormValues = {
  id?: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
  isAvailable?: boolean;
};

type CategoryOption = {
  id: string;
  name: string;
};

interface FoodFormFieldsProps {
  register: UseFormRegister<FoodFormValues>;
  errors: FieldErrors<FoodFormValues>;
  categories: CategoryOption[];
  isCategoryLoading: boolean;
}

export default function FoodFormFields({
  register,
  errors,
  categories,
  isCategoryLoading,
}: FoodFormFieldsProps) {
  return (
    <>
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
            Price
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              valueAsNumber: true,
              required: "Price is required",
              min: { value: 0, message: "Price must be at least 0" },
            })}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
          {errors.price?.message && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Stock
          </label>
          <input
            type="number"
            {...register("stock", {
              valueAsNumber: true,
              required: "Stock is required",
              min: { value: 0, message: "Stock must be at least 0" },
            })}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          />
          {errors.stock?.message && (
            <p className="text-sm text-red-500">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Category
          </label>
          <select
            {...register("categoryId", { required: "Category is required" })}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {isCategoryLoading && (
            <p className="text-xs text-gray-400">Loading categories...</p>
          )}
          {errors.categoryId?.message && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
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
      </div>

      <label className="flex items-center gap-3 text-sm text-gray-700">
        <input type="checkbox" {...register("isAvailable")} />
        Available for orders
      </label>
    </>
  );
}
