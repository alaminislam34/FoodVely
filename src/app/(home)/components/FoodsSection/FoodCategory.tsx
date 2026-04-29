"use client";

import { useCategory } from "@/hooks/hooks/useCategory";
import { ICategory } from "@/hooks/services/category.service";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CategoryCard = ({ category }: { category: ICategory }) => {
  const route = useRouter();
  return (
    <motion.div
      onClick={() => route.push(`/menu?slug=${category.slug}`)}
      variants={cardVariants}
      className="group relative flex flex-col items-center justify-center bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl hover:shadow-rose-200/40 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
    >
      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
        <Image
          src={category.image}
          alt={category.title}
          width={100}
          height={100}
          className="p-4"
        />
      </div>
      <h3 className="text-lg font-Sofia font-bold text-gray-800 text-center">
        {category.title}
      </h3>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2.5rem]" />
    </motion.div>
  );
};

export default function FoodCategory() {
  const { categoriesForPublic } = useCategory();

  return (
    <section className="py-12 lg:py-16 mb-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-Sofia text-center">
          Our Top Category
        </h1>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4"
      >
        {categoriesForPublic.map((category: ICategory) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </motion.div>
    </section>
  );
}
