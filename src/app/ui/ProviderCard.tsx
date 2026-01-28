"use client";

import { Heart, MapPin, Star, Store } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { Provider } from "@/types/provider";

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const RestaurantCard = ({ provider }: { provider: Provider }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex flex-col bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/20 shadow-xl hover:shadow-rose-200/40 transition-all duration-500 hover:-translate-y-2"
    >
      {/* Cover Image */}
      <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden mb-4 bg-gray-100">
        <Image
          src={provider.images.cover}
          alt={provider.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Open / Closed Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
            provider.openingHours.isOpenNow
              ? "bg-emerald-500 text-white"
              : "bg-gray-800 text-white"
          }`}
        >
          {provider.openingHours.isOpenNow ? "Open Now" : "Closed"}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 bg-white/90 text-rose-500 p-2 rounded-full shadow-md hover:bg-rose-50 transition">
          <Heart size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-2 flex flex-col gap-3">
        {/* Name & Rating */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-Sofia font-bold text-gray-800 tracking-tight">
              {provider.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={14} />
              <span className="line-clamp-1">{provider.location.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-1 rounded-full text-sm font-bold">
            <Star size={14} fill="currentColor" />
            {provider.rating.average}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {provider.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="text-xs font-semibold bg-white/70 text-gray-700 px-3 py-1 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Delivery Info */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-gray-600">
            ⏱ {provider.delivery.deliveryTime}
          </div>
          <div className="text-sm font-bold text-gray-800">
            ৳{provider.delivery.deliveryFee} delivery
          </div>
        </div>

        {/* Action Button */}
        <button className="mt-3 flex items-center justify-center gap-2 bg-rose-500 text-white px-4 py-3 rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-200">
          <Store size={18} />
          <span className="text-sm font-bold">View Restaurant</span>
        </button>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
