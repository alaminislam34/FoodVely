"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Star,
  Trash2,
  ExternalLink,
  Filter,
  ArrowUpDown,
  Utensils,
  Calendar,
  Clock,
} from "lucide-react";
import { adminApi } from "@/api/adminApi";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/utils/apiError";
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from "@/components/admin/AdminStates";
import { AdminPaginator } from "@/components/admin/AdminPaginator";
import { useAdminListControls } from "@/hooks/useAdminListControls";

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
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 20;
  const {
    searchInput,
    setSearchInput,
    debouncedSearch,
    page: currentPage,
    setPage: setCurrentPage,
    reloadKey,
    retry,
  } = useAdminListControls({ debounceMs: 450 });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { items, meta } = await adminApi.listReviewsPaged({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch || undefined,
          minRating: ratingFilter !== "all" ? Number(ratingFilter) : undefined,
          sortBy,
        });

        const mapped: ReviewData[] = items.map((item) => {
          const ratingRaw = item.rating as
            | { value?: number; outOf?: number }
            | number
            | undefined;

          return {
            id: String(item.id ?? ""),
            rating: {
              value:
                typeof ratingRaw === "number"
                  ? ratingRaw
                  : Number(ratingRaw?.value ?? 0),
              outOf:
                typeof ratingRaw === "number"
                  ? 5
                  : Number(ratingRaw?.outOf ?? 5),
            },
            comment: String(item.comment ?? "No comment provided"),
            customer: {
              id: String((item.customer as { id?: string } | undefined)?.id ?? ""),
              name: String(
                (item.customer as { name?: string } | undefined)?.name ?? "Unknown Customer",
              ),
              avatar: String(
                (item.customer as { avatar?: string } | undefined)?.avatar ?? "",
              ),
            },
            restaurant: {
              id: String((item.restaurant as { id?: string } | undefined)?.id ?? ""),
              name: String(
                (item.restaurant as { name?: string } | undefined)?.name ?? "Unknown Restaurant",
              ),
            },
            product: {
              id: String((item.product as { id?: string } | undefined)?.id ?? ""),
              name: String(
                (item.product as { name?: string } | undefined)?.name ?? "Unknown Product",
              ),
              category: String(
                (item.product as { category?: string } | undefined)?.category ?? "general",
              ),
            },
            createdAt: String(item.createdAt ?? new Date().toISOString()),
          };
        });

        setReviews(mapped);
        setTotalPages(Number(meta?.totalPages ?? 1));
      } catch (error) {
        setError(getApiErrorMessage(error, "Error loading reviews"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [currentPage, debouncedSearch, ratingFilter, reloadKey, sortBy]);

  const handleDeleteReview = async (id: string) => {
    const prev = reviews;
    setReviews((current) => current.filter((review) => review.id !== id));
    try {
      await adminApi.deleteReview(id, "Removed by admin moderation");
      toast.success("Review deleted");
    } catch (error) {
      setReviews(prev);
      toast.error(getApiErrorMessage(error, "Failed to delete review"));
    }
  };

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

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
  }, [reviews, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, ratingFilter, sortBy]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredReviews;

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-700">
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
          <div className="p-6">
            <AdminLoadingState label="Loading reviews..." />
          </div>
        ) : error ? (
          <div className="p-6">
            <AdminErrorState
              description={error}
              onAction={retry}
            />
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
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-500 hover:shadow-md transition-all"
                          >
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
              {startIndex + paginatedData.length}
            </span>{" "}
            of {Math.max(filteredReviews.length, startIndex + paginatedData.length)} items
          </p>

          <AdminPaginator
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {!isLoading && filteredReviews.length === 0 && (
        <AdminEmptyState description="No reviews found matching your criteria." />
      )}
    </div>
  );
}
