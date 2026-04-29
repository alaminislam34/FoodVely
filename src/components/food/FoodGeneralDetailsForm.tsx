import { Info, Leaf, Flame, Clock, Star } from "lucide-react";
import React from "react";

export function FoodGeneralDetailsForm({
  register,
  setValue,
  watchedValues,
  categories,
  errors,
}: any) {
  return (
    <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
      <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
        <div className="p-2 bg-rose-50 rounded-xl">
          <Info size={20} className="text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">General Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
            Dish Title
          </label>
          <input
            {...register("title", {
              onChange: (e: any) =>
                setValue(
                  "slug",
                  e.target.value.toLowerCase().trim().replace(/\s+/g, "-"),
                ),
            })}
            className="w-full mt-2 p-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300"
            placeholder="e.g. Traditional Beef Kala Bhuna"
          />
          {errors.title && (
            <p className="text-rose-500 text-xs mt-2 ml-1 font-bold">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
            Price (BDT)
          </label>
          <input
            type="number"
            {...register("basePrice")}
            className="w-full mt-2 p-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none font-bold transition-all"
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
            Discount Price
          </label>
          <input
            type="number"
            {...register("discountPrice")}
            className="w-full mt-2 p-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none font-bold transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
          Cuisine Category
        </label>
        <div className="flex flex-wrap gap-3 mt-3">
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                setValue("categoryId", cat.id, { shouldValidate: true })
              }
              className={`px-6 py-3 rounded-2xl font-bold transition-all border-2 ${
                watchedValues.categoryId === cat.id
                  ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100 scale-105"
                  : "bg-gray-50 border-gray-100 text-gray-500 hover:border-rose-200"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
        {errors.categoryId && (
          <p className="text-rose-500 text-xs mt-2 font-bold">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Characteristics Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <button
          type="button"
          onClick={() =>
            setValue("foodInfo.isVeg", !watchedValues.foodInfo?.isVeg)
          }
          className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
            watchedValues.foodInfo?.isVeg
              ? "border-green-500 bg-green-50 text-green-700 shadow-md shadow-green-100"
              : "border-gray-50 bg-gray-50 text-gray-400"
          }`}
        >
          <Leaf
            size={24}
            className={watchedValues.foodInfo?.isVeg ? "fill-green-500" : ""}
          />
          <span className="text-xs font-black uppercase tracking-tighter">
            Vegetarian
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setValue("foodInfo.isSpicy", !watchedValues.foodInfo?.isSpicy)
          }
          className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
            watchedValues.foodInfo?.isSpicy
              ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md shadow-orange-100"
              : "border-gray-50 bg-gray-50 text-gray-400"
          }`}
        >
          <Flame
            size={24}
            className={watchedValues.foodInfo?.isSpicy ? "fill-orange-500" : ""}
          />
          <span className="text-xs font-black uppercase tracking-tighter">
            Spicy Dish
          </span>
        </button>

        <div className="p-5 rounded-3xl bg-gray-50 flex flex-col items-center gap-2 border border-gray-100">
          <Clock size={20} className="text-gray-400" />
          <input
            type="number"
            {...register("foodInfo.preparationTime")}
            className="bg-transparent w-full text-center font-black text-lg outline-none text-gray-800"
          />
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            MINS
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-gray-50 flex flex-col items-center gap-2 border border-gray-100">
          <Star size={20} className="text-gray-400" />
          <input
            type="number"
            {...register("stock")}
            className="bg-transparent w-full text-center font-black text-lg outline-none text-gray-800"
          />
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            STOCK
          </span>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
          Dish Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full mt-2 p-5 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none font-bold text-gray-700 transition-all"
          placeholder="Share the story behind this dish..."
        />
      </div>
    </section>
  );
}
