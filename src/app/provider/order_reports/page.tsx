"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Download,
  Filter,
  Monitor,
  Smartphone,
  Store,
} from "lucide-react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { providerApi } from "@/api/providerApi";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

type ReportOrder = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  status: string;
  estimatedMinutes: number;
  itemCount: number;
  paymentMethod: string;
  orderedAt: string;
};

const parseMinutes = (estimatedTime: string): number => {
  const value = Number(String(estimatedTime).replace(/[^0-9]/g, ""));
  return Number.isFinite(value) && value > 0 ? value : 20;
};

const normalizeOrders = (items: Record<string, unknown>[]): ReportOrder[] => {
  return items.map((item, index) => {
    const orderId = String(item.orderId ?? item.id ?? `ORD-${index + 1}`);
    const pricing = (item.pricing as Record<string, unknown> | undefined) ?? {};
    const delivery =
      (item.delivery as Record<string, unknown> | undefined) ?? {};
    const payment = (item.payment as Record<string, unknown> | undefined) ?? {};
    const timestamps =
      (item.timestamps as Record<string, unknown> | undefined) ?? {};
    const list = Array.isArray(item.items)
      ? (item.items as Record<string, unknown>[])
      : [];

    return {
      id: orderId,
      orderNumber: String(item.orderNumber ?? orderId),
      totalAmount: Number(pricing.totalAmount ?? pricing.total ?? 0),
      currency: String(pricing.currency ?? "BDT"),
      status: String(item.orderStatus ?? "pending").toLowerCase(),
      estimatedMinutes: parseMinutes(
        String(delivery.estimatedTime ?? "20 min"),
      ),
      itemCount: list.length,
      paymentMethod: String(payment.method ?? "unknown").toLowerCase(),
      orderedAt: String(
        timestamps.orderedAt ?? item.createdAt ?? new Date().toISOString(),
      ),
    };
  });
};

const buildOrderVolumeData = (orders: ReportOrder[]) => {
  const buckets: Record<string, number> = {
    "08:00": 0,
    "10:00": 0,
    "12:00": 0,
    "14:00": 0,
    "16:00": 0,
    "18:00": 0,
    "20:00": 0,
    "22:00": 0,
  };

  orders.forEach((order) => {
    const hour = new Date(order.orderedAt).getHours();
    if (hour < 9) buckets["08:00"] += 1;
    else if (hour < 11) buckets["10:00"] += 1;
    else if (hour < 13) buckets["12:00"] += 1;
    else if (hour < 15) buckets["14:00"] += 1;
    else if (hour < 17) buckets["16:00"] += 1;
    else if (hour < 19) buckets["18:00"] += 1;
    else if (hour < 21) buckets["20:00"] += 1;
    else buckets["22:00"] += 1;
  });

  return Object.entries(buckets).map(([time, count]) => ({
    time,
    orders: count,
  }));
};

const toPercent = (value: number, total: number) => {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
};

type ReportRange =
  | "Today"
  | "This Week"
  | "This Month"
  | "Last 30 Days"
  | "Custom";

