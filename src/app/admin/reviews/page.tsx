"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Trash2,
  Flag,
  Eye,
  MessageCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface Review {
  id: string;
  product: string;
  restaurant: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  reported: boolean;
}

export default function ReviewsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterReported, setFilterReported] = useState("all");

  const reviews: Review[] = [
    {
      id: "1",
      product: "Margherita Pizza",
      restaurant: "Italian Kitchen",
      author: "John Doe",
      rating: 5,
      comment:
        "Absolutely delicious! The pizza is fresh and perfectly cooked. Highly recommended!",
      date: "2024-01-25",
      helpful: 24,
      reported: false,
    },
    {
      id: "2",
      product: "Caesar Salad",
      restaurant: "Green Leaf Cafe",
      author: "Sarah Smith",
      rating: 4,
      comment:
        "Good quality salad, but took a bit longer than expected to arrive.",
      date: "2024-01-24",
      helpful: 12,
      reported: false,
    },
    {
      id: "3",
      product: "Burger",
      restaurant: "Burger House",
      author: "Mike Johnson",
      rating: 2,
      comment: "The burger was cold when it arrived. Very disappointed.",
      date: "2024-01-23",
      helpful: 8,
      reported: true,
    },
    {
      id: "4",
      product: "Pasta Carbonara",
      restaurant: "Italian Kitchen",
      author: "Emma Wilson",
      rating: 5,
      comment: "Authentic Italian taste! This is how real carbonara should be.",
      date: "2024-01-22",
      helpful: 31,
      reported: false,
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    const matchSearch =
      review.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRating =
      filterRating === "all" || review.rating === parseInt(filterRating);
    const matchReported =
      filterReported === "all" ||
      (filterReported === "reported" && review.reported) ||
      (filterReported === "normal" && !review.reported);
    return matchSearch && matchRating && matchReported;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-Sofia font-bold text-gray-800 mb-2">
          Reviews & Feedback
        </h1>
        <p className="text-gray-600">
          Monitor customer reviews, handle reported content, and manage ratings
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4"
      >
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search reviews by product or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rating
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterReported}
              onChange={(e) => setFilterReported(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">All Reviews</option>
              <option value="normal">Normal</option>
              <option value="reported">Reported</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all ${
              review.reported ? "border-red-300 bg-red-50" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-Sofia font-bold text-gray-800">
                    {review.product}
                  </h3>
                  {review.reported && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Flag size={14} />
                      Reported
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {review.restaurant} • By {review.author}
                </p>
              </div>
              <div className="text-right text-xs text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-3">{renderStars(review.rating)}</div>

            {/* Comment */}
            <p className="text-gray-700 mb-4">{review.comment}</p>

            {/* Helpful Count & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                  <ThumbsUp size={16} />
                  {review.helpful}
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
                  <ThumbsDown size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                  <Eye size={18} className="text-blue-600" />
                </button>
                {review.reported && (
                  <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                    <MessageCircle size={18} className="text-green-600" />
                  </button>
                )}
                <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredReviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-2xl border border-gray-200"
        >
          <p className="text-gray-600">No reviews found</p>
        </motion.div>
      )}
    </div>
  );
}
