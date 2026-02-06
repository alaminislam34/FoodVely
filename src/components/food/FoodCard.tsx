"use client";

import Image from "next/image";
import { Flame, Star, ShoppingCart } from "lucide-react";

interface FoodCardProps {
  name: string;
  price: number;
  discountPrice?: number;
  thumbnail: string;
  isBestSeller?: boolean;
  isSpicy?: boolean;
  onAddToCart?: () => void;
}

export default function FoodCard({
  name,
  price,
  discountPrice,
  thumbnail,
  isBestSeller,
  isSpicy,
  onAddToCart,
}: FoodCardProps) {
  const hasDiscount =
    typeof discountPrice === "number" && discountPrice > 0 && discountPrice < price;
  const displayPrice = hasDiscount ? discountPrice : price;

  return (
    <div className="group bg-white/70 backdrop-blur-md p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all">
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gray-50">
        <Image
          src={thumbnail}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isBestSeller && (
            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow">
              Best Seller
            </span>
          )}
          {isSpicy && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-orange-500 text-white shadow">
              <Flame size={12} className="fill-white" /> Spicy
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="text-base font-bold text-gray-800 line-clamp-2">{name}</h4>
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-rose-600">৳{displayPrice}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">৳{price}</span>
          )}
          {isBestSeller && <Star size={14} className="text-amber-500" />}
        </div>
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 text-white font-semibold shadow hover:shadow-md transition-all"
      >
        <ShoppingCart size={16} /> Add to Cart
      </button>
    </div>
  );
}
