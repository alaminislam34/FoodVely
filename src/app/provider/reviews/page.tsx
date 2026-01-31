"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Star,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircleReply,
  X,
  Send,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

// --- Interfaces ---
interface Review {
  id: string;
  rating: { value: number; outOf: number };
  comment: string;
  customer: { id: string; name: string; avatar: string };
  product: { id: string; name: string; category: string };
  createdAt: string;
  reply?: string; // New field to track replies
}

export default function ReviewManage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // State for Reply Modal
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Using your provided JSON structure logic
        const response = await fetch("/reviews.json");
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // --- Reply Handler ---
  const handleSendReply = async () => {
    if (!selectedReview || !replyText.trim()) return;

    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === selectedReview.id ? { ...r, reply: replyText } : r,
        ),
      );
      setIsSubmitting(false);
      setSelectedReview(null);
      setReplyText("");
    }, 1000);
  };

  const processedReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        r.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating =
        ratingFilter === "All" ||
        Math.floor(r.rating.value).toString() === ratingFilter;
      return matchesSearch && matchesRating;
    });
  }, [reviews, searchQuery, ratingFilter]);

  const totalPages = Math.ceil(processedReviews.length / itemsPerPage);
  const currentReviews = processedReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-rose-500" size={40} />
        <p className="font-Sofia font-bold text-gray-400">Loading Reviews...</p>
      </div>
    );

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen pb-10 relative">
      <header>
        <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800">
          Reviews
        </h1>
        <p className="text-gray-500 font-medium">
          Engage with your customers' feedback.
        </p>
      </header>

      {/* Main Table Container */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 outline-none focus:ring-4 focus:ring-rose-500/10 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm font-bold text-gray-600 outline-none"
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 uppercase tracking-[0.2em] text-[10px] font-black text-gray-400">
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Product</th>
                <th className="px-6 py-5">Rating</th>
                <th className="px-6 py-5">Comment</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {currentReviews.map((review) => (
                  <motion.tr
                    key={review.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-rose-50 border relative overflow-hidden">
                          <Image
                            src={review.customer.avatar}
                            alt="User"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {review.customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-500">
                      {review.product.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 w-fit">
                        <Star
                          size={12}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span className="text-xs font-black text-amber-700">
                          {review.rating.value}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-400 italic truncate max-w-37.5">
                        "{review.comment}"
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {review.reply ? (
                        <span className="text-[9px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md uppercase border border-green-100 flex items-center gap-1 w-fit">
                          <CheckCircle2 size={10} /> Replied
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md uppercase border border-orange-100 w-fit">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setReplyText(review.reply || "");
                        }}
                        className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm group-hover:scale-110"
                      >
                        <MessageCircleReply size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination - Identical to Orders page */}
        <footer className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div className="text-sm text-gray-500 font-medium">
            Page <span className="text-gray-800 font-bold">{currentPage}</span>{" "}
            of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-20 hover:border-rose-500"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-20 hover:border-rose-500"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </footer>
      </div>

      {/* --- REPLY MODAL --- */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReview(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-Sofia font-bold text-gray-800">
                      Reply to Review
                    </h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      Customer: {selectedReview.customer.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-rose-50/50 rounded-2xl p-4 mb-6 border border-rose-100">
                  <p className="text-xs font-black text-rose-400 uppercase tracking-widest mb-2">
                    Customer's Comment
                  </p>
                  <p className="text-gray-700 italic text-sm">
                    "{selectedReview.comment}"
                  </p>
                </div>

                <textarea
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:ring-4 focus:ring-rose-500/10 transition-all resize-none h-32"
                  placeholder="Type your response here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={isSubmitting || !replyText.trim()}
                    className="flex-2 bg-gray-900 text-white rounded-2xl py-3 font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={16} /> Send Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
