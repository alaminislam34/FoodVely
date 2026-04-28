"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "react-hot-toast";
import {
  Upload,
  Plus,
  ChevronLeft,
  Save,
  Heart,
  Clock,
  Star,
  Flame,
  Leaf,
  Settings,
  Info,
} from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import CommonProductCard from "@/components/CommonProductCard";
import { FoodImageUpload } from "@/components/food/FoodImageUpload";
import { FoodGeneralDetailsForm } from "@/components/food/FoodGeneralDetailsForm";
import { FoodSEOForm } from "@/components/food/FoodSEOForm";
import { useFood } from "@/hooks/hooks/useFood";
import { useCategory } from "@/hooks/hooks/useCategory";
import { FoodFormValues, foodSchema } from "@/types/zod.validation";

export default function AddNewFood() {
  const router = useRouter();
  const { createFood, isLoading } = useFood();
  const { categories } = useCategory();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FoodFormValues>({
    resolver: zodResolver(foodSchema as any),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      basePrice: 0,
      categoryId: "",
      stock: 0,
      isFeatured: false,
      foodInfo: { isVeg: false, isSpicy: false, preparationTime: 15 },
      shortDescription: "",
      discountPrice: undefined,
      metaTitle: "",
      metaDescription: "",
    },
  });

  const watchedValues = useWatch({ control });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (data: FoodFormValues) => {
    if (!imageFile) {
      return toast.error("Please upload a food image first!");
    }

    try {
      // NOTE: We pass the plain object + images array.
      // Your foodService handles the FormData conversion.
      const payload = {
        ...data,
        images: [imageFile],
      };

      await createFood(payload as any);
      router.push("/dashboard/provider/products");
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  // UI Helpers for Preview
  const selectedCategory = categories.find(
    (c) => c.id === watchedValues.categoryId,
  );
  const discountAmount =
    watchedValues.basePrice && watchedValues.discountPrice
      ? Math.round(
          ((watchedValues.basePrice - watchedValues.discountPrice) /
            watchedValues.basePrice) *
            100,
        )
      : 0;

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-10 ">
        <Toaster position="top-right" />

        {/* --- FIXED HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-3 hover:bg-white rounded-2xl transition-all border border-gray-200 bg-white shadow-sm text-gray-600"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                New Secret Recipe
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                List your masterpiece on FoodVely
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-10 py-4 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={20} /> {isLoading ? "Publishing..." : "Publish Dish"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- LEFT: FORM --- */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Image Upload Area */}
            <FoodImageUpload
              imagePreview={imagePreview}
              fileInputRef={fileInputRef}
              handleImageChange={handleImageChange}
            />

            {/* General Information */}
            <FoodGeneralDetailsForm
              register={register}
              setValue={setValue}
              watchedValues={watchedValues}
              categories={categories}
              errors={errors}
            />

            {/* SEO Settings */}
            <FoodSEOForm register={register} />
          </div>

          {/* --- RIGHT: LIVE PREVIEW --- */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="flex items-center justify-center gap-3 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">
                <div className="h-px w-6 bg-gray-200"></div>
                Live Preview
                <div className="h-px w-6 bg-gray-200"></div>
              </div>

              {/* Card Component (now using CommonProductCard) */}
              <CommonProductCard
                product={{
                  title: watchedValues.title,
                  name: watchedValues.title,
                  description: watchedValues.description,
                  shortDescription: watchedValues.shortDescription,
                  basePrice: watchedValues.basePrice,
                  price: watchedValues.basePrice,
                  discountPrice: watchedValues.discountPrice,
                  images: imagePreview ? [imagePreview] : [],
                  imagePreview: imagePreview || undefined,
                  category: selectedCategory
                    ? { title: selectedCategory.title }
                    : undefined,
                  categoryName: selectedCategory?.title,
                  foodInfo: watchedValues.foodInfo,
                  stock: watchedValues.stock,
                  currency: "BDT",
                }}
                isPreview={true}
              />

              <div className="p-6 bg-rose-50/50 rounded-3xl border border-rose-100/50">
                <p className="text-[11px] text-rose-400 font-bold leading-relaxed text-center">
                  Quality Tip: Use high-resolution photos under good lighting to
                  increase your dish visibility by up to 40%.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
