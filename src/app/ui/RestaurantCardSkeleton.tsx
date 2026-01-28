"use client";

import { motion } from "motion/react";

export default function RestaurantCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/20 shadow-xl"
    >
      {/* Cover Image Skeleton */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative aspect-4/3 w-full rounded-3xl overflow-hidden mb-4 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200"
      />

      {/* Content */}
      <div className="px-2 flex flex-col gap-3">
        {/* Name & Rating Skeleton */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-6 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 mb-2"
            />
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-4 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/2"
            />
          </div>

          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-7 w-14 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full shrink-0 ml-2"
          />
        </div>

        {/* Categories Skeleton */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              className="h-6 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-20"
            />
          ))}
        </div>

        {/* Delivery Info Skeleton */}
        <div className="flex justify-between items-center mt-2">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-4 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24"
          />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-4 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-28"
          />
        </div>

        {/* Action Button Skeleton */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-3 h-11 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl"
        />
      </div>
    </motion.div>
  );
}
