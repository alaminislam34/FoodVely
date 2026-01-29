"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Star,
  ShoppingBag,
  Clock,
  CheckCircle2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  MapPin,
  ExternalLink,
  Package,
  Trophy,
  TrendingUp,
  MessageSquare,
  Medal,
} from "lucide-react";
import { Provider } from "@/types/provider";

export default function BestSellersPage() {
  const [restaurants, setRestaurants] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("/Restaurants.json")
      .then((res) => res.json())
      .then((data) => setRestaurants(data));
  }, []);

  // --- TOP 5 LOGIC ---
  const rankings = useMemo(() => {
    if (restaurants.length === 0)
      return { topRated: [], topSellers: [], topReviewed: [], maxOrders: 0 };

    // Get Top 5 by Rating
    const topRated = [...restaurants]
      .sort((a, b) => b.rating.average - a.rating.average)
      .slice(0, 5)
      .map((r, index) => ({ id: r.id, rank: index + 1 }));

    // Get Top 5 by Orders (Sales)
    const topSellers = [...restaurants]
      .sort((a, b) => (b.stats?.totalOrders || 0) - (a.stats?.totalOrders || 0))
      .slice(0, 5)
      .map((r, index) => ({ id: r.id, rank: index + 1 }));

    // Get Top 5 by Reviews
    const topReviewed = [...restaurants]
      .sort((a, b) => b.rating.totalReviews - a.rating.totalReviews)
      .slice(0, 5)
      .map((r, index) => ({ id: r.id, rank: index + 1 }));

    const maxOrders = Math.max(
      ...restaurants.map((r) => r.stats?.totalOrders || 0),
    );

    return { topRated, topSellers, topReviewed, maxOrders };
  }, [restaurants]);

  const filteredRestaurants = restaurants.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : item.status.isActive.toString() === statusFilter;
    const matchesRating =
      ratingFilter === "all"
        ? true
        : item.rating.average >= parseFloat(ratingFilter);

    return matchesSearch && matchesStatus && matchesRating;
  });

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredRestaurants.slice(
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
            Top Restaurants
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Analyzing the performance of your top {restaurants.length}{" "}
            restaurant partners.
          </p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Partners",
            value: restaurants.length,
            color: "text-blue-600",
            icon: User,
          },
          {
            label: "Platform Orders",
            value: restaurants
              .reduce((s, r) => s + (r.stats?.totalOrders || 0), 0)
              .toLocaleString(),
            color: "text-orange-600",
            icon: ShoppingBag,
          },
          {
            label: "Avg Platform Rating",
            value: `${(restaurants.reduce((s, r) => s + r.rating.average, 0) / (restaurants.length || 1)).toFixed(1)} ★`,
            color: "text-rose-600",
            icon: Star,
          },
          {
            label: "Top Seller Volume",
            value: rankings.maxOrders.toLocaleString(),
            color: "text-green-600",
            icon: TrendingUp,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-6 shadow-lg backdrop-blur-xl"
          >
            <p className={`text-2xl font-bold font-Sofia ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <stat.icon
              size={40}
              className={`absolute -right-2 -bottom-2 opacity-5 ${stat.color}`}
            />
          </motion.div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search leaders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/60 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-gray-200 bg-white/60 text-gray-600 font-medium"
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase">
                  Restaurant & Rank
                </th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase">
                  Owner
                </th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase">
                  Reputation
                </th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase">
                  Sales Performance
                </th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {paginatedData.map((item, idx) => {
                  const sellerRank = rankings.topSellers.find(
                    (r) => r.id === item.id,
                  );
                  const ratedRank = rankings.topRated.find(
                    (r) => r.id === item.id,
                  );
                  const reviewRank = rankings.topReviewed.find(
                    (r) => r.id === item.id,
                  );

                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-white/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-rose-50 to-orange-50 shrink-0 flex items-center justify-center text-rose-500 font-bold border border-white shadow-sm">
                            {item.name.charAt(0)}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-700 flex items-center gap-1">
                              {item.name}
                              {item.status.isVerified && (
                                <CheckCircle2
                                  size={14}
                                  className="text-blue-500"
                                />
                              )}
                            </p>

                            {/* TOP 5 BADGES */}
                            <div className="flex flex-wrap gap-1">
                              {sellerRank && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-md text-[9px] font-black uppercase tracking-tighter border border-orange-200 shadow-sm">
                                  <TrendingUp size={10} /> #{sellerRank.rank}{" "}
                                  Seller
                                </span>
                              )}
                              {ratedRank && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-md text-[9px] font-black uppercase tracking-tighter border border-yellow-200 shadow-sm">
                                  <Trophy size={10} /> #{ratedRank.rank} Rated
                                </span>
                              )}
                              {reviewRank && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-tighter border border-blue-200 shadow-sm">
                                  <MessageSquare size={10} /> #{reviewRank.rank}{" "}
                                  Reviewed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-700">
                          {item.owner.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {item.owner.email}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center bg-yellow-50 w-fit px-2 py-1 rounded-lg border border-yellow-100">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400 mr-1"
                          />
                          <span className="text-sm font-bold text-yellow-700">
                            {item.rating.average}
                          </span>
                          <span className="text-[10px] text-yellow-600/60 ml-1">
                            ({item.rating.totalReviews})
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between max-w-30">
                            <p className="text-sm font-bold text-gray-700">
                              {item.stats?.totalOrders.toLocaleString()}
                            </p>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              Sells
                            </span>
                          </div>
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${((item.stats?.totalOrders || 0) / rankings.maxOrders) * 100}%`,
                              }}
                              className="h-full bg-linear-to-r from-orange-400 to-rose-500"
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-rose-500 transition-all">
                          <ExternalLink size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-20 hover:border-rose-300 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-20 hover:border-rose-300 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
