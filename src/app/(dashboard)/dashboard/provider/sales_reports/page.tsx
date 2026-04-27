"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Download,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  CalendarDays,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { providerApi } from "@/api/providerApi";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { ProviderReportsEmptyState } from "@/components/provider/ProviderEmptyStates";

type SalesOrder = {
  id: string;
  orderNumber: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  orderedAt: string;
};

type ReportRange = "Today" | "This Week" | "This Month" | "Custom";

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

  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const escapeCsv = (value: string | number) => {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const normalizeSalesOrders = (
  items: Record<string, unknown>[],
): SalesOrder[] => {
  return items.map((item, index) => {
    const orderId = String(item.orderId ?? item.id ?? `TRX-${index + 1}`);
    const pricing = (item.pricing as Record<string, unknown> | undefined) ?? {};
    const payment = (item.payment as Record<string, unknown> | undefined) ?? {};
    const timestamps =
      (item.timestamps as Record<string, unknown> | undefined) ?? {};

    return {
      id: orderId,
      orderNumber: String(item.orderNumber ?? orderId),
      amount: Number(pricing.totalAmount ?? pricing.total ?? 0),
      currency: String(pricing.currency ?? "BDT"),
      method: String(payment.method ?? "unknown"),
      status: String(item.orderStatus ?? payment.status ?? "pending"),
      orderedAt: String(
        timestamps.orderedAt ?? item.createdAt ?? new Date().toISOString(),
      ),
    };
  });
};

const methodLabel = (method: string) => {
  const text = method.toLowerCase();
  if (/bkash|nagad|rocket|digital|wallet/.test(text)) return "Digital Pay";
  if (/cash/.test(text)) return "Cash";
  if (/card|visa|master/.test(text)) return "Card";
  return "Other";
};

export default function SalesReport() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [reportRange, setReportRange] = useState<ReportRange>("This Month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const invalidCustomRange =
    reportRange === "Custom" &&
    Boolean(customFrom) &&
    Boolean(customTo) &&
    new Date(customFrom).getTime() > new Date(customTo).getTime();

  const loadData = useCallback(
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
            normalizeSalesOrders(
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

        setOrders(
          normalizeSalesOrders(fallbackItems as Record<string, unknown>[]),
        );
        setUsingFallback(true);
      } catch {
        setError(
          "Failed to load sales report data from API and fallback source.",
        );
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadData("initial");
  }, [loadData]);

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

  const completedOrders = useMemo(
    () =>
      rangeFilteredOrders.filter((order) => {
        const status = order.status.toLowerCase();
        return status === "delivered" || status === "completed";
      }),
    [rangeFilteredOrders],
  );

  const monthlySales = useMemo(() => {
    const map = new Map<string, number>();

    completedOrders.forEach((order) => {
      const date = new Date(order.orderedAt);
      const month = date.toLocaleString("en-US", { month: "short" });
      map.set(month, (map.get(month) ?? 0) + order.amount);
    });

    return Array.from(map.entries()).map(([month, total]) => ({
      month,
      total,
    }));
  }, [completedOrders]);

  const paymentMethods = useMemo(() => {
    const groups: Record<string, number> = {
      "Digital Pay": 0,
      Cash: 0,
      Card: 0,
      Other: 0,
    };

    completedOrders.forEach((order) => {
      groups[methodLabel(order.method)] += order.amount;
    });

    const total = Object.values(groups).reduce((sum, value) => sum + value, 0);

    return [
      { name: "Digital Pay", color: "#e11d48" },
      { name: "Cash", color: "#10b981" },
      { name: "Card", color: "#3b82f6" },
      { name: "Other", color: "#64748b" },
    ].map((row) => ({
      ...row,
      value: total > 0 ? Math.round((groups[row.name] / total) * 100) : 0,
    }));
  }, [completedOrders]);

  const gross = completedOrders.reduce((sum, order) => sum + order.amount, 0);
  const tax = gross * 0.05;
  const net = gross - tax;

  const recentTransactions = completedOrders
    .slice()
    .sort(
      (a, b) =>
        new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime(),
    )
    .slice(0, 8);

  const latestPoint = monthlySales[monthlySales.length - 1];

  const handleExportCsv = () => {
    const headers = [
      "Order Number",
      "Ordered At",
      "Method",
      "Status",
      "Amount",
      "Tax",
      "Net",
      "Currency",
    ];

    const rows = completedOrders.map((row) => {
      const taxAmount = row.amount * 0.05;
      const netAmount = row.amount - taxAmount;

      return [
        row.orderNumber,
        new Date(row.orderedAt).toISOString(),
        methodLabel(row.method),
        row.status,
        row.amount,
        Number(taxAmount.toFixed(2)),
        Number(netAmount.toFixed(2)),
        row.currency,
      ];
    });

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.setAttribute("download", `provider-sales-report-${stamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <TableSkeleton rows={8} columns={6} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => loadData("initial")} />;
  }

  return (
    <div className="space-y-8 min-h-screen pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-4xl  font-bold text-gray-800">
            Sales Report
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Detailed analysis of your restaurant revenue.
          </p>
          {usingFallback ? (
            <p className="text-xs text-amber-600 mt-2">
              Running in fallback mode using local data.
            </p>
          ) : null}
          {isRefreshing ? (
            <p className="text-xs text-blue-600 mt-1">
              Syncing latest sales data...
            </p>
          ) : null}
        </motion.div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:border-rose-500 transition-all shadow-sm">
            <Printer size={18} />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={handleExportCsv}
            disabled={invalidCustomRange || completedOrders.length === 0}
            className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all shadow-lg disabled:opacity-50"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => loadData("refresh")}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:border-rose-500 transition-all shadow-sm"
          >
            <CalendarDays size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-800 ">Revenue Growth</h3>
            <div className="flex items-center gap-2 text-xs font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
              <TrendingUp size={14} />
              {latestPoint
                ? `${latestPoint.total.toLocaleString()} BDT latest`
                : "No trend data"}
            </div>
          </div>

          {monthlySales.length === 0 ? (
            <ProviderReportsEmptyState
              title="No revenue trend yet"
              description="Completed orders will appear here once transactions start coming in."
              actionLabel="Open Order Reports"
              actionHref="/dashboard/provider/order_reports"
            />
          ) : (
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="month"
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
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "15px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="total" radius={[10, 10, 0, 0]}>
                    {monthlySales.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === monthlySales.length - 1
                            ? "#e11d48"
                            : "#f43f5e30"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-800  mb-2">Payment Mix</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">
            Distribution by channel
          </p>

          <div className="h-50 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-gray-800">100%</span>
              <span className="text-[10px] text-gray-400 font-bold">TOTAL</span>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {paymentMethods.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-bold text-gray-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-black text-gray-800">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 ">
              Recent Transactions
            </h3>
            <p className="text-sm text-gray-400 font-medium">
              Detailed breakdown of recent completed orders.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <CalendarDays size={18} className="text-gray-400 ml-2" />
            <select
              value={reportRange}
              onChange={(event) =>
                setReportRange(event.target.value as ReportRange)
              }
              className="bg-transparent text-sm font-bold text-gray-600 outline-none pr-4 py-1"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Custom</option>
            </select>
            {reportRange === "Custom" ? (
              <>
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
              </>
            ) : null}
            {reportRange === "Custom" && invalidCustomRange ? (
              <span className="text-xs text-red-600">
                From date must be before To date.
              </span>
            ) : null}
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-6">
            <ProviderReportsEmptyState
              title="No transactions available"
              description="Completed orders will appear as transactions in this report."
              actionLabel="Open Order Reports"
              actionHref="/dashboard/provider/order_reports"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 uppercase tracking-[0.2em] text-[10px] font-black text-gray-400 border-b border-gray-100">
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Method</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Tax (5%)</th>
                  <th className="px-8 py-5">Net Profit</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map((trx) => {
                  const taxAmount = trx.amount * 0.05;
                  const netAmount = trx.amount - taxAmount;
                  const label = methodLabel(trx.method);
                  const icon =
                    label === "Digital Pay"
                      ? Smartphone
                      : label === "Cash"
                        ? Banknote
                        : CreditCard;

                  return (
                    <tr
                      key={trx.id}
                      className="hover:bg-white/80 transition-all group"
                    >
                      <td className="px-8 py-5 font-bold text-gray-800">
                        {trx.orderNumber}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                          {icon({ size: 16, className: "text-gray-400" })}
                          {label}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-gray-800">
                        {trx.amount.toLocaleString()} {trx.currency}
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-gray-400">
                        {taxAmount.toFixed(2)} {trx.currency}
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-green-600">
                          +{netAmount.toFixed(2)} {trx.currency}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span
                          className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase border ${
                            trx.status.toLowerCase() === "delivered" ||
                            trx.status.toLowerCase() === "completed"
                              ? "bg-green-50 text-green-600 border-green-100"
                              : "bg-orange-50 text-orange-600 border-orange-100"
                          }`}
                        >
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-8 bg-gray-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Total Gross
              </p>
              <p className="text-xl font-bold ">{gross.toLocaleString()} BDT</p>
            </div>
            <div className="w-px h-10 bg-white/10 hidden md:block" />
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Estimated Tax
              </p>
              <p className="text-xl font-bold ">{tax.toFixed(2)} BDT</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">
              Total Net Income
            </p>
            <p className="text-3xl font-black  text-white tracking-tight">
              {net.toFixed(2)} BDT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
