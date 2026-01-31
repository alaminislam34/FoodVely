"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Wallet,
  Star,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Mock Data ---
const chartData = [
  { name: "Mon", revenue: 4000, profit: 2400 },
  { name: "Tue", revenue: 3000, profit: 1398 },
  { name: "Wed", revenue: 2000, profit: 9800 },
  { name: "Thu", revenue: 2780, profit: 3908 },
  { name: "Fri", revenue: 1890, profit: 4800 },
  { name: "Sat", revenue: 2390, profit: 3800 },
  { name: "Sun", revenue: 3490, profit: 4300 },
];

const topDishes = [
  { name: "Fresh Lemonade", sales: 124, revenue: "6,200 ৳", rating: 4.8 },
  { name: "Grilled Chicken", sales: 98, revenue: "18,500 ৳", rating: 4.6 },
  { name: "Pasta Alfredo", sales: 85, revenue: "12,750 ৳", rating: 4.9 },
];

export default function OverviewPage() {
  const [timeRange, setTimeRange] = useState("Weekly");

  const stats = [
    {
      label: "Total Revenue",
      value: "1,24,500 ৳",
      trend: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      color: "rose",
    },
    {
      label: "Total Profit",
      value: "45,200 ৳",
      trend: "+8.2%",
      isPositive: true,
      icon: Wallet,
      color: "green",
    },
    {
      label: "Active Orders",
      value: "28",
      trend: "-3.1%",
      isPositive: false,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      label: "New Customers",
      value: "142",
      trend: "+18.4%",
      isPositive: true,
      icon: Users,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8 min-h-screen pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Welcome back, Mediterraneo Kitchen.
          </p>
        </motion.div>

        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm">
          {["Daily", "Weekly", "Monthly"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeRange === range
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/60 backdrop-blur-xl border border-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group"
          >
            <div className="relative z-10 flex flex-col gap-4">
              <div
                className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}
              >
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  {stat.label}
                </p>
                <div className="flex items-end gap-2">
                  <h3 className="text-2xl font-black text-gray-800 font-Sofia">
                    {stat.value}
                  </h3>
                  <span
                    className={`text-[10px] font-black flex items-center mb-1 ${stat.isPositive ? "text-green-500" : "text-red-500"}`}
                  >
                    {stat.isPositive ? (
                      <ArrowUpRight size={12} />
                    ) : (
                      <ArrowDownRight size={12} />
                    )}
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
            {/* Background Accent */}
            <div
              className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full group-hover:scale-150 transition-transform duration-700`}
            />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 font-Sofia">
                Financial Growth
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Revenue vs Operating Profit
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500">
                <span className="w-3 h-3 rounded-full bg-rose-500" /> REVENUE
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500">
                <span className="w-3 h-3 rounded-full bg-blue-500" /> PROFIT
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 700, fill: "#94a3b8" }}
                  dy={10}
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
                  dataKey="revenue"
                  stroke="#e11d48"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorProf)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Side Performance Cards */}
        <div className="flex flex-col gap-8">
          {/* Top Selling Dishes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl flex-1"
          >
            <h3 className="text-xl font-bold text-gray-800 font-Sofia mb-6">
              Top Sellers
            </h3>
            <div className="space-y-6">
              {topDishes.map((dish, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {dish.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {dish.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">
                      {dish.revenue}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-amber-500 font-black">
                      <Star size={10} className="fill-amber-500" />{" "}
                      {dish.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-widest hover:border-rose-500 hover:text-rose-500 transition-all">
              View All Menu Performance
            </button>
          </motion.div>

          {/* Active Campaign Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-[2.5rem] p-8 shadow-xl text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-2">
                Active Coupon
              </p>
              <h4 className="text-2xl font-Sofia font-bold mb-4">SUMMER50</h4>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                <Calendar size={16} /> Ends in 3 days
              </div>
              <button className="flex items-center gap-2 text-sm font-bold text-white group">
                Manage Promotions{" "}
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