const getRangeStart = (range: ReportRange) => {
  const now = new Date();

  if (range === "Today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (range === "This Week") {
    const start = new Date(now);
    const day = start.getDay();
    const diff = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (range === "This Month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const start = new Date(now);
  start.setDate(start.getDate() - 30);
  start.setHours(0, 0, 0, 0);
  return start;
};

const escapeCsv = (value: string | number) => {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export default function OrderReports() {
  const [orders, setOrders] = useState<ReportOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [reportRange, setReportRange] = useState<ReportRange>("This Week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const invalidCustomRange =
    reportRange === "Custom" &&
    Boolean(customFrom) &&
    Boolean(customTo) &&
    new Date(customFrom).getTime() > new Date(customTo).getTime();

  const loadOrders = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        const response = await providerApi.listOrders({ page: 1, limit: 500 });

        if (response.items.length > 0) {
          setOrders(
            normalizeOrders(
              response.items as unknown as Record<string, unknown>[],
            ),
          );
          setUsingFallback(false);
          return;
        }

        const fallbackRes = await fetch("/orders.json");
        const fallbackJson = await fallbackRes.json();
        const fallbackItems = Array.isArray(fallbackJson)
          ? fallbackJson
          : fallbackJson.orders || [];

        setOrders(normalizeOrders(fallbackItems as Record<string, unknown>[]));
        setUsingFallback(true);
      } catch {
        setError(
          "Failed to load order report data from API and fallback source.",
        );
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

  const rangeFilteredOrders = useMemo(() => {
    if (reportRange === "Custom") {
      if (invalidCustomRange) {
        return [];
      }

      return orders.filter((order) => {
        const orderedAt = new Date(order.orderedAt).getTime();

        const fromOk = customFrom
          ? orderedAt >= new Date(customFrom).setHours(0, 0, 0, 0)
          : true;
        const toOk = customTo
          ? orderedAt <= new Date(customTo).setHours(23, 59, 59, 999)
          : true;

        return fromOk && toOk;
      });
    }

    const start = getRangeStart(reportRange);
    return orders.filter((order) => new Date(order.orderedAt) >= start);
  }, [orders, reportRange, customFrom, customTo, invalidCustomRange]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return rangeFilteredOrders;
    return rangeFilteredOrders.filter((order) => order.status === statusFilter);
  }, [rangeFilteredOrders, statusFilter]);

  const handleExportCsv = () => {
    const headers = [
      "Order Number",
      "Ordered At",
      "Status",
      "Prep Minutes",
      "Items",
      "Amount",
      "Currency",
      "Payment Method",
    ];

    const rows = filteredOrders.map((order) => [
      order.orderNumber,
      new Date(order.orderedAt).toISOString(),
      order.status,
      order.estimatedMinutes,
      order.itemCount,
      order.totalAmount,
      order.currency,
      order.paymentMethod,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.setAttribute("download", `provider-order-report-${stamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter(
    (order) => order.status === "delivered" || order.status === "completed",
  ).length;
  const cancelledOrders = filteredOrders.filter(
    (order) => order.status === "cancelled" || order.status === "canceled",
  ).length;
  const completionRate = totalOrders
    ? ((completedOrders / totalOrders) * 100).toFixed(1)
    : "0.0";
  const avgPrep = totalOrders
    ? Math.round(
        filteredOrders.reduce((sum, order) => sum + order.estimatedMinutes, 0) /
          totalOrders,
      )
    : 0;

  const orderVolumeData = useMemo(
    () => buildOrderVolumeData(filteredOrders),
    [filteredOrders],
  );

  const sourceBreakdown = useMemo(() => {
    const mobile = filteredOrders.filter((order) =>
      /mobile|app|bkash|nagad|rocket/.test(order.paymentMethod),
    ).length;
    const website = filteredOrders.filter((order) =>
      /card|visa|master|web/.test(order.paymentMethod),
    ).length;
    const inStore = Math.max(totalOrders - mobile - website, 0);

    return [
      {
        label: "Mobile App",
        value: toPercent(mobile, totalOrders),
        icon: Smartphone,
        color: "text-rose-500",
      },
      {
        label: "Website",
        value: toPercent(website, totalOrders),
        icon: Monitor,
        color: "text-blue-500",
      },
      {
        label: "In-Store / QR",
        value: toPercent(inStore, totalOrders),
        icon: Store,
        color: "text-green-500",
      },
    ];
  }, [filteredOrders, totalOrders]);

  const tableRows = filteredOrders.slice(0, 8);

  if (loading) {
    return <TableSkeleton rows={8} columns={5} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => loadOrders("initial")} />;
  }

  return (
    <div className="space-y-8 min-h-screen pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800">
            Order Reports
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Analyze order flow and kitchen efficiency.
          </p>
          {usingFallback ? (
            <p className="text-xs text-amber-600 mt-2">
              Running in fallback mode using local data.
            </p>
          ) : null}
          {isRefreshing ? (
            <p className="text-xs text-blue-600 mt-1">
              Syncing latest report data...
            </p>
          ) : null}
        </motion.div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3">
            <Calendar size={16} className="text-gray-400" />
            <select
              value={reportRange}
              onChange={(event) =>
                setReportRange(event.target.value as ReportRange)
              }
              className="bg-transparent py-3 text-sm font-bold text-gray-600 outline-none"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 30 Days</option>
              <option>Custom</option>
            </select>
          </div>
          {reportRange === "Custom" ? (
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2">
              <input
                type="date"
                value={customFrom}
                onChange={(event) => setCustomFrom(event.target.value)}
                className="text-sm text-gray-600 bg-transparent outline-none"
                aria-label="From date"
              />
              <span className="text-gray-300">to</span>
              <input
                type="date"
                value={customTo}
                onChange={(event) => setCustomTo(event.target.value)}
                className="text-sm text-gray-600 bg-transparent outline-none"
                aria-label="To date"
              />
            </div>
          ) : null}
          {reportRange === "Custom" && invalidCustomRange ? (
            <p className="text-xs text-red-600 self-center">
              From date must be before To date.
            </p>
          ) : null}
          <button
            onClick={() => loadOrders("refresh")}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:border-rose-500 transition-all shadow-sm"
          >
            <Calendar size={18} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCsv}
            disabled={invalidCustomRange || filteredOrders.length === 0}
            className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all shadow-lg disabled:opacity-50"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Orders",
            value: totalOrders.toLocaleString(),
            trend: "+",
            icon: ShoppingBag,
            color: "text-rose-600",
          },
          {
            label: "Avg. Prep Time",
            value: `${avgPrep} min`,
            trend: "-",
            icon: Clock,
            color: "text-blue-600",
          },
          {
            label: "Completion Rate",
            value: `${completionRate}%`,
            trend: "+",
            icon: CheckCircle2,
            color: "text-green-600",
          },
          {
            label: "Cancellations",
            value: String(cancelledOrders),
            trend: "-",
            icon: XCircle,
            color: "text-orange-600",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/60 backdrop-blur-xl border border-white p-6 rounded-[2.5rem] shadow-xl group hover:shadow-2xl transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-700 mb-4">
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              {stat.label}
            </p>
            <div className="flex items-end justify-between mt-1">
              <h3 className={`text-2xl font-black font-Sofia ${stat.color}`}>
                {stat.value}
              </h3>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-500">
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 font-Sofia">
                Order Volume Heatmap
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Busiest hours of the day
              </p>
            </div>
          </div>

          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderVolumeData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 700, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 700, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900 rounded-[2.5rem] p-8 shadow-xl text-white"
        >
          <h3 className="text-xl font-bold font-Sofia mb-6">Order Sources</h3>
          <div className="space-y-8">
            {sourceBreakdown.map((source, i) => (
              <div key={source.label} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <source.icon size={18} className={source.color} />
                    <span className="text-sm font-bold">{source.label}</span>
                  </div>
                  <span className="text-sm font-black">{source.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${source.value}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className={`h-full rounded-full ${source.color.replace("text", "bg")}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-5 bg-white/5 rounded-4xl border border-white/10">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
              Insight
            </p>
            <p className="text-sm text-gray-300 italic">
              Based on recent data, mobile-originated payments dominate provider
              orders.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 font-Sofia">
            Order Status Log
          </h3>
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="delivered">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {tableRows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No report rows available"
              description="Try changing status filter or refresh the report data."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 uppercase tracking-[0.2em] text-[10px] font-black text-gray-400 border-b border-gray-100">
                  <th className="px-8 py-5">Order</th>
                  <th className="px-8 py-5">Prep Time</th>
                  <th className="px-8 py-5">Items</th>
                  <th className="px-8 py-5">Value</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tableRows.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-all">
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-800">
                        {row.orderNumber}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold">
                        {new Date(row.orderedAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                        <Clock size={14} className="text-gray-300" />
                        {row.estimatedMinutes} min
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-500">
                      {row.itemCount} items
                    </td>
                    <td className="px-8 py-5 font-black text-gray-800">
                      {row.totalAmount.toLocaleString()} {row.currency}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${
                          row.status === "delivered" ||
                          row.status === "completed"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : row.status === "cancelled" ||
                                row.status === "canceled"
                              ? "bg-rose-50 text-rose-600 border-rose-100"
                              : "bg-orange-50 text-orange-600 border-orange-100"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
