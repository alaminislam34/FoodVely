"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Star,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Utensils,
  Calendar,
  Clock,
  Loader2,
  MessageSquare,
} from "lucide-react";

interface ReviewData {
  id: string;
  rating: { value: number; outOf: number };
  comment: string;
  customer: {
    id: string;
    name: string;
    avatar: string;
  };
  restaurant: {
    id: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
    category: string;
  };
  createdAt: string;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/reviews.json");
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    let result = reviews.filter((item) => {
      const matchesSearch =
        item.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurant.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.comment.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRating =
        ratingFilter === "all"
          ? true
          : item.rating.value >= parseFloat(ratingFilter);

      return matchesSearch && matchesRating;
    });

    return result.sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortBy === "highest") return b.rating.value - a.rating.value;
      if (sortBy === "lowest") return a.rating.value - b.rating.value;
      return 0;
    });
  }, [reviews, searchQuery, ratingFilter, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter, sortBy]);

  // --- Pagination Logic ---
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-700">
            Reviews & Feedback
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Analyzing customer sentiment and marketplace feedback.
          </p>
        </div>
      </motion.div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/60 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all backdrop-blur-md"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-white/60 px-3 rounded-2xl border border-gray-200 backdrop-blur-md">
            <Filter size={16} className="text-gray-400" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="py-3 bg-transparent text-gray-600 font-medium outline-none text-sm cursor-pointer"
            >
              <option value="all">Min Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.0">3.0+ Stars</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white/60 px-3 rounded-2xl border border-gray-200 backdrop-blur-md">
            <ArrowUpDown size={16} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-3 bg-transparent text-gray-600 font-medium outline-none text-sm cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Top Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-xl overflow-hidden relative">
        {isLoading ? (
          <div className="py-40 flex items-center justify-center">
            <Loader2 className="animate-spin text-rose-500" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Product Info</th>
                  <th className="px-6 py-5">Review</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence mode="popLayout">
                  {paginatedData.map((review, idx) => (
                    <motion.tr
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-white/80 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-rose-50 to-orange-50 border border-white shadow-sm flex items-center justify-center text-rose-500 font-bold overflow-hidden shrink-0">
                            {review.customer.avatar ? (
                              <img
                                src={review.customer.avatar}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              review.customer.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-700">
                              {review.customer.name}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              ID: {review.customer.id.split("_")[1]}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-700">
                            {review.product.name}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Utensils size={12} className="text-gray-300" />{" "}
                            {review.restaurant.name}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="max-w-62.5 space-y-2">
                          <div className="flex items-center bg-yellow-400/10 w-fit px-2 py-0.5 rounded-lg border border-yellow-200">
                            <Star
                              size={10}
                              className="fill-yellow-500 text-yellow-500 mr-1"
                            />
                            <span className="text-xs font-black text-yellow-700">
                              {review.rating.value}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 italic leading-relaxed">
                            "{review.comment}"
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[11px] text-gray-400 font-medium space-y-1">
                          <p className="flex items-center gap-1 text-gray-600">
                            <Calendar size={12} className="text-rose-400" />{" "}
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                          <p className="flex items-center gap-1 opacity-60">
                            <Clock size={12} />{" "}
                            {new Date(review.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-500 hover:shadow-md transition-all">
                            <ExternalLink size={16} />
                          </button>
                          <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-500 hover:shadow-md transition-all">
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
        )}

        {/* --- Pagination Footer (Updated Design) --- */}
        <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
          <p className="text-sm text-gray-500 font-medium">
            Showing{" "}
            <span className="text-gray-800 font-bold">
              {filteredReviews.length > 0 ? startIndex + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="text-gray-800 font-bold">
              {Math.min(startIndex + itemsPerPage, filteredReviews.length)}
            </span>{" "}
            of {filteredReviews.length} items
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className={`p-2 rounded-xl border border-gray-200 disabled:opacity-30 transition-all ${
                currentPage !== 1
                  ? "bg-white text-gray-700 hover:border-rose-500 shadow-sm"
                  : "bg-transparent text-gray-300"
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Generated Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-rose-400 hover:text-rose-600 shadow-sm"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              className={`p-2 rounded-xl border border-gray-200 disabled:opacity-30 transition-all ${
                currentPage !== totalPages
                  ? "bg-white text-gray-700 hover:border-rose-500 shadow-sm"
                  : "bg-transparent text-gray-300"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {!isLoading && filteredReviews.length === 0 && (
        <div className="py-20 text-center">
          <MessageSquare className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400 font-medium">
            No reviews found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
