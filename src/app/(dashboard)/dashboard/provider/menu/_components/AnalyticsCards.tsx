"use client";

import { Product } from "@/types/product";
import { CheckCircle2, MapPin, Package, Star } from "lucide-react";
import { motion } from "motion/react";

interface AnalyticsCardsProps {
  products: Product[];
  avgStock: number;
  avgRating: number;
}

export default function AnalyticsCards({
  products,
  avgStock,
  avgRating,
}: AnalyticsCardsProps) {
  const stats = [
    {
      label: "Total Items",
      value: products.length,
      color: "text-rose-600",
      icon: Package,
    },
    {
      label: "Avg Stock",
      value: avgStock,
      color: "text-orange-600",
      icon: CheckCircle2,
    },
    {
      label: "Reviews",
      value: products
        .reduce(
          (acc: number, p: Product) => acc + (p.rating?.totalReviews ?? 0),
          0,
        )
        .toLocaleString(),
      color: "text-blue-600",
      icon: MapPin,
    },
    {
      label: "Avg Rating",
      value: `${avgRating.toFixed(1)} ★`,
      color: "text-green-600",
      icon: Star,
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 md:p-6 shadow-lg backdrop-blur-xl"
        >
          <div className="flex flex-col gap-1">
            <p className={`text-2xl md:text-3xl font-bold  ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-xs md:text-sm font-medium text-gray-500">
              {stat.label}
            </p>
          </div>
          <div
            className={`absolute top-0 right-0 p-4 opacity-10 ${stat.color}`}
          >
            <stat.icon size={40} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
