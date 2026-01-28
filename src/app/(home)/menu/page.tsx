"use client";

import { motion } from "motion/react";
import { Product } from "@/types/product";
import { useState, useMemo } from "react";
import { ProductCard } from "@/app/ui/Products";
import { Search, ChevronDown, X } from "lucide-react";

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

const categories = [
  { id: "cat-burger", name: "Burgers", icon: "🍔" },
  { id: "cat-pizza", name: "Pizza", icon: "🍕" },
  { id: "cat-rice", name: "Rice Bowls", icon: "🍚" },
  { id: "cat-biryani", name: "Biryani", icon: "🍛" },
  { id: "cat-wrap", name: "Wraps", icon: "🌯" },
  { id: "cat-sandwich", name: "Sandwich", icon: "🥪" },
  { id: "cat-snacks", name: "Snacks", icon: "🍟" },
  { id: "cat-drinks", name: "Drinks", icon: "🥤" },
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

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "newest">(
    "newest",
  );
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    let result = productData;

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    // Filter by price range
    result = result.filter((p) => {
      const displayPrice = p.discountPrice || p.price;
      return displayPrice >= priceRange[0] && displayPrice <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
        );
        break;
      case "price-high":
        result.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
        );
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, 1000]);
    setSortBy("newest");
  };

  return (
    <section className="max-w-screen-2xl mx-auto w-11/12 mt-16 mb-16">
      {/* Top Search and Sort Bar */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-Sofia mb-12 lg:mb-20 text-center">
          Our Menu
        </h1>
      </div>

      <div className="flex gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-full md:w-64 lg:w-72`}
        >
          <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-xl sticky top-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-Sofia font-bold text-gray-800">
                Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
              >
                <X size={14} /> Clear
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-Sofia font-bold text-gray-800 mb-3">
                Category
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedCategory === ""
                      ? "bg-rose-500 text-white"
                      : "hover:bg-gray-100/50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      selectedCategory === cat.id
                        ? "bg-rose-500 text-white"
                        : "hover:bg-gray-100/50"
                    }`}
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h4 className="font-Sofia font-bold text-gray-800 mb-3">
                Price Range
              </h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>-</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              <span className="font-Sofia font-bold text-gray-800">
                {filtered.length}
              </span>{" "}
              products found
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-12">
            {/* Search Bar */}
            <div className=" w-full">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "price-low" | "price-high" | "newest",
                )
              }
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-700 font-Sofia"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          <motion.div
            key={`${searchQuery}-${selectedCategory}-${priceRange[0]}-${priceRange[1]}-${sortBy}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <p className="text-xl text-gray-500 font-Sofia">
                No products found
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
