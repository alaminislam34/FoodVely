"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Clock,
  Eye,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  Loader2,
  CheckCheck,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { providerApi } from "@/api/providerApi";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

// --- Updated Interface based on your JSON structure ---
interface Order {
  orderId: string;
  orderNumber: string;
  user: {
    name: string;
    phone: string;
    email: string;
  };
  items: Array<{
    foodId: string;
    name: string;
    thumbnail: string;
    quantity: number;
    totalPrice: number;
  }>;
  pricing: {
    totalAmount: number;
    currency: string;
  };
  payment: {
    method: string;
    status: string;
  };
  delivery: {
    address: string;
    city: string;
    estimatedTime: string;
  };
  orderStatus: string;
  timestamps: {
    orderedAt: string;
  };
}

const normalizeOrders = (items: Record<string, unknown>[]): Order[] => {
  return items.map((item) => {
    const user = (item.user as Record<string, unknown> | undefined) ?? {};
    const pricing = (item.pricing as Record<string, unknown> | undefined) ?? {};
    const payment = (item.payment as Record<string, unknown> | undefined) ?? {};
    const delivery =
      (item.delivery as Record<string, unknown> | undefined) ?? {};
    const timestamps =
      (item.timestamps as Record<string, unknown> | undefined) ?? {};
    const rawItems = Array.isArray(item.items)
      ? (item.items as Record<string, unknown>[])
      : [];

    return {
      orderId: String(item.orderId ?? item.id ?? ""),
      orderNumber: String(item.orderNumber ?? item.orderId ?? "N/A"),
      user: {
        name: String(user.name ?? "Unknown User"),
        phone: String(user.phone ?? ""),
        email: String(user.email ?? ""),
      },
      items: rawItems.map((row) => ({
        foodId: String(row.foodId ?? row.productId ?? ""),
        name: String(row.name ?? "Item"),
        thumbnail: String(row.thumbnail ?? "/images/food.png"),
        quantity: Number(row.quantity ?? 1),
        totalPrice: Number(row.totalPrice ?? 0),
      })),
      pricing: {
        totalAmount: Number(pricing.totalAmount ?? pricing.total ?? 0),
        currency: String(pricing.currency ?? "BDT"),
      },
      payment: {
        method: String(payment.method ?? "Unknown"),
        status: String(payment.status ?? "pending"),
      },
      delivery: {
        address: String(delivery.address ?? ""),
        city: String(delivery.city ?? "N/A"),
        estimatedTime: String(delivery.estimatedTime ?? "N/A"),
      },
      orderStatus: String(item.orderStatus ?? "pending"),
      timestamps: {
        orderedAt: String(
          timestamps.orderedAt ?? item.createdAt ?? new Date().toISOString(),
        ),
      },
    };
  });
};

