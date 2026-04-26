"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { X, Image as ImageIcon } from "lucide-react";

export interface CategoryFormValues {
  title: string;
  description?: string;
  image?: FileList | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    image?: File | null;
  }) => void;
  isPending?: boolean;

  // 🔥 for edit support
  defaultValues?: {
    title?: string;
    description?: string;
  };
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  defaultValues,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
    },
  });

  const image = watch("image");

  useEffect(() => {
    if (isOpen) {
      reset({
        title: defaultValues?.title || "",
        description: defaultValues?.description || "",
      });
    }
  }, [isOpen, defaultValues, reset]);

  const submitHandler = (data: CategoryFormValues) => {
    onSubmit({
      title: data.title,
      description: data.description,
      image: data.image?.[0] || null,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                {defaultValues ? "Edit Category" : "Create Category"}
              </h2>
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
              {/* Title */}
              <div>
                <input
                  {...register("title", {
                    required: "Category name is required",
                  })}
                  placeholder="Category name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <textarea
                {...register("description")}
                placeholder="Description (optional)"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />

              {/* Image Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <ImageIcon size={16} /> Upload Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="w-full"
                />
              </div>

              {/* Preview */}
              {image?.[0] && (
                <img
                  src={URL.createObjectURL(image[0])}
                  className="w-20 h-20 rounded-xl object-cover"
                  alt="preview"
                />
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white"
                >
                  {isPending
                    ? "Saving..."
                    : defaultValues
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
