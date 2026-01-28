"use client";

import { motion } from "motion/react";
import { ProductCard } from "../../../ui/Products";
import { Product } from "@/types/product";
import { useState } from "react";

const productData: Product[] = [
  {
    id: "p1",
    name: "Chicken Burger",
    slug: "chicken-burger",
    description: "Juicy grilled chicken burger with fresh lettuce and mayo",
    price: 250,
    discountPrice: 220,
    images: ["/images/food.png"],
    categoryId: "cat-burger",
    providerId: "res-1",
    status: "active",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-10"),
  },
  {
    id: "p2",
    name: "Beef Burger",
    slug: "beef-burger",
    description: "Classic beef burger with cheese and special sauce",
    price: 300,
    images: ["/images/food2.png"],
    categoryId: "cat-burger",
    providerId: "res-1",
    status: "active",
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-10"),
  },
  {
    id: "p3",
    name: "Chicken Pizza",
    slug: "chicken-pizza",
    description: "Cheesy chicken pizza with soft crust",
    price: 550,
    discountPrice: 500,
    images: ["/images/pizza.jpg"],
    categoryId: "cat-pizza",
    providerId: "res-2",
    status: "active",
    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-11"),
  },
  {
    id: "p4",
    name: "Beef Pizza",
    slug: "beef-pizza",
    description: "Loaded beef pizza with mozzarella cheese",
    price: 600,
    images: ["/images/pizza2.jpg"],
    categoryId: "cat-pizza",
    providerId: "res-2",
    status: "active",
    createdAt: new Date("2025-01-04"),
    updatedAt: new Date("2025-01-12"),
  },
  {
    id: "p5",
    name: "Chicken Fried Rice",
    slug: "chicken-fried-rice",
    description: "Fried rice with chicken and vegetables",
    price: 280,
    images: ["/images/food3.png"],
    categoryId: "cat-rice",
    providerId: "res-3",
    status: "active",
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-12"),
  },
  {
    id: "p6",
    name: "Beef Fried Rice",
    slug: "beef-fried-rice",
    description: "Spicy beef fried rice with fresh herbs",
    price: 320,
    images: ["/images/food4.png"],
    categoryId: "cat-rice",
    providerId: "res-3",
    status: "active",
    createdAt: new Date("2025-01-06"),
    updatedAt: new Date("2025-01-13"),
  },
  {
    id: "p7",
    name: "Chicken Biryani",
    slug: "chicken-biryani",
    description: "Traditional chicken biryani with aromatic rice",
    price: 350,
    discountPrice: 320,
    images: ["/images/Spaghetti.jpg"],
    categoryId: "cat-biryani",
    providerId: "res-4",
    status: "active",
    createdAt: new Date("2025-01-07"),
    updatedAt: new Date("2025-01-14"),
  },
  {
    id: "p8",
    name: "Beef Biryani",
    slug: "beef-biryani",
    description: "Slow-cooked beef biryani with rich spices",
    price: 400,
    images: ["/images/food5.png"],
    categoryId: "cat-biryani",
    providerId: "res-4",
    status: "active",
    createdAt: new Date("2025-01-08"),
    updatedAt: new Date("2025-01-14"),
  },
  {
    id: "p9",
    name: "Chicken Shawarma",
    slug: "chicken-shawarma",
    description: "Middle eastern chicken shawarma wrap",
    price: 200,
    images: ["/images/spicy.jpg"],
    categoryId: "cat-wrap",
    providerId: "res-5",
    status: "active",
    createdAt: new Date("2025-01-09"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "p10",
    name: "French Fries",
    slug: "french-fries",
    description: "Crispy golden french fries",
    price: 120,
    images: ["/images/food6.png"],
    categoryId: "cat-snacks",
    providerId: "res-5",
    status: "active",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "p11",
    name: "Chicken Sandwich",
    slug: "chicken-sandwich",
    description: "Toasted sandwich with chicken and cheese",
    price: 180,
    images: ["/images/spaghetti.png"],
    categoryId: "cat-sandwich",
    providerId: "res-6",
    status: "active",
    createdAt: new Date("2025-01-11"),
    updatedAt: new Date("2025-01-16"),
  },
  {
    id: "p12",
    name: "Chocolate Milkshake",
    slug: "chocolate-milkshake",
    description: "Cold chocolate milkshake with rich flavor",
    price: 150,
    images: ["/images/food.png"],
    categoryId: "cat-drinks",
    providerId: "res-6",
    status: "active",
    createdAt: new Date("2025-01-12"),
    updatedAt: new Date("2025-01-16"),
  },
];

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
  const [filtered, setFiltered] = useState<Product[]>(productData.slice(0, 8));
  const [activeFilter, setActiveFilter] = useState<"all" | "new" | "sales">(
    "all",
  );

  const handleFilterByNew = () => {
    setActiveFilter("new");
    const newProducts = [...productData].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setFiltered(newProducts.slice(0, 8));
  };

  const handleFilterByBestSales = () => {
    setActiveFilter("sales");
    const bestSales = [...productData]
      .sort((a, b) => {
        const discountA = a.discountPrice ? a.price - a.discountPrice : 0;
        const discountB = b.discountPrice ? b.price - b.discountPrice : 0;
        return discountB - discountA;
      })
      .slice(0, 8);
    setFiltered(bestSales);
  };

  const handleShowAll = () => {
    setActiveFilter("all");
    setFiltered(productData.slice(0, 8));
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
            className={`py-2 px-3 rounded-2xl text-sm shadow-xl border transition-all ${
              activeFilter === "all"
                ? "bg-rose-500 text-white border-rose-500"
                : "border-gray-100 hover:border-rose-500 bg-white"
            }`}
          >
            All
          </button>
          <button
            onClick={handleFilterByNew}
            className={`py-2 px-3 rounded-2xl text-sm shadow-xl border transition-all ${
              activeFilter === "new"
                ? "bg-rose-500 text-white border-rose-500"
                : "border-gray-100 hover:border-rose-500 bg-white"
            }`}
          >
            New Products
          </button>
          <button
            onClick={handleFilterByBestSales}
            className={`py-2 px-3 rounded-2xl text-sm shadow-xl border transition-all ${
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