export default function OrderManage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadOrders = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setError(null);

      try {
        const response = await providerApi.listOrders({ page: 1, limit: 200 });

        if (response.items.length > 0) {
          setOrders(
            normalizeOrders(
              response.items as unknown as Record<string, unknown>[],
            ),
          );
          setUsingFallback(false);
          return;
        }

        const fallbackResponse = await fetch("/orders.json");
        const fallbackData = await fallbackResponse.json();
        const orderList = Array.isArray(fallbackData)
          ? fallbackData
          : fallbackData.orders || [];

        setOrders(normalizeOrders(orderList as Record<string, unknown>[]));
        setUsingFallback(true);
      } catch {
        setError("Failed to load orders from API and fallback source.");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadOrders("initial");
  }, [loadOrders]);

  const markDelivered = async (order: Order) => {
    if (order.orderStatus.toLowerCase() === "delivered") {
      return;
    }

    setUpdatingOrderId(order.orderId);
    const previousOrders = orders;

    setOrders((prev) =>
      prev.map((row) =>
        row.orderId === order.orderId
          ? { ...row, orderStatus: "delivered" }
          : row,
      ),
    );

    try {
      await providerApi.updateOrderStatus(order.orderId, {
        status: "delivered",
      });
      toast.success(`Order ${order.orderNumber} marked as delivered`);
      await loadOrders("refresh");
    } catch {
      setOrders(previousOrders);
      toast.error("Could not update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const processedOrders = useMemo(() => {
    let result = [...orders];
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(lowerQuery) ||
          o.user.name.toLowerCase().includes(lowerQuery),
      );
    }
    if (statusFilter !== "All") {
      result = result.filter(
        (o) => o.orderStatus.toLowerCase() === statusFilter.toLowerCase(),
      );
    }
    return result;
  }, [orders, searchQuery, statusFilter]);

  const totalPages = Math.ceil(processedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = processedOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // --- ANALYTICS CALCULATION ---
  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      color: "text-rose-600",
      icon: ShoppingBag,
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.orderStatus === "delivered").length,
      color: "text-green-600",
      icon: CheckCircle2,
    },
    {
      label: "Revenue",
      value: `${orders.reduce((acc, o) => acc + o.pricing.totalAmount, 0).toLocaleString()} ৳`,
      color: "text-blue-600",
      icon: CreditCard,
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.orderStatus === "pending").length,
      color: "text-orange-600",
      icon: Clock,
    },
  ];

  if (loading) {
    return <TableSkeleton rows={6} columns={6} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => loadOrders("initial")} />;
  }

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800">
          Active Orders
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Real-time order tracking for FoodVally Kitchen.
        </p>
        {usingFallback ? (
          <p className="text-xs text-amber-600 mt-2">
            Running in fallback mode using local data.
          </p>
        ) : null}
        {isRefreshing ? (
          <p className="text-xs text-blue-600 mt-1">Syncing latest orders...</p>
        ) : null}
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-4 md:p-6 shadow-lg backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1">
              <p
                className={`text-xl md:text-2xl font-bold font-Sofia ${stat.color}`}
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
      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Order ID or Customer Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm font-bold text-gray-600 outline-none"
            >
              <option>All</option>
              <option>Delivered</option>
              <option>Pending</option>
              <option>Preparing</option>
            </select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Order / Date
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Customer
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Items
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Total Amount
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {currentOrders.map((order, idx) => (
                  <motion.tr
                    key={order.orderId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">
                        {order.orderNumber}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {new Date(
                          order.timestamps.orderedAt,
                        ).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-700">
                        {order.user.name}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <MapPin size={10} /> {order.delivery.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div
                            key={i}
                            className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm"
                          >
                            <Image
                              src={item.thumbnail}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[10px] font-bold text-rose-500 border-2 border-white">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-Sofia font-black text-gray-900">
                        {order.pricing.totalAmount} {order.pricing.currency}
                      </p>
                      <span className="text-[9px] font-bold text-green-500 uppercase px-1.5 py-0.5 bg-green-50 rounded-md border border-green-100">
                        {order.payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-xs ${
                          order.orderStatus === "delivered"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-orange-50 text-orange-600 border-orange-100"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2.5 hover:bg-rose-600 rounded-2xl text-gray-400 hover:text-white transition-all shadow-sm bg-white border border-gray-100 group-hover:scale-110">
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => markDelivered(order)}
                          disabled={
                            updatingOrderId === order.orderId ||
                            order.orderStatus.toLowerCase() === "delivered"
                          }
                          className="p-2.5 rounded-2xl text-gray-400 bg-white border border-gray-100 hover:bg-green-600 hover:text-white transition-all disabled:opacity-40"
                          title="Mark delivered"
                        >
                          {updatingOrderId === order.orderId ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <CheckCheck size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {currentOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white/70 backdrop-blur-md border border-white rounded-3xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                  {order.orderNumber}
                </span>
                <span className="text-[10px] font-bold text-gray-400 italic">
                  {order.delivery.estimatedTime}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">
                {order.user.name}
              </h3>
              <div className="flex justify-between items-end mt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    Total Bill
                  </span>
                  <span className="font-Sofia font-black text-gray-900 text-xl">
                    {order.pricing.totalAmount} ৳
                  </span>
                </div>
                <button className="bg-gray-900 text-white p-3 rounded-2xl shadow-lg">
                  <ExternalLink size={16} />
                </button>
              </div>
              <button
                onClick={() => markDelivered(order)}
                disabled={
                  updatingOrderId === order.orderId ||
                  order.orderStatus.toLowerCase() === "delivered"
                }
                className="mt-3 w-full py-2 text-xs font-bold rounded-xl bg-green-50 text-green-700 disabled:opacity-40"
              >
                {updatingOrderId === order.orderId
                  ? "Updating..."
                  : order.orderStatus.toLowerCase() === "delivered"
                    ? "Delivered"
                    : "Mark Delivered"}
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
          <div className="text-sm text-gray-500 font-medium">
            Showing{" "}
            <span className="text-gray-800 font-bold">
              {processedOrders.length > 0 ? startIndex + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="text-gray-800 font-bold">
              {Math.min(startIndex + itemsPerPage, processedOrders.length)}
            </span>{" "}
            of{" "}
            <span className="text-gray-800 font-bold">
              {processedOrders.length}
            </span>{" "}
            orders
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border border-gray-200 disabled:opacity-30 transition-all ${
                currentPage !== 1
                  ? "bg-white text-gray-700 hover:border-rose-500 shadow-sm active:scale-95"
                  : "bg-transparent text-gray-300"
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Logic to only show current, first, last, and neighboring pages if list is long
                if (
                  totalPages > 7 &&
                  pageNum !== 1 &&
                  pageNum !== totalPages &&
                  Math.abs(pageNum - currentPage) > 1
                ) {
                  if (Math.abs(pageNum - currentPage) === 2)
                    return (
                      <span key={i} className="text-gray-400">
                        ...
                      </span>
                    );
                  return null;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                      currentPage === pageNum
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-200 scale-105"
                        : "bg-white border border-gray-200 text-gray-500 hover:border-rose-400 hover:text-rose-500"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-2 rounded-xl border border-gray-200 disabled:opacity-30 transition-all ${
                currentPage !== totalPages && totalPages !== 0
                  ? "bg-white text-gray-700 hover:border-rose-500 shadow-sm active:scale-95"
                  : "bg-transparent text-gray-300"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {!loading && currentOrders.length === 0 ? (
          <div className="p-6 border-t border-gray-100">
            <EmptyState
              title="No orders found"
              description="Try changing filters or check again after a few minutes."
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
