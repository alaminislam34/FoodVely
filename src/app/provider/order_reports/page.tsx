"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  Monitor,
  Smartphone,
  Store,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// --- Mock Data ---
const orderVolumeData = [
  { time: "08:00", orders: 12 },
  { time: "10:00", orders: 18 },
  { time: "12:00", orders: 45 },
  { time: "14:00", orders: 30 },
  { time: "16:00", orders: 25 },
  { time: "18:00", orders: 55 },
  { time: "20:00", orders: 48 },
  { time: "22:00", orders: 20 },
];

export default function OrderReports() {
  const [filter, setFilter] = useState("Weekly");

  const orderStats = [
    {
      label: "Total Orders",
      value: "1,284",
      trend: "+14%",
      icon: ShoppingBag,
      color: "rose",
    },
    {
      label: "Avg. Prep Time",
      value: "18 min",
      trend: "-2 min",
      icon: Clock,
      color: "blue",
    },
    {
      label: "Completion Rate",
      value: "98.2%",
      trend: "+0.5%",
      icon: CheckCircle2,
      color: "green",
    },
    {
      label: "Cancellations",
      value: "12",
      trend: "-4%",
      icon: XCircle,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8 min-h-screen pb-10">
      {/* Header */}
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
        </motion.div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:border-rose-500 transition-all shadow-sm">
            <Calendar size={18} />
            <span>Custom Date</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all shadow-lg">
            <Download size={18} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* High-Level Order Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {orderStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/60 backdrop-blur-xl border border-white p-6 rounded-[2.5rem] shadow-xl group hover:shadow-2xl transition-all"
          >
            <div
              className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}
            >
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              {stat.label}
            </p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-2xl font-black text-gray-800 font-Sofia">
                {stat.value}
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.label === "Cancellations" ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}
              >
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Peak Hours Analysis */}
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
            <div className="bg-gray-100 p-1 rounded-xl flex">
              <button className="px-3 py-1.5 text-[10px] font-black uppercase rounded-lg bg-white shadow-sm">
                Today
              </button>
              <button className="px-3 py-1.5 text-[10px] font-black uppercase rounded-lg text-gray-400">
                Yesterday
              </button>
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

        {/* Order Source Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900 rounded-[2.5rem] p-8 shadow-xl text-white"
        >
          <h3 className="text-xl font-bold font-Sofia mb-6">Order Sources</h3>
          <div className="space-y-8">
            {[
              {
                label: "Mobile App",
                value: 65,
                icon: Smartphone,
                color: "text-rose-500",
              },
              {
                label: "Website",
                value: 25,
                icon: Monitor,
                color: "text-blue-500",
              },
              {
                label: "In-Store / QR",
                value: 10,
                icon: Store,
                color: "text-green-500",
              },
            ].map((source, i) => (
              <div key={i} className="space-y-3">
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
              "App orders are up by 12% during lunch hours."
            </p>
          </div>
        </motion.div>
      </div>

      {/* Detailed Order Log Table */}
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
            <select className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 outline-none">
              <option>All Statuses</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

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
              {[
                {
                  id: "#ORD-7721",
                  time: "14 min",
                  items: 3,
                  val: "1,250",
                  status: "Fast",
                },
                {
                  id: "#ORD-7722",
                  time: "28 min",
                  items: 1,
                  val: "450",
                  status: "Delayed",
                },
                {
                  id: "#ORD-7723",
                  time: "12 min",
                  items: 5,
                  val: "3,100",
                  status: "Fast",
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/80 transition-all">
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-800">{row.id}</p>
                    <p className="text-[10px] text-gray-400 font-bold">
                      12:45 PM
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <Clock size={14} className="text-gray-300" />
                      {row.time}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-500">
                    {row.items} items
                  </td>
                  <td className="px-8 py-5 font-black text-gray-800">
                    {row.val} ৳
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${
                        row.status === "Fast"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-rose-50 text-rose-600 border-rose-100"
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
      </div>
    </div>
  );
}
