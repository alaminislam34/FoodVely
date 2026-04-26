"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ChevronRight,
  Clock,
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

const DATA_SETS: Record<string, any[]> = {
  Daily: [
    { name: "12am", revenue: 400, profit: 200 },
    { name: "4am", revenue: 100, profit: 50 },
    { name: "8am", revenue: 900, profit: 400 },
    { name: "12pm", revenue: 2500, profit: 1200 },
    { name: "4pm", revenue: 1800, profit: 900 },
    { name: "8pm", revenue: 3200, profit: 1600 },
  ],
  Weekly: [
    { name: "Mon", revenue: 4000, profit: 2400 },
    { name: "Tue", revenue: 3000, profit: 1398 },
    { name: "Wed", revenue: 9000, profit: 4800 },
    { name: "Thu", revenue: 2780, profit: 1908 },
    { name: "Fri", revenue: 4890, profit: 2800 },
    { name: "Sat", revenue: 7390, profit: 3800 },
    { name: "Sun", revenue: 8490, profit: 4300 },
  ],
  Monthly: [
    { name: "Week 1", revenue: 25000, profit: 12000 },
    { name: "Week 2", revenue: 32000, profit: 15000 },
    { name: "Week 3", revenue: 28000, profit: 11000 },
    { name: "Week 4", revenue: 45000, profit: 22000 },
  ],
};

export default function OverviewPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("Weekly");

  const stats = useMemo(
    () => [
      {
        label: "Total Revenue",
        value:
          timeRange === "Daily"
            ? "3,200 ৳"
            : timeRange === "Weekly"
              ? "1,24,500 ৳"
              : "4,50,000 ৳",
        trend: "+12.5%",
        isPositive: true,
        icon: DollarSign,
        color: "rose",
      },
      {
        label: "Total Profit",
        value:
          timeRange === "Daily"
            ? "1,600 ৳"
            : timeRange === "Weekly"
              ? "45,200 ৳"
              : "1,80,000 ৳",
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
    ],
    [timeRange],
  );

  const recentOrders = [
    { id: "#8812", user: "Rahim A.", status: "Preparing", time: "2 min ago" },
    { id: "#8811", user: "Karim J.", status: "Ready", time: "5 min ago" },
    {
      id: "#8810",
      user: "Sultana B.",
      status: "Delivered",
      time: "12 min ago",
    },
  ];

  return (
    <div className="space-y-8 min-h-screen pb-10">
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

        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm w-fit">
          {["Daily", "Weekly", "Monthly"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeRange === range
                  ? "bg-gray-900 text-white shadow-md scale-105"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

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
                  <h3 className="text-2xl font-black text-gray-800 font-Sofia leading-none">
                    {stat.value}
                  </h3>
                  <span
                    className={`text-[10px] font-black flex items-center mb-0.5 ${stat.isPositive ? "text-green-500" : "text-red-500"}`}
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
            <div
              className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full group-hover:scale-150 transition-transform duration-700`}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 font-Sofia">
                Revenue Trends
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Performance based on {timeRange} view
              </p>
            </div>
          </div>
          <div className="h-87.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_SETS[timeRange]}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
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
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#94a3b8" }}
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
                  strokeWidth={3}
                  fill="none"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-[2.5rem] p-8 shadow-xl text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-2">
                Active Campaign
              </p>
              <h4 className="text-2xl font-Sofia font-bold mb-4 tracking-tight">
                EATFREE100
              </h4>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Your "Welcome Back" coupon is performing 20% better than last
                month.
              </p>
              <button
                onClick={() => router.push("/provider/coupons")}
                className="flex items-center gap-2 text-sm font-bold text-white group bg-white/10 px-5 py-3 rounded-2xl hover:bg-rose-600 transition-all"
              >
                Manage Coupons{" "}
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
          </motion.div>

          <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 font-Sofia mb-4 px-2">
              Recent Activity
            </h3>
            <div className="space-y-1">
              {recentOrders.map((order, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 hover:bg-white/80 rounded-2xl transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-rose-500 border border-rose-50">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        {order.user}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {order.id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                        order.status === "Delivered"
                          ? "bg-green-50 text-green-500"
                          : "bg-rose-50 text-rose-500"
                      }`}
                    >
                      {order.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-end gap-1">
                      <Clock size={10} /> {order.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
