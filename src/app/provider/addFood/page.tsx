"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  Upload,
  Plus,
  X,
  Clock,
  Tag,
  FileText,
  ChefHat,
  ChevronLeft,
  Save,
  Leaf,
  Flame,
  Star,
  Heart,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function AddNewFood() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    discountPrice: "",
    category: "Biriyani",
    prepTime: "20",
    isVeg: false,
    isSpicy: false,
    isAvailable: true,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants for styling to match your card
  const hasDiscount =
    formData.discountPrice &&
    Number(formData.discountPrice) < Number(formData.basePrice);
  const displayPrice = hasDiscount
    ? formData.discountPrice
    : formData.basePrice || "0";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Toaster position="top-center" />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pt-6">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-all border border-gray-100 bg-white">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-Sofia font-bold text-gray-800">
              New Secret Recipe
            </h1>
            <p className="text-gray-500">
              Fill in the details to list your new food item.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 rounded-2xl bg-white border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button className="px-8 py-3 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all flex items-center gap-2">
            <Save size={18} /> Publish Dish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- LEFT: FORM SECTION (COL 8) --- */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Image Upload Area */}
          <section className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-Sofia font-bold text-gray-800 mb-4 flex items-center gap-2">
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
                  className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-Sofia font-bold"
                  placeholder="e.g. Traditional Beef Kala Bhuna"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Base Price (BDT)
                </label>
                <input
                  type="number"
                  className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                  placeholder="0.00"
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Discount Price (Optional)
                </label>
                <input
                  type="number"
                  className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-green-600"
                  placeholder="0.00"
                  onChange={(e) =>
                    setFormData({ ...formData, discountPrice: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Prep Time (Mins)
                </label>
                <input
                  type="number"
                  className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                  placeholder="20"
                  onChange={(e) =>
                    setFormData({ ...formData, prepTime: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Category
                </label>
                <select
                  className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option>Biriyani</option>
                  <option>Rice Bowl</option>
                  <option>Curry</option>
                  <option>Snacks</option>
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() =>
                  setFormData({ ...formData, isVeg: !formData.isVeg })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-sm ${formData.isVeg ? "bg-green-50 border-green-200 text-green-600" : "bg-gray-50 border-gray-100 text-gray-400"}`}
              >
                <Leaf size={16} /> Vegetarian
              </button>
              <button
                onClick={() =>
                  setFormData({ ...formData, isSpicy: !formData.isSpicy })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-sm ${formData.isSpicy ? "bg-red-50 border-red-200 text-red-600" : "bg-gray-50 border-gray-100 text-gray-400"}`}
              >
                <Flame size={16} /> Spicy
              </button>
            </div>
          </section>
        </div>

        {/* --- RIGHT: PREVIEW SECTION (COL 4) --- */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-6">
            <h3 className="text-sm md:text-base font-black text-gray-600 mb-4 text-center">
              Live Preview
            </h3>

            {/* --- YOUR ACTUAL CARD DESIGN START --- */}
            <div className="max-w-[320px] mx-auto group relative flex flex-col justify-between bg-white/60 backdrop-blur-md p-3 rounded-[2.5rem] border border-white/40 shadow-xl">
              {/* Image Section */}
              <div className="relative aspect-square w-full rounded-4xl overflow-hidden mb-4 bg-slate-50">
                <Image
                  src={imagePreview || "/images/food.png"}
                  fill
                  alt="Preview"
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {formData.isVeg && (
                    <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-green-100">
                      <Leaf
                        size={14}
                        className="text-green-500 fill-green-500"
                      />
                    </div>
                  )}
                  {formData.isSpicy && (
                    <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-red-100">
                      <Flame
                        size={14}
                        className="text-orange-600 fill-orange-600"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="px-2 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-Sofia">
                    {formData.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold">
                      {formData.prepTime} min
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-Sofia font-bold text-gray-800 leading-tight">
                      {formData.name || "Dish Title Here"}
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 italic">
                      Sample description...
                    </p>
                  </div>
                  <button className="shrink-0 p-2 rounded-2xl bg-slate-50 text-slate-400">
                    <Heart size={18} />
                  </button>
                </div>

                {/* Pricing */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <div className="flex flex-col">
                    {hasDiscount && (
                      <span className="text-[10px] text-slate-400 line-through font-bold">
                        BDT {formData.basePrice}
                      </span>
                    )}
                    <span className="text-lg font-black text-slate-900">
                      BDT {displayPrice}
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
            {/* --- CARD DESIGN END --- */}
          </div>
        </div>
      </div>
    </div>
  );
}
