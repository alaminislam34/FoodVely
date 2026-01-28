"use client";

import { motion } from "motion/react";
import { Product } from "@/types/product";
import { useState, useMemo } from "react";
import { ProductCard } from "@/app/ui/Products";
import { Search, X, Filter, Sliders } from "lucide-react";

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
  const [showFilters, setShowFilters] = useState(false);

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
    <section className="min-h-screen w-full ">
      <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12 lg:mb-16 text-center"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-Sofia bg-linear-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent mb-3">
            Our Menu
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover our delicious selection of fresh meals
          </p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <span className="bg-rose-100 text-rose-500 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {filtered.length} Items
            </span>
          </div>
        </motion.div>

        {/* Mobile Filter Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden w-full mb-6 flex items-center justify-center gap-2 bg-linear-to-r from-rose-500 to-orange-500 text-white py-3 rounded-xl font-Sofia font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          <Sliders size={20} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </motion.button>

        <div className="flex gap-4 lg:gap-8">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-64 lg:w-72 shrink-0`}
          >
            <div className="sticky top-20 bg-linear-to-b from-white/80 to-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-rose-500" />
                  <h3 className="text-lg font-Sofia font-bold text-gray-800">
                    Filters
                  </h3>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                  title="Clear all filters"
                >
                  <X size={14} /> Reset
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-Sofia font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-rose-500">📂</span> Category
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${
                      selectedCategory === ""
                        ? "bg-linear-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100/50"
                    }`}
                  >
                    All Categories
                  </motion.button>
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 font-medium text-sm ${
                        selectedCategory === cat.id
                          ? "bg-linear-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100/50"
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span> {cat.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="pb-8 border-b border-gray-200">
                <h4 className="font-Sofia font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-rose-500">💰</span> Price Range
                </h4>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">
                        Min: ${priceRange[0]}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            parseInt(e.target.value),
                            priceRange[1],
                          ])
                        }
                        className="w-full h-2 bg-linear-to-r from-rose-200 to-orange-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600">
                        Max: ${priceRange[1]}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full h-2 bg-linear-to-r from-rose-200 to-orange-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>
                  </div>
                  <div className="bg-linear-to-r from-rose-50 to-orange-50 rounded-xl p-3 border border-rose-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 font-semibold">
                        Price Range
                      </span>
                      <span className="text-sm font-bold text-rose-600">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-8 bg-linear-to-r from-rose-100 to-orange-100 rounded-xl p-4 border border-rose-200">
                <p className="text-sm text-gray-700">
                  <span className="font-Sofia font-bold text-rose-600 text-lg">
                    {filtered.length}
                  </span>{" "}
                  <span className="font-medium">products found</span>
                </p>
              </div>
            </div>
          </motion.aside>

          {/* Products Section */}
          <div className="flex-1 w-full">
            {/* Search and Sort Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 sm:mb-12"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative group flex items-center justify-center">
                  <Search
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 z-10 group-focus-within:text-rose-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search delicious meals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 md;py-3 rounded-2xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all placeholder:text-gray-400 text-gray-800 text-sm"
                  />
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "price-low" | "price-high" | "newest",
                    )
                  }
                  className="px-6 py-2 md;py-3 rounded-2xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 font-Sofia font-semibold transition-all cursor-pointer"
                >
                  <option value="newest">🆕 Newest</option>
                  <option value="price-low">💵 Price: Low to High</option>
                  <option value="price-high">💰 Price: High to Low</option>
                </select>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              key={`${searchQuery}-${selectedCategory}-${priceRange[0]}-${priceRange[1]}-${sortBy}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            >
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-6 text-6xl">🍽️</div>
                <h3 className="text-2xl sm:text-3xl font-Sofia font-bold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base mb-6">
                  Try adjusting your filters or search terms
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-xl font-Sofia font-semibold hover:shadow-lg transition-shadow"
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
