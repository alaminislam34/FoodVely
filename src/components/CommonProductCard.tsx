"use client";

import { Heart, Plus, Star, Clock, Flame, Leaf } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import toast from "react-hot-toast";

export interface CommonProductCardProps {
  product: {
    id?: string | number;
    slug?: string;
    name?: string;
    title?: string;
    description?: string;
    shortDescription?: string;
    price?: number;
    basePrice?: number;
    discountPrice?: number;
    images?: string[];
    imagePreview?: string; // for preview
    category?: { title?: string };
    categoryName?: string;
    foodInfo?: {
      isVeg?: boolean;
      isSpicy?: boolean;
      preparationTime?: number;
    };
    stock?: number;
    rating?: { average?: number };
    currency?: string;
  };
  basePath?: string;
  isPreview?: boolean;
  onAdd?: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const CommonProductCard = ({
  product,
  basePath = "/menu",
  isPreview = false,
  onAdd,
}: CommonProductCardProps) => {
  if (!product) return null;

  // Support both live and preview props
  const displayPrice =
    product.discountPrice || product.price || product.basePrice || 0;
  const hasDiscount = !!product.discountPrice;
  const categoryName =
    product.category?.title || product.categoryName || "Uncategorized";
  const imageSrc =
    product.imagePreview ||
    (product.images && product.images[0]) ||
    "/images/food.png";
  const title = product.name || product.title || "Delicious New Dish";
  const description =
    product.shortDescription ||
    product.description ||
    "Freshly prepared for you...";

  // Discount percent for preview
  let discountPercent = 0;
  if (product.basePrice && product.discountPrice) {
    discountPercent = Math.round(
      ((product.basePrice - product.discountPrice) / product.basePrice) * 100,
    );
  } else if (product.price && product.discountPrice) {
    discountPercent = Math.round(
      ((product.price - product.discountPrice) / product.price) * 100,
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className="h-full group relative flex flex-col justify-between bg-white/60 backdrop-blur-md p-3 rounded-[2.5rem] border border-white/40 shadow-xl hover:shadow-rose-200/40 transition-all duration-500"
    >
      {/* --- IMAGE SECTION --- */}
      <div className="relative aspect-6/4 w-full rounded-4xl overflow-hidden mb-4 bg-slate-50">
        {isPreview ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <Link href={`${basePath}/${product.slug}`}>
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = "/images/food.png";
              }}
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white text-rose-600 p-4 rounded-3xl shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 font-bold text-sm">
                View Details
              </div>
            </div>
          </Link>
        )}

        {/* Top Left: Dietary Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.foodInfo?.isVeg && (
            <div
              className="bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-green-100"
              title="Vegetarian"
            >
              <Leaf size={14} className="text-green-500 fill-green-500" />
            </div>
          )}
          {product.foodInfo?.isSpicy && (
            <div
              className="bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-red-100"
              title="Spicy"
            >
              <Flame size={14} className="text-orange-600 fill-orange-600" />
            </div>
          )}
        </div>

        {/* Top Right: Rating & Sale */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {hasDiscount && (
            <div className="bg-rose-500  text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
              {isPreview ? (
                <>{discountPercent}% OFF</>
              ) : (
                <>Save {discountPercent}%</>
              )}
            </div>
          )}
          {product.rating?.average && !isPreview && (
            <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 border border-white">
              <Star size={12} className="fill-orange-400 text-orange-400" />
              <span className="text-[11px] font-bold text-slate-800">
                {product.rating.average}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="px-2 pb-2">
        {/* Category & Prep Time */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-rose-500">
            {categoryName}
          </span>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock size={12} />
            <span className="text-[10px] font-bold">
              {product.foodInfo?.preparationTime || 0} min
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-Sofia font-bold text-gray-800 leading-tight group-hover:text-rose-600 transition-colors">
              {title}
            </h3>
            <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
              {description}
            </p>
          </div>
          {!isPreview && (
            <button className="shrink-0 p-2 rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
              <Heart size={18} className={"fill-rose-500 text-rose-500"} />
            </button>
          )}
        </div>

        {/* Pricing & Add Button */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] font-Sofia text-slate-400 line-through font-bold">
                {product.currency || "BDT"} {product.price || product.basePrice}
              </span>
            )}
            <div className="flex items-center gap-1">
              <span className="text-lg md:text-xl font-Sofia font-black text-slate-900">
                {product.currency || "BDT"} {displayPrice}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (onAdd) {
                onAdd();
              } else if (!isPreview) {
                // fallback for live
                toast.success("Added to cart");
              }
            }}
            className="flex items-center gap-2 
             bg-white/10 backdrop-blur-md 
             text-rose-600 pl-4 pr-3 py-2 
             rounded-2xl hover:text-white 
              duration-300 hover:bg-rose-600
             shadow-[inset_0_2px_10px_0_rgba(0,0,0,0.25)] 
             hover:shadow-[0_8px_10px_0_rgba(0,0,0,0.3)]"
          >
            <span className="text-xs font-bold uppercase tracking-wider">
              Add
            </span>
            <div
              className=" p-1 rounded-lg 
              bg-rose-50 group-hover:text-rose-600 
                  flex items-center justify-center"
            >
              <Plus size={14} />
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CommonProductCard;
