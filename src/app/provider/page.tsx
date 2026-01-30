"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Users,
  Package,
  UtensilsCrossed,
  TrendingUp,
  ShoppingCart,
  MessageSquare,
  Clock,
  ChefHat,
  Star,
  Bell,
} from "lucide-react";

export default function ProviderDashboard() {
  // Stats tailored for a Restaurant Owner
  const stats = [
    {
      title: "Today's Orders",
      value: "42",
      change: "+12% vs yesterday",
      icon: ShoppingCart,
      color: "from-orange-500 to-orange-600",
      href: "/provider/orders",
    },
    {
      title: "Daily Revenue",
      value: "$1,284",
      change: "+5.2% vs last week",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      href: "/provider/finance",
    },
    {
      title: "Avg. Prep Time",
      value: "18 min",
      change: "-2 min faster",
      icon: Clock,
      color: "from-blue-500 to-blue-600",
      href: "/provider/performance",
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      change: "24 new reviews",
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
      href: "/provider/reviews",
    },
  ];

  const activeOrders = [
    {
      id: "#ORD-7742",
      customer: "Sarah Jenkins",
      items: "2x Classic Burger, 1x Large Fries",
      status: "Preparing",
      time: "12 min ago",
      icon: ChefHat,
    },
    {
      id: "#ORD-7741",
      customer: "Mike Ross",
      items: "1x Margherita Pizza",
      status: "Ready for Pickup",
      time: "5 min ago",
      icon: Package,
    },
    {
      id: "#ORD-7740",
      customer: "Harvey Specter",
      items: "3x Tacos, 1x Cola",
      status: "In Delivery",
      time: "25 min ago",
      icon: ShoppingCart,
    },
  ];

  const popularMenu = [
    { id: 1, name: "Signature BBQ Wings", count: 88, status: "In Stock" },
    { id: 2, name: "Truffle Pasta", count: 64, status: "In Stock" },
    { id: 3, name: "Avocado Toast", count: 52, status: "Low Stock" },
    { id: 4, name: "Garlic Bread", count: 45, status: "In Stock" },
  ];

  return (
    <div className="space-y-8 p-4 md:p-0">
      {/* Header with Shop Status Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800 mb-2">
            The Great Kitchen
          </h1>
          <p className="text-gray-600">
            You are currently{" "}
            <span className="text-green-600 font-bold underline">Open</span> for
            orders
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2">
            <Bell size={18} /> Notifications
          </button>
          <Link
            href="/provider/menu/add"
            className="px-4 py-2 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-all shadow-md shadow-rose-200"
          >
            + Add Item
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={stat.href}
              className="block p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-Sofia font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center text-white group-hover:rotate-6 transition-transform shadow-lg`}
                >
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-xs font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-md">
                {stat.change}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Kitchen Queue */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-Sofia font-bold text-gray-800 flex items-center gap-2">
              <ChefHat className="text-rose-600" /> Active Orders
            </h2>
            <Link
              href="/provider/orders"
              className="text-sm text-rose-600 hover:underline font-bold"
            >
              Manage Queue →
            </Link>
          </div>

          <div className="space-y-4">
            {activeOrders.map((order, index) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{order.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {order.customer}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    {order.items}
                  </p>
                </div>
                <div className="flex items-center justify-between md:text-right">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={14} /> {order.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Inventory / Popular Items */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm"
        >
          <h2 className="text-xl font-Sofia font-bold text-gray-800 mb-6">
            Top Menu Items
          </h2>
          <div className="space-y-6">
            {popularMenu.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.count} sold this week
                  </p>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                    item.status === "Low Stock"
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/provider/menu"
            className="block text-center mt-8 py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-rose-300 hover:text-rose-600 transition-all font-semibold text-sm"
          >
            Edit Full Menu
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
