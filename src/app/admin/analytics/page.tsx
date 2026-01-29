"use client";

import { motion } from "motion/react";
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function AdminAnalytics() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$127,450",
      change: "+12.5%",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      status: "up",
    },
    {
      title: "Total Orders",
      value: "18,542",
      change: "+8.3%",
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      status: "up",
    },
    {
      title: "Active Users",
      value: "12,458",
      change: "+5.2%",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      status: "up",
    },
    {
      title: "Products Sold",
      value: "45,320",
      change: "+18.9%",
      icon: Package,
      color: "from-orange-500 to-orange-600",
      status: "up",
    },
  ];

  const chartData = [
    { month: "Jan", revenue: 24000, orders: 4000 },
    { month: "Feb", revenue: 26000, orders: 4100 },
    { month: "Mar", revenue: 28000, orders: 4300 },
    { month: "Apr", revenue: 31000, orders: 4500 },
    { month: "May", revenue: 35000, orders: 4800 },
    { month: "Jun", revenue: 38000, orders: 5100 },
  ];

  const bestPerformers = [
    {
      rank: 1,
      name: "The Italian Kitchen",
      type: "Restaurant",
      revenue: "$12,450",
      growth: "+24.5%",
    },
    {
      rank: 2,
      name: "Margherita Pizza",
      type: "Product",
      revenue: "$8,230",
      growth: "+18.3%",
    },
    {
      rank: 3,
      name: "Dragon House",
      type: "Restaurant",
      revenue: "$11,200",
      growth: "+15.2%",
    },
    {
      rank: 4,
      name: "Caesar Salad",
      type: "Product",
      revenue: "$7,560",
      growth: "+12.8%",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800 mb-2">
          Platform Analytics
        </h1>
        <p className="text-gray-600">
          Overview of website growth, earnings, and performance metrics
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                <p className="text-3xl font-Sofia font-bold text-gray-800">
                  {metric.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 bg-linear-to-r ${metric.color} rounded-lg flex items-center justify-center text-white`}
              >
                <metric.icon size={24} />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
              {metric.status === "up" ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )}
              {metric.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-Sofia font-bold text-gray-800 mb-1">
              Revenue & Orders Trend
            </h2>
            <p className="text-sm text-gray-600">Last 6 months</p>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Last 6 months</option>
            <option>Last Year</option>
            <option>All time</option>
          </select>
        </div>

        {/* Simple Chart Visualization */}
        <div className="h-80 flex items-end gap-4 pt-8">
          {chartData.map((data, index) => (
            <motion.div
              key={data.month}
              initial={{ height: 0 }}
              animate={{ height: `${(data.revenue / 40000) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-1 bg-linear-to-t from-rose-500 to-orange-500 rounded-t-lg relative group cursor-pointer hover:shadow-lg transition-all"
            >
              {/* Tooltip */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-semibold">${(data.revenue / 1000).toFixed(0)}k</p>
                <p className="text-gray-300">{data.orders} orders</p>
              </div>

              {/* Month label */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-600">
                {data.month}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Best Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Restaurants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
        >
          <h2 className="text-xl font-Sofia font-bold text-gray-800 mb-6">
            🏆 Top Performers
          </h2>

          <div className="space-y-4">
            {bestPerformers.map((performer, index) => (
              <motion.div
                key={performer.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Rank Badge */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    performer.rank === 1
                      ? "bg-yellow-500"
                      : performer.rank === 2
                        ? "bg-gray-400"
                        : performer.rank === 3
                          ? "bg-orange-600"
                          : "bg-gray-500"
                  }`}
                >
                  {performer.rank}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {performer.name}
                  </p>
                  <p className="text-xs text-gray-600">{performer.type}</p>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <p className="font-bold text-orange-600">{performer.revenue}</p>
                  <p className="text-xs text-green-600 font-semibold">
                    {performer.growth}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Growth Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-linear-to-br from-rose-500 to-orange-500 rounded-2xl p-6 md:p-8 text-white space-y-6"
        >
          <h2 className="text-xl font-Sofia font-bold">Website Growth</h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm">User Growth</p>
                <p className="font-bold text-lg">+24.5%</p>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{ width: "76.5%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm">Revenue Growth</p>
                <p className="font-bold text-lg">+18.8%</p>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{ width: "62.7%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm">Order Volume</p>
                <p className="font-bold text-lg">+31.2%</p>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{ width: "87.1%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm">Restaurant Partners</p>
                <p className="font-bold text-lg">+12.3%</p>
              </div>
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{ width: "41.0%" }}
                />
              </div>
            </div>
          </div>

          <button className="w-full bg-white text-orange-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mt-4">
            View Detailed Report
          </button>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Average Order Value</p>
          <p className="text-3xl font-Sofia font-bold text-gray-800">$28.50</p>
          <p className="text-xs text-green-600 font-semibold mt-2">
            ↑ 5.2% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Customer Retention</p>
          <p className="text-3xl font-Sofia font-bold text-gray-800">78.5%</p>
          <p className="text-xs text-green-600 font-semibold mt-2">
            ↑ 2.3% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Platform Rating</p>
          <p className="text-3xl font-Sofia font-bold text-gray-800">4.7 ⭐</p>
          <p className="text-xs text-gray-600 mt-2">Based on 8,542 reviews</p>
        </div>
      </motion.div>
    </div>
  );
}
