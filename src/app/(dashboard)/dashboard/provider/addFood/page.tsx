"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "react-hot-toast";
import { ChevronLeft, Save, X, Plus, ImageIcon } from "lucide-react";
import CommonProductCard from "@/components/CommonProductCard";
import { FoodGeneralDetailsForm } from "@/components/food/FoodGeneralDetailsForm";
import { FoodSEOForm } from "@/components/food/FoodSEOForm";
import { useFood } from "@/module/hooks/useFood";
import { useCategory } from "@/module/hooks/useCategory";
import { FoodFormValues, foodSchema } from "@/types/zod.validation";

// If you have a real auth hook, use that instead of this mock
const MOCK_PROVIDER_ID = "550e8400-e29b-41d4-a716-446655440000";
const MAX_IMAGES = 3;

export default function AddNewFood() {
  const router = useRouter();
  const { createFood, isLoading } = useFood();
  const { categoriesForPublic } = useCategory();

  // Multi-image states
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
    const files = Array.from(e.target.files || []);

    if (imageFiles.length + files.length > MAX_IMAGES) {
      return toast.error(`Maximum ${MAX_IMAGES} images allowed`);
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        return toast.error(`${file.name} is not an image file`);
      }

      setImageFiles((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same file can be uploaded if deleted
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data: FoodFormValues) => {
    if (imageFiles.length === 0) {
      return toast.error("Please upload at least one image of your dish!");
    }

    try {
      const payload = {
        ...data,
        providerId: MOCK_PROVIDER_ID, // CRITICAL: Added this to fix your Zod error
        images: imageFiles,
      };

      await createFood(payload as any);
      toast.success("Dish published successfully!");
      router.push("/dashboard/provider/products");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to publish dish. Check console for details.");
    }
  };

  const selectedCategory = categoriesForPublic?.find(
    (c) => c.id === watchedValues.categoryId,
  );

  return (
    <div className="relative max-w-[1400px] mx-auto">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-10 pb-20">
        <Toaster position="top-right" />

        {/* --- STICKY HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-20 bg-gray-50/90 backdrop-blur-xl py-6 border-b border-gray-200/50">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-3 hover:bg-white rounded-2xl transition-all border border-gray-200 bg-white shadow-sm text-gray-600 hover:text-rose-600 hover:border-rose-100"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
                New Secret Recipe
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Fill in the details to showcase your dish to the world
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-12 py-4 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </span>
              ) : (
                <>
                  <Save size={20} /> Publish Dish
                </>
              )}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- LEFT COLUMN: INPUTS --- */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            {/* MULTI-IMAGE SECTION */}
            <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Food Gallery
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      The first image is your main cover
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${imageFiles.length === MAX_IMAGES ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"}`}
                  >
                    {imageFiles.length} / {MAX_IMAGES}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((src, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 shadow-sm"
                  >
                    <img
                      src={src}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-md text-rose-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-4px] group-hover:translate-y-0 shadow-lg hover:bg-rose-600 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-rose-600 text-[9px] text-white font-black rounded-lg uppercase tracking-widest shadow-lg">
                        Cover Photo
                      </div>
                    )}
                  </div>
                ))}

                {imageFiles.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-rose-400 hover:bg-rose-50/20 transition-all text-gray-400 hover:text-rose-500 group bg-gray-50/50"
                  >
                    <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:shadow-rose-100 transition-all">
                      <Plus size={24} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Add Photo
                    </span>
                  </button>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden"
              />
            </section>

            <FoodGeneralDetailsForm
              register={register}
              setValue={setValue}
              watchedValues={watchedValues}
              categories={categoriesForPublic ?? []}
              errors={errors}
            />

            <FoodSEOForm register={register} />
          </div>

          {/* --- RIGHT COLUMN: PREVIEW --- */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="flex items-center justify-center gap-4 text-gray-300 font-bold uppercase text-[10px] tracking-[0.4em]">
                <div className="h-px flex-1 bg-linear-to-r from-transparent to-gray-200"></div>
                Live Preview
                <div className="h-px flex-1 bg-linear-to-l from-transparent to-gray-200"></div>
              </div>

              <div className="transform hover:scale-[1.02] transition-transform duration-500">
                <CommonProductCard
                  product={{
                    title: watchedValues.title || "Dish Name Appears Here",
                    name: watchedValues.title,
                    description: watchedValues.description,
                    shortDescription:
                      watchedValues.shortDescription ||
                      "Short description will be shown here...",
                    basePrice: watchedValues.basePrice,
                    price: watchedValues.basePrice,
                    discountPrice: watchedValues.discountPrice,
                    images: imagePreviews.length > 0 ? imagePreviews : [],
                    imagePreview: imagePreviews[0] || undefined,
                    category: selectedCategory
                      ? { title: selectedCategory.title }
                      : undefined,
                    categoryName: selectedCategory?.title || "Category",
                    foodInfo: watchedValues.foodInfo,
                    stock: watchedValues.stock,
                    currency: "BDT",
                  }}
                  isPreview={true}
                />
              </div>

              <div className="p-8 bg-linear-to-br from-rose-50 to-orange-50 rounded-[2rem] border border-rose-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-rose-500">
                  <ImageIcon size={80} />
                </div>
                <h4 className="text-rose-900 font-bold text-sm mb-2 relative z-10">
                  Pro Visibility Tip
                </h4>
                <p className="text-[12px] text-rose-700/80 font-medium leading-relaxed relative z-10">
                  Dishes with at least{" "}
                  <span className="font-bold">3 bright photos</span> and a
                  detailed <span className="font-bold">Short Description</span>{" "}
                  receive 40% more orders.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
