"use client";

import { Heart, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { Product } from "@/types/product";

// Card Variants for Animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Reusable Product Card Component
export const ProductCard = ({ product }: { product: Product }) => {
  const displayPrice = product.discountPrice || product.price;

  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex flex-col bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/20 shadow-xl hover:shadow-rose-200/40 transition-all duration-500 hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden mb-4 bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          height={600}
          width={500}
          className="object-contain aspect-square transition-transform duration-700 group-hover:scale-110"
        />

        {/* Discount Badge */}
        {product.discountPrice && (
          <div className="absolute top-3 right-3 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Sale
          </div>
        )}

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white text-rose-600 p-3 rounded-2xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-Sofia font-bold text-gray-800 tracking-tight">
              {product.name}
            </h3>
            <p className="text-gray-500 text-sm font-medium line-clamp-1">
              {product.description}
            </p>
          </div>
          <button className="p-2 rounded-full bg-rose-50 text-rose-500 hover:fill-rose-600 hover:bg-rose-100 transition-colors">
            <Heart size={18} />
          </button>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-rose-500 font-bold text-sm">$</span>
            <span className="text-2xl font-Sofia font-black text-gray-900">
              {displayPrice}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.price}
              </span>
            )}
          </div>

          <button className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-200">
            <ShoppingCart size={16} />
            <span className="text-sm font-bold">Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
