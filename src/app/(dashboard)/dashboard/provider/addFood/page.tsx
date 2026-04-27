"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { Upload, Plus, ChevronLeft, Save, Heart, Clock } from "lucide-react";
import Image from "next/image";
import { useFood } from "@/hooks/hooks/useFood";
import { useAuth } from "@/hooks/hooks/useAuth";
import { useCategory } from "@/hooks/hooks/useCategory";

export default function AddNewFood() {
  const router = useRouter();
  const { user } = useAuth();
  const { createFood } = useFood();
  const { categories } = useCategory();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    basePrice: "",
    categoryId: "",
    providerId: user?.id,
    stock: "",
    currency: "BDT",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Food name is required";
    if (!formData.slug.trim()) return "Slug is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.basePrice || Number(formData.basePrice) <= 0)
      return "Base price must be greater than 0";
    if (!formData.categoryId) return "Category is required";
    if (!formData.providerId) return "Provider is required";
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      // You can use toast.error here if you want
      return;
    }
    setIsSubmitting(true);

    try {
      const payload: any = {
        ...formData,
        basePrice: Number(formData.basePrice),
        stock: formData.stock ? Number(formData.stock) : undefined,
        images: imageFile ? [imageFile] : undefined,
      };
      await createFood(payload);
      router.push("/dashboard/provider/products");
    } catch {
      // Error toast is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Toaster position="top-center" />
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pt-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/provider/products")}
            className="p-2 hover:bg-gray-100 rounded-full transition-all border border-gray-100 bg-white"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              New Secret Recipe
            </h1>
            <p className="text-gray-500">
              Fill in the details to list your new food item.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/provider/products")}
            className="px-6 py-3 rounded-2xl bg-white border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <Save size={18} /> {isSubmitting ? "Publishing..." : "Publish Dish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- LEFT: FORM SECTION (COL 8) --- */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Image Upload Area */}
          <section className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Upload size={18} className="text-rose-500" /> Media Upload
            </h3>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-64 md:h-80 w-full rounded-3xl border-2 border-dashed border-gray-200 hover:border-rose-400 hover:bg-rose-50/30 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Plus size={32} className="text-rose-500" />
                  </div>
                  <p className="font-bold text-gray-700">Add Food Photo</p>
                  <p className="text-xs text-gray-400 mt-1">
                    High quality images sell 2x faster
                  </p>
                </div>
              )}
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </section>

          {/* Details Form */}
          <section className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Food Name
                </label>
                <input
                  type="text"
                  value={formData.title}
                  className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                  placeholder="e.g. Traditional Beef Kala Bhuna"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Base Price (BDT)
                </label>
                <input
                  type="number"
                  value={formData.basePrice}
                  className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                  placeholder="0.00"
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Stock (Optional)
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                  placeholder="Stock"
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Category
              </label>
              <select
                value={formData.categoryId}
                className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Description
              </label>
              <textarea
                value={formData.description}
                className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                placeholder="Describe your dish"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </section>
        </div>

        {/* --- RIGHT: PREVIEW SECTION (COL 4) --- */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-6">
            <h3 className="text-sm md:text-base font-black text-gray-600 mb-4 text-center">
              Live Preview
            </h3>
            <div className="max-w-[320px] mx-auto group relative flex flex-col justify-between bg-white/60 backdrop-blur-md p-3 rounded-[2.5rem] border border-white/40 shadow-xl">
              <div className="relative aspect-square w-full rounded-4xl overflow-hidden mb-4 bg-slate-50">
                <Image
                  src={imagePreview || "/images/food.png"}
                  fill
                  alt="Preview"
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2"></div>
              </div>
              <div className="px-2 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest ">
                    {formData.categoryId}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold">20 min</span>
                  </div>
                </div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-800 leading-tight">
                      {formData.title || "Dish Title Here"}
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 italic">
                      {formData.description || "Sample description..."}
                    </p>
                  </div>
                  <button className="shrink-0 p-2 rounded-2xl bg-slate-50 text-slate-400">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-900">
                      BDT {formData.basePrice || "0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-rose-600 pl-4 pr-3 py-2 rounded-2xl shadow-[inset_0_2px_10px_0_rgba(0,0,0,0.1)]">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Add
                    </span>
                    <div className="p-1 rounded-lg bg-rose-50 flex items-center justify-center">
                      <Plus size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
