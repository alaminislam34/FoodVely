"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Package,
  UtensilsCrossed,
  TrendingUp,
  ShoppingCart,
  Clock,
  ChefHat,
  Star,
  Bell,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { useProvider } from "@/module/hooks/useProvider";

// StatsCard Component
function StatsCard({ title, value, change, icon: Icon, color, href }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href={href}
        className="block p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group shadow-sm"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
            <p className="text-3xl  font-bold text-gray-800">{value}</p>
          </div>
          <div
            className={`w-12 h-12 bg-linear-to-br ${color} rounded-xl flex items-center justify-center text-white group-hover:rotate-6 transition-transform shadow-lg`}
          >
            <Icon size={24} />
          </div>
        </div>
        <p className="text-xs font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-md">
          {change}
        </p>
      </Link>
    </motion.div>
  );
}

// ActiveOrdersList Component
function ActiveOrdersList({ orders }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl  font-bold text-gray-800 flex items-center gap-2">
          <ChefHat className="text-rose-600" /> Active Orders
        </h2>
        <Link
          href="/dashboard/provider/orders"
          className="text-sm text-rose-600 hover:underline font-bold"
        >
          Manage Queue →
        </Link>
      </div>
      <div className="space-y-4">
        {orders.map((order: any) => (
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
              <p className="text-xs text-gray-500 mt-1 italic">{order.items}</p>
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
  );
}

// PopularMenuList Component
function PopularMenuList({ menu }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm"
    >
      <h2 className="text-xl  font-bold text-gray-800 mb-6">Top Menu Items</h2>
      <div className="space-y-6">
        {menu.map((item: any) => (
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
        href="/dashboard/provider/menu"
        className="block text-center mt-8 py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-rose-300 hover:text-rose-600 transition-all font-semibold text-sm"
      >
        Edit Full Menu
      </Link>
    </motion.div>
  );
}

export default function ProviderDashboard() {
  const { platformStats, PlatformStatsLoading, platformStatsError } =
    useProvider();


  // Stats config with API data
  const providerStats = [
    {
      title: "Today's Orders",
      value: platformStats?.todaysOrders ?? "-",
      change: "+12% vs yesterday", // Placeholder, replace with real data if available
      icon: ShoppingCart,
      color: "from-orange-500 to-orange-600",
      href: "/dashboard/provider/orders",
    },
    {
      title: "Today's Revenue",
      value: `৳${platformStats?.todaysRevenue ?? "-"}`,
      change: "+8% vs yesterday", // Placeholder
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      href: "/dashboard/provider/overview",
    },
    {
      title: "Total Orders",
      value: platformStats?.totalOrders ?? "-",
      change: "All time",
      icon: Package,
      color: "from-purple-500 to-purple-600",
      href: "/dashboard/provider/orders",
    },
    {
      title: "Average Rating",
      value: platformStats?.rating ?? "-",
      change: "24 reviews", // Placeholder
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
      href: "/dashboard/provider/reviews",
    },
    {
      title: "Active Products",
      value: platformStats?.activeProducts ?? "-",
      change: "Currently available",
      icon: UtensilsCrossed,
      color: "from-blue-500 to-blue-600",
      href: "/dashboard/provider/products",
    },
    {
      title: "Out of Stock",
      value: platformStats?.outOfStock ?? "-",
      change: "Needs restock",
      icon: AlertCircle,
      color: "from-red-500 to-red-600",
      href: "/dashboard/provider/products",
    },
    {
      title: "Pending Orders",
      value: platformStats?.pendingOrders ?? "-",
      change: "Waiting for action",
      icon: Clock,
      color: "from-indigo-500 to-indigo-600",
      href: "/dashboard/provider/orders",
    },
    {
      title: "Total Revenue",
      value: `৳${platformStats?.totalRevenue ?? "-"}`,
      change: "All time earnings",
      icon: Wallet,
      color: "from-emerald-500 to-emerald-600",
      href: "/dashboard/provider/overview",
    },
  ];

  // Demo data for orders and menu
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
          <h1 className="text-3xl md:text-4xl  font-bold text-gray-800 mb-2">
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
            href="/dashboard/provider/menu/add"
            className="px-4 py-2 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-all shadow-md shadow-rose-200"
          >
            + Add Item
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {providerStats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ActiveOrdersList orders={activeOrders} />
        <PopularMenuList menu={popularMenu} />
      </div>
    </div>
  );
}
