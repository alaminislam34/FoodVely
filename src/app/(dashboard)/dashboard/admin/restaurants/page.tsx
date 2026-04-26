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
  Filter,
  User,
  MapPin,
  ExternalLink,
  Package,
} from "lucide-react";
import { Provider } from "@/types/provider";
import { adminApi } from "@/api/adminApi";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/AdminStates";
import { AdminPaginator } from "@/components/admin/AdminPaginator";
import { getApiErrorMessage } from "@/utils/apiError";
import { useAdminListControls } from "@/hooks/useAdminListControls";

export default function BestSellersPage() {
  const [restaurants, setRestaurants] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all"); // New State
  const [totalPages, setTotalPages] = useState(1);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const itemsPerPage = 10;
  const {
    searchInput,
    setSearchInput,
    debouncedSearch,
    page: currentPage,
    setPage: setCurrentPage,
    reloadKey,
    retry,
  } = useAdminListControls({ debounceMs: 450 });

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, ratingFilter]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);

        const { items, meta } = await adminApi.listRestaurantsPaged({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch || undefined,
          isActive:
            statusFilter === "all"
              ? undefined
              : statusFilter === "active"
                ? "true"
                : "false",
          minRating: ratingFilter === "all" ? undefined : Number(ratingFilter),
        });

        const mapped = items.map((item) => {
          const owner = (item.owner as Provider["owner"] | undefined) ?? {
            name: "Unknown Owner",
            phone: "",
            email: "",
          };

          return {
            id: String(item.id ?? ""),
            name: String(item.name ?? "Restaurant"),
            slug: String(item.slug ?? ""),
            description: String(item.description ?? ""),
            owner,
            location: (item.location as Provider["location"] | undefined) ?? {
              address: "",
              city: "Unknown",
              lat: 0,
              lng: 0,
            },
            categories: (item.categories as string[] | undefined) ?? [],
            images: (item.images as Provider["images"] | undefined) ?? {
              logo: "",
              cover: "",
            },
            rating: (item.rating as Provider["rating"] | undefined) ?? {
              average: 0,
              totalReviews: 0,
            },
            delivery: (item.delivery as Provider["delivery"] | undefined) ?? {
              isAvailable: false,
              deliveryTime: "",
              deliveryFee: 0,
              minimumOrder: 0,
            },
            openingHours: (item.openingHours as
              | Provider["openingHours"]
              | undefined) ?? {
              open: "",
              close: "",
              isOpenNow: false,
            },
            status: (item.status as Provider["status"] | undefined) ?? {
              isVerified: false,
              isActive: false,
              isSuspended: false,
            },
            stats: (item.stats as Provider["stats"] | undefined) ?? {
              totalFoods: 0,
              totalOrders: 0,
            },
            createdAt: String(item.createdAt ?? ""),
            updatedAt: String(item.updatedAt ?? ""),
          } as Provider;
        });

        setRestaurants(mapped);
        setTotalPages(Math.max(meta?.totalPages ?? 1, 1));
        setTotalRestaurants(meta?.total ?? mapped.length);
      } catch (fetchError) {
        setError(getApiErrorMessage(fetchError, "Failed to load restaurants"));
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [
    currentPage,
    debouncedSearch,
    itemsPerPage,
    ratingFilter,
    reloadKey,
    statusFilter,
  ]);

  // Stats
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
          <h1 className="text-3xl md:text-4xl  font-bold text-gray-700">
            Restaurants
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Managing {totalRestaurants} active vendors and their performance.
          </p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Partners",
            value: totalRestaurants,
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
              <p className={`text-2xl font-bold  ${stat.color}`}>
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
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by restaurant or owner..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/60 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-md focus:outline-none text-gray-600 font-medium cursor-pointer hover:border-rose-300 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive</option>
          </select>

          {/* New Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-md focus:outline-none text-gray-600 font-medium cursor-pointer hover:border-rose-300 transition-colors"
          >
            <option value="all">All Ratings</option>
            <option value="4.5">4.5+ Stars ★</option>
            <option value="4.0">4.0+ Stars ★</option>
            <option value="3.5">3.5+ Stars ★</option>
            <option value="3.0">3.0+ Stars ★</option>
          </select>

          <button className="p-3 bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl text-gray-600 hover:bg-rose-50 hover:text-rose-500 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-xl overflow-hidden">
        {loading ? (
          <AdminLoadingState label="Loading restaurants..." />
        ) : error ? (
          <AdminErrorState description={error} onAction={retry} />
        ) : restaurants.length === 0 ? (
          <AdminEmptyState
            title="No restaurants found"
            description="Try changing filters or search query."
          />
        ) : null}

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
                {restaurants.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/80 transition-colors group"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4">
                        <div className="relative w-11 h-11 rounded-2xl bg-linear-to-br from-rose-100 to-orange-100 shrink-0 flex items-center justify-center text-rose-500 font-bold border border-white shadow-sm">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-700 flex items-center gap-1">
                            {item.name}
                            {item.status.isVerified && (
                              <CheckCircle2
                                size={14}
                                className="text-blue-500"
                              />
                            )}
                          </p>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1 uppercase tracking-tight">
                            <MapPin size={10} /> {item.location.city}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <p className="text-sm font-semibold text-gray-700">
                        {item.owner.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.owner.email}
                      </p>
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400 mr-1"
                          />
                          <span className="text-sm font-bold text-yellow-700">
                            {item.rating.average}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          ({item.rating.totalReviews})
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-700">
                          {item.stats?.totalOrders.toLocaleString()} Orders
                        </p>
                        <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-orange-400 to-rose-500"
                            style={{ width: "75%" }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3">
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

                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="p-2 hover:bg-rose-50 rounded-xl text-gray-400 hover:text-rose-500 transition-colors">
                          <ExternalLink size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                          <MoreVertical size={16} />
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
            Showing page{" "}
            <span className="text-gray-800 font-bold">{currentPage}</span> of{" "}
            {totalPages}
          </p>
          <AdminPaginator
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
