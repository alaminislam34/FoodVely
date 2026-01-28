"use client";

import { motion } from "motion/react";
import { ProductCard } from "../../../ui/Products";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function OurProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "new" | "sales">(
    "all",
  );

  useEffect(() => {
    fetch("/FoodProducts.json")
      .then((res) => res.json())
      .then((data) => {
        // Handle both array and object responses
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productsArray);
        setFiltered(productsArray.slice(0, 8));
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleFilterByNew = () => {
    setActiveFilter("new");
    const newProducts = [...products].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setFiltered(newProducts.slice(0, 8));
  };

  const handleFilterByBestSales = () => {
    setActiveFilter("sales");
    const bestSales = [...products]
      .filter(
        (product) =>
          product.isBestSeller || (product.rating?.totalReviews ?? 0) > 50,
      )
      .sort((a, b) => {
        const ratingA = a.rating?.average || 0;
        const ratingB = b.rating?.average || 0;
        return ratingB - ratingA;
      })
      .slice(0, 8);
    setFiltered(bestSales.length > 0 ? bestSales : products.slice(0, 8));
  };

  const handleShowAll = () => {
    setActiveFilter("all");
    setFiltered(products.slice(0, 8));
  };

  return (
    <section>
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-Sofia">
          List of Our Products
        </h1>
        <div className="flex flex-row gap-2 items-center">
          <button
            onClick={handleShowAll}
            className={`py-2 px-3 rounded-2xl shadow-[inset_0_2px_10px_0_rgba(0,0,0,0.25)] 
             hover:shadow-[0_8px_10px_0_rgba(0,0,0,0.3)] text-sm border transition-all ${
               activeFilter === "all"
                 ? "bg-rose-500 text-white border-rose-500"
                 : "border-gray-100 hover:border-rose-500 bg-white"
             }`}
          >
            All
          </button>
          <button
            onClick={handleFilterByNew}
            className={`py-2 px-3 rounded-2xl shadow-[inset_0_2px_10px_0_rgba(0,0,0,0.25)] 
             hover:shadow-[0_8px_10px_0_rgba(0,0,0,0.3)] text-sm border transition-all ${
               activeFilter === "new"
                 ? "bg-rose-500 text-white border-rose-500"
                 : "border-gray-100 hover:border-rose-500 bg-white"
             }`}
          >
            New Products
          </button>
          <button
            onClick={handleFilterByBestSales}
            className={`py-2 px-3 rounded-2xl shadow-[inset_0_2px_10px_0_rgba(0,0,0,0.25)] 
             hover:shadow-[0_8px_10px_0_rgba(0,0,0,0.3)] text-sm border transition-all ${
               activeFilter === "sales"
                 ? "bg-rose-500 text-white border-rose-500"
                 : "border-gray-100 hover:border-rose-500 bg-white"
             }`}
          >
            Best Sales
          </button>
        </div>
      </div>
      <motion.div
        key={activeFilter}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12"
      >
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </section>
  );
}
