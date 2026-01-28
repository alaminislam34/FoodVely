"use client";

import { motion } from "motion/react";

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardSkeletonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear" as const,
  },
};

export const ProductCardSkeleton = () => {
  return (
    <motion.div
      variants={cardSkeletonVariants}
      className="group relative flex flex-col bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/20 shadow-xl"
    >
      {/* Image Skeleton */}
      <div className="relative max-h-80 w-full rounded-3xl overflow-hidden mb-4 bg-gray-200">
        <motion.div
          {...shimmer}
          className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200"
          style={{
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Content Section */}
      <div className="px-2 space-y-3">
        {/* Title Skeleton */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 space-y-2">
            <motion.div
              {...shimmer}
              className="h-6 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4"
              style={{
                backgroundSize: "200% 100%",
              }}
            />
            <motion.div
              {...shimmer}
              className="h-4 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"
              style={{
                backgroundSize: "200% 100%",
              }}
            />
          </div>
          {/* Heart Button Skeleton */}
          <div className="w-10 h-10 rounded-full bg-gray-200">
            <motion.div
              {...shimmer}
              className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
              style={{
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        </div>

        {/* Price and Button Skeleton */}
        <div className="flex justify-between items-center mt-4 gap-2">
          <motion.div
            {...shimmer}
            className="h-8 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-20"
            style={{
              backgroundSize: "200% 100%",
            }}
          />
          <motion.div
            {...shimmer}
            className="h-10 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl flex-1"
            style={{
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const OurProductsSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <section>
      <div className="flex items-center justify-between">
        <motion.div
          {...shimmer}
          className="h-10 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/3"
          style={{
            backgroundSize: "200% 100%",
          }}
        />
        <div className="flex flex-row gap-2 items-center">
          <motion.div
            {...shimmer}
            className="h-10 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl w-20"
            style={{
              backgroundSize: "200% 100%",
            }}
          />
          <motion.div
            {...shimmer}
            className="h-10 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl w-24"
            style={{
              backgroundSize: "200% 100%",
            }}
          />
          <motion.div
            {...shimmer}
            className="h-10 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl w-24"
            style={{
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </div>

      <motion.div
        variants={skeletonVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12"
      >
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </motion.div>
    </section>
  );
};
