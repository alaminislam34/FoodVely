"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Package,
  Filter,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";

// --- Interface ---
interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  thumbnail: string;
  category: {
    name: string;
    slug: string;
  };
  provider: {
    name: string;
  };
  rating: {
    average: number;
    totalReviews: number;
  };
  availability: {
    stock: number;
    status: string;
    isAvailable: boolean;
  };
  foodInfo: {
    calories: number;
  };
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Filter & Sort State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("all"); // all, in-stock, out-of-stock
  const [ratingFilter, setRatingFilter] = useState("all"); // all, 4.5+, 4.0+
  const [sortBy, setSortBy] = useState("newest"); // newest, price-asc, price-desc, rating

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch("/FoodProducts.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to load products", err));
  }, []);

  // --- Derived Data: Extract Categories Dynamically ---
  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category?.name).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  // --- Core Logic: Filter -> Sort -> Paginate ---
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category?.name.toLowerCase().includes(lowerQuery),
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category?.name === selectedCategory);
    }

    // 3. Stock Filter
    if (stockFilter === "in-stock") {
      result = result.filter((p) => (p.availability?.stock ?? 0) > 0);
    } else if (stockFilter === "out-of-stock") {
      result = result.filter((p) => (p.availability?.stock ?? 0) === 0);
    }

    // 4. Rating Filter
    if (ratingFilter === "4.5+") {
      result = result.filter((p) => (p.rating?.average ?? 0) >= 4.5);
    } else if (ratingFilter === "4.0+") {
      result = result.filter((p) => (p.rating?.average ?? 0) >= 4.0);
    }

    // 5. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return (b.rating?.average ?? 0) - (a.rating?.average ?? 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0; // Keep original order (usually usually by ID or Date)
      }
    });

    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    stockFilter,
    ratingFilter,
    sortBy,
  ]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = processedProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, stockFilter, ratingFilter, sortBy]);

  // --- Analytics Stats ---
  const totalStock = products.reduce(
    (sum, p) => sum + (p.availability?.stock ?? 0),
    0,
  );
  const avgStock = products.length
    ? Math.floor(totalStock / products.length)
    : 0;
  const avgRating =
    products.reduce((acc, p) => acc + (p.rating?.average ?? 0), 0) /
    (products.length || 1);

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800 mb-2">
            Inventory & Menu
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your food items, stock levels, and pricing.
          </p>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            label: "Total Items",
            value: products.length,
            color: "text-rose-600",
            bg: "bg-rose-50/50",
          },
          {
            label: "Avg Stock",
            value: avgStock,
            color: "text-orange-600",
            bg: "bg-orange-50/50",
          },
          {
            label: "Total Reviews",
            value: products
              .reduce((acc, p) => acc + (p.rating?.totalReviews ?? 0), 0)
              .toLocaleString(),
            color: "text-blue-600",
            bg: "bg-blue-50/50",
          },
          {
            label: "Avg Rating",
            value: `${avgRating.toFixed(1)} ⭐`,
            color: "text-green-600",
            bg: "bg-green-50/50",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 md:p-6 shadow-lg backdrop-blur-xl"
          >
            <div
              className={`absolute top-0 right-0 p-4 opacity-10 ${stat.color}`}
            >
              <Package size={48} />
            </div>
            <p
              className={`text-2xl md:text-4xl font-bold font-Sofia ${stat.color} mb-1`}
            >
              {stat.value}
            </p>
            <p className="text-xs md:text-sm font-medium text-gray-600">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Glassy Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-white/60 bg-white/60 shadow-2xl backdrop-blur-2xl overflow-hidden"
      >
        {/* --- Toolbar: Search & Filters --- */}
        <div className="p-6 border-b border-gray-200/50 space-y-4">
          {/* Top Row: Search */}
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white/50 pl-11 pr-4 py-3 text-sm outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
            />
          </div>

          {/* Bottom Row: Filters (Responsive Grid) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-gray-600 outline-none focus:border-rose-400 focus:bg-white transition-all cursor-pointer"
              >
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Filter
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Stock Filter */}
            <div className="relative">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-gray-600 outline-none focus:border-rose-400 focus:bg-white transition-all cursor-pointer"
              >
                <option value="all">All Stock Status</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
              <CheckCircle2
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-gray-600 outline-none focus:border-rose-400 focus:bg-white transition-all cursor-pointer"
              >
                <option value="all">All Ratings</option>
                <option value="4.5+">4.5 Stars & up</option>
                <option value="4.0+">4.0 Stars & up</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                ★
              </span>
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm font-medium text-gray-600 outline-none focus:border-rose-400 focus:bg-white transition-all cursor-pointer"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
              </select>
              <SlidersHorizontal
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* --- Content Area --- */}
        <div className="relative min-h-100">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
            </div>
          ) : processedProducts.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-gray-50 p-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No products found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            <>
              {/* --- Desktop View: Table --- */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200/50 bg-gray-50/30 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    <AnimatePresence mode="wait">
                      {currentProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-white/60 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                {product.thumbnail && (
                                  <Image
                                    src={product.thumbnail}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  by {product.provider?.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                              {product.category?.name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-Sofia font-bold text-gray-900">
                              ${product.price}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {product.availability?.stock > 0 ? (
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                              )}
                              <span className="text-sm text-gray-600">
                                {product.availability?.stock} units
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <span className="text-yellow-400">★</span>
                              {product.rating?.average}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit2 size={16} />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* --- Mobile View: Cards --- */}
              <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                <AnimatePresence mode="wait">
                  {currentProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white/50 rounded-xl p-4 border border-gray-100 shadow-sm"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {product.thumbnail && (
                            <Image
                              src={product.thumbnail}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-900 truncate">
                                {product.name}
                              </h3>
                              <p className="text-xs text-gray-500 mb-1">
                                {product.category?.name}
                              </p>
                            </div>
                            <span className="font-Sofia font-bold text-rose-600">
                              ${product.price}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <span className="text-yellow-400">★</span>
                              {product.rating?.average}
                            </span>
                            <span className="w-px h-3 bg-gray-300" />
                            <span
                              className={
                                product.availability?.stock > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {product.availability?.stock > 0
                                ? "In Stock"
                                : "Out"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                        <button className="flex-1 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">
                          Edit
                        </button>
                        <button className="flex-1 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* --- Pagination Footer --- */}
        {processedProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-gray-200/50 bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, processedProducts.length)}
              </span>{" "}
              of <span className="font-medium">{processedProducts.length}</span>{" "}
              products
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
