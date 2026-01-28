"use client";

import { motion } from "motion/react";

export default function BlogCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-md overflow-hidden"
    >
      {/* Image Skeleton */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative aspect-video w-full bg-linear-to-r from-gray-200 via-gray-300 to-gray-200"
      />

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col gap-4">
        {/* Title Skeleton */}
        <div>
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-6 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 mb-2"
          />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
            className="h-4 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-full"
          />
        </div>

        {/* Meta Info Skeleton */}
        <div className="space-y-2 border-t border-gray-200 pt-3">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            className="h-4 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"
          />

          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="h-4 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/3"
          />

          {/* Tags Skeleton */}
          <div className="flex gap-2 mt-2">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                className="h-6 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-16"
              />
            ))}
          </div>
        </div>

        {/* Button Skeleton */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
          className="mt-4 h-10 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
        />
      </div>
    </motion.div>
  );
}
