"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Edit2,
  Trash2,
  Package,
  Filter,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  MapPin,
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetch("/FoodProducts.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to load products", err));
  }, []);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category?.name).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const processedProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category?.name.toLowerCase().includes(lowerQuery),
      );
    }
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category?.name === selectedCategory);
    }
    if (stockFilter === "in-stock") {
      result = result.filter((p) => (p.availability?.stock ?? 0) > 0);
    } else if (stockFilter === "out-of-stock") {
      result = result.filter((p) => (p.availability?.stock ?? 0) === 0);
    }
    if (ratingFilter === "4.5+") {
      result = result.filter((p) => (p.rating?.average ?? 0) >= 4.5);
    } else if (ratingFilter === "4.0+") {
      result = result.filter((p) => (p.rating?.average ?? 0) >= 4.0);
    }
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
          return 0;
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

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = processedProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, stockFilter, ratingFilter, sortBy]);

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
          <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800">
            Inventory Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Tracking {products.length} menu items across{" "}
            {uniqueCategories.length - 1} categories.
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
              .reduce((acc, p) => acc + (p.rating?.totalReviews ?? 0), 0)
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
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 md:p-6 shadow-lg backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1">
              <p
                className={`text-2xl md:text-3xl font-bold font-Sofia ${stat.color}`}
              >
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

      {/* Main Container */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by product name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm font-medium text-gray-600 outline-none focus:border-rose-400"
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm font-medium text-gray-600 outline-none focus:border-rose-400"
            >
              <option value="all">Stock Status</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm font-medium text-gray-600 outline-none focus:border-rose-400"
            >
              <option value="all">All Ratings</option>
              <option value="4.5+">4.5+ Stars</option>
              <option value="4.0+">4.0+ Stars</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm font-medium text-gray-600 outline-none focus:border-rose-400"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {currentProducts.map((product, idx) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/80 transition-colors group"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-rose-100 to-orange-100 shrink-0 overflow-hidden border border-white shadow-sm">
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
                          <p className="text-sm font-bold text-gray-700">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">
                            by {product.provider?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100">
                        {product.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-sm font-bold text-gray-700 font-Sofia">
                        ${product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${product.availability?.stock > 5 ? "bg-green-500" : "bg-orange-500"}`}
                          />
                          <span className="text-sm font-bold text-gray-700">
                            {product.availability?.stock} Units
                          </span>
                        </div>
                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${product.availability?.stock > 5 ? "bg-green-400" : "bg-orange-400"}`}
                            style={{
                              width: `${Math.min(product.availability?.stock * 2, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400 mr-1"
                          />
                          <span className="text-sm font-bold text-yellow-700">
                            {product.rating.average}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          ({product.rating.totalReviews})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="p-2 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors">
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

        {/* Mobile View (Preserved but styled) */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4">
          <AnimatePresence mode="wait">
            {currentProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/50 rounded-2xl p-4 border border-white shadow-sm backdrop-blur-md"
              >
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
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
                        <h3 className="font-bold text-gray-800 truncate">
                          {product.name}
                        </h3>
                        <span className="text-[10px] font-bold text-rose-500 uppercase">
                          {product.category?.name}
                        </span>
                      </div>
                      <span className="font-Sofia font-bold text-gray-900">
                        ${product.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                        <Star
                          size={10}
                          className="fill-yellow-400 text-yellow-400 mr-1"
                        />
                        <span className="text-xs font-bold text-yellow-700">
                          {product.rating.average}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold ${product.availability?.stock > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {product.availability?.stock} in stock
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100/50">
                  <button className="flex-1 py-2 text-xs font-bold text-gray-600 bg-white rounded-xl border border-gray-100">
                    Edit
                  </button>
                  <button className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl">
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
          <p className="text-sm text-gray-500 font-medium">
            Showing{" "}
            <span className="text-gray-800 font-bold">{startIndex + 1}</span> to{" "}
            <span className="text-gray-800 font-bold">
              {Math.min(startIndex + itemsPerPage, processedProducts.length)}
            </span>{" "}
            of {processedProducts.length} items
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border border-gray-200 disabled:opacity-30 transition-all ${currentPage !== 1 ? "bg-white text-gray-700 hover:border-rose-500 shadow-sm" : "bg-transparent text-gray-300"}`}
            >
              <ChevronLeft size={18} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-rose-400"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl border border-gray-200 disabled:opacity-30 transition-all ${currentPage !== totalPages ? "bg-white text-gray-700 hover:border-rose-500 shadow-sm" : "bg-transparent text-gray-300"}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
