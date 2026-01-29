"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Provider } from "@/types/provider";

export default function BestSellersPage() {
  const [restaurants, setRestaurants] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Simulate Fetching Data
  useEffect(() => {
    fetch("/Restaurants.json")
      .then((res) => res.json())
      .then((data) => setRestaurants(data));
  }, []);

  // Filtering Logic
  const filteredRestaurants = restaurants.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : item.status.isActive.toString() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredRestaurants.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Stats Calculations
  const totalOrders = restaurants.reduce(
    (sum, r) => sum + (r.stats?.totalOrders || 0),
    0,
  );
  const avgRating = (
    restaurants.reduce((sum, r) => sum + r.rating.average, 0) /
      restaurants.length || 0
  ).toFixed(1);

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
            Restaurant
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Managing {restaurants.length} active vendors and their performance.
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
            value: totalOrders.toLocaleString(),
            color: "text-orange-600",
            icon: ShoppingBag,
          },
          {
            label: "Avg Platform Rating",
            value: `${avgRating} ★`,
            color: "text-rose-600",
            icon: Star,
          },
          {
            label: "Active Now",
            value: restaurants.filter((r) => r.openingHours.isOpenNow).length,
            color: "text-green-600",
            icon: Clock,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 md:p-6 shadow-lg backdrop-blur-xl"
          >
            <div className="flex flex-col gap-2">
              <p className={`text-2xl font-bold font-Sofia ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            </div>
            <div
              className={`absolute top-0 right-0 p-4 opacity-10 ${stat.color}`}
            >
              <Package size={48} />
            </div>
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
            placeholder="Search by restaurant or owner name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/60 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none text-gray-600 font-medium"
          >
            <option value="all">All Status</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive</option>
          </select>
          <button className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Owner Info
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {paginatedData.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/80 transition-colors group"
                  >
                    {/* Restaurant Cell */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-2xl bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
                          {/* Replace with item.images.logo if available */}
                          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-rose-100 to-orange-100 text-xl font-bold text-rose-500">
                            {item.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 flex items-center gap-1">
                            {item.name}
                            {item.status.isVerified && (
                              <CheckCircle2
                                size={14}
                                className="text-blue-500"
                              />
                            )}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin size={10} /> {item.location.city}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Owner Cell */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-700">
                        {item.owner.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.owner.email}
                      </p>
                    </td>

                    {/* Rating Cell */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="font-bold text-gray-800">
                          {item.rating.average}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({item.rating.totalReviews})
                        </span>
                      </div>
                    </td>

                    {/* Performance Cell */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-800">
                          {item.stats?.totalOrders.toLocaleString()} Orders
                        </p>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: "70%" }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Cell */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          item.status.isActive
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status.isActive ? "Online" : "Offline"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-rose-500 transition-colors">
                          <ExternalLink size={18} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
          <p className="text-sm text-gray-500 font-medium">
            Showing{" "}
            <span className="text-gray-800 font-bold">{startIndex + 1}</span> to{" "}
            <span className="text-gray-800 font-bold">
              {Math.min(startIndex + itemsPerPage, filteredRestaurants.length)}
            </span>{" "}
            of {filteredRestaurants.length} restaurants
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border border-gray-200 disabled:opacity-30 transition-all ${currentPage !== 1 && "bg-rose-500 text-white hover:bg-rose-600"}`}
            >
              <ChevronLeft size={15} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-xl text-sm font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-rose-600 text-white shadow-lg"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-rose-500"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl border border-gray-200 disabled:opacity-30 transition-all ${currentPage !== totalPages && "bg-rose-500 text-white hover:bg-rose-600"}`}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
