"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { X, Image as ImageIcon, Upload, Loader2 } from "lucide-react";

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
  /** Pass the full category object when editing */
  initialData?: {
    title?: string;
    description?: string;
    image?: string; // URL from backend
  } | null;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  initialData,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>();

  const watchedImage = watch("image");

  // --- Handle Image Preview & Memory Cleanup ---
  useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Clean up memory when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else if (initialData?.image) {
      setPreview(initialData.image);
    } else {
      setPreview(null);
    }
  }, [watchedImage, initialData]);

  // --- Sync Form with InitialData ---
  useEffect(() => {
    if (isOpen) {
      reset({
        title: initialData?.title || "",
        description: initialData?.description || "",
        image: null,
      });
    }
  }, [isOpen, initialData, reset]);

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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {initialData ? "Update Category" : "Add New Category"}
              </h2>
              <p className="text-sm font-medium text-gray-500">
                {initialData
                  ? "Adjust the details of your existing menu group."
                  : "Create a new group to organize your delicious dishes."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
              {/* Image Upload Zone */}
              <div className="group relative h-44 w-full cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50 transition-all hover:border-rose-200 hover:bg-rose-50/30">
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="absolute inset-0 z-10 cursor-pointer opacity-0"
                />

                {preview ? (
                  <div className="relative h-full w-full">
                    <img
                      src={preview}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <Upload className="text-white" size={24} />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2">
                    <div className="rounded-2xl bg-white p-3 shadow-sm group-hover:scale-110 transition-transform">
                      <ImageIcon className="text-rose-500" size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Upload Display Image
                    </span>
                  </div>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="mb-1.5 ml-1 block text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Category Name
                </label>
                <input
                  {...register("title", { required: "Name is required" })}
                  placeholder="e.g. Italian Pizzas"
                  className="w-full rounded-2xl border-none bg-gray-50 px-5 py-4 font-bold text-gray-800 outline-none ring-2 ring-transparent transition-all focus:bg-white focus:ring-rose-500/20"
                />
                {errors.title && (
                  <p className="mt-2 ml-1 text-xs font-bold text-rose-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description Input */}
              <div>
                <label className="mb-1.5 ml-1 block text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Tell customers what's inside this group..."
                  className="w-full rounded-2xl border-none bg-gray-50 px-5 py-4 font-bold text-gray-700 outline-none ring-2 ring-transparent transition-all focus:bg-white focus:ring-rose-500/20"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl py-4 font-bold text-gray-500 transition-colors hover:bg-gray-100"
                >
                  Discard
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-2 rounded-2xl bg-gray-900 py-4 font-bold text-white shadow-xl shadow-gray-200 transition-all hover:bg-rose-600 hover:shadow-rose-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : initialData ? (
                    "Update Category"
                  ) : (
                    "Publish Category"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
