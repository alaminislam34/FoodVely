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
  Eye,
  Calendar,
  Store,
  UserX,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useAdmin } from "@/hooks/hooks/userAdmin";
import ActivityLogs from "./ActivityLogs";

export default function DashboardOverview() {
  const { platformStats } = useAdmin();
  const formatChange = (value?: number) => {
    if (value === undefined) return "0%";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const stats = [
    // 👤 USERS
    {
      title: "Total Users",
      value: platformStats?.totalUsers ?? 0,
      change: formatChange(platformStats?.totalUsersChange),
      isPositive: (platformStats?.totalUsersChange ?? 0) >= 0,
      icon: Users,
      color: "blue-500",
      href: "/dashboard/admin/users",
    },
    {
      title: "Active Users",
      value: platformStats?.activeUsers ?? 0,
      change: formatChange(platformStats?.activeUsersChange),
      isPositive: (platformStats?.activeUsersChange ?? 0) >= 0,
      icon: UserCheck,
      color: "emerald-500",
      href: "/dashboard/admin/users?filter=active",
    },
    {
      title: "Customers",
      value: platformStats?.totalCustomers ?? 0,
      change: formatChange(platformStats?.totalCustomersChange),
      isPositive: (platformStats?.totalCustomersChange ?? 0) >= 0,
      icon: Users,
      color: "indigo-500",
      href: "/dashboard/admin/users?role=customer",
    },
    {
      title: "Providers",
      value: platformStats?.totalProviders ?? 0,
      change: formatChange(platformStats?.totalProvidersChange),
      isPositive: (platformStats?.totalProvidersChange ?? 0) >= 0,
      icon: Store,
      color: "purple-500",
      href: "/dashboard/admin/providers",
    },

    // 🚫 USER STATUS
    {
      title: "Blocked Users",
      value: platformStats?.blockedUsers ?? 0,
      change: formatChange(platformStats?.blockedUsersChange),
      isPositive: (platformStats?.blockedUsersChange ?? 0) >= 0,
      icon: UserX,
      color: "red-500",
      href: "/dashboard/admin/users?status=blocked",
    },
    {
      title: "Deleted Users",
      value: platformStats?.totalDeletedUsers ?? 0,
      change: formatChange(platformStats?.totalDeletedUsersChange),
      isPositive: (platformStats?.totalDeletedUsersChange ?? 0) >= 0,
      icon: Trash2,
      color: "gray-500",
      href: "/dashboard/admin/users?deleted=true",
    },

    // 🍔 PLATFORM DATA
    {
      title: "Total Products",
      value: platformStats?.totalFoods ?? 0,
      change: formatChange(platformStats?.totalFoodsChange),
      isPositive: (platformStats?.totalFoodsChange ?? 0) >= 0,
      icon: Package,
      color: "green-500",
      href: "/dashboard/admin/products",
    },
    {
      title: "Restaurants",
      value: platformStats?.totalRestaurants ?? 0,
      change: formatChange(platformStats?.totalRestaurantsChange),
      isPositive: (platformStats?.totalRestaurantsChange ?? 0) >= 0,
      icon: UtensilsCrossed,
      color: "orange-500",
      href: "/dashboard/admin/restaurants",
    },

    // 📦 ORDERS
    {
      title: "Total Orders",
      value: platformStats?.totalOrders ?? 0,
      change: formatChange(platformStats?.totalOrdersChange),
      isPositive: (platformStats?.totalOrdersChange ?? 0) >= 0,
      icon: ShoppingCart,
      color: "cyan-500",
      href: "/dashboard/admin/orders",
    },

    // 💰 REVENUE
    {
      title: "Total Revenue",
      value: platformStats?.totalRevenue ?? 0,
      change: formatChange(platformStats?.totalRevenueChange),
      isPositive: (platformStats?.totalRevenueChange ?? 0) >= 0,
      icon: TrendingUp,
      color: "rose-500",
      href: "/dashboard/admin/analytics",
    },
  ];

  const recentActivities = [
    {
      type: "new_user",
      title: "New User Registered",
      description: "john_doe@example.com joined FoodVely",
      time: "2 hours ago",
      icon: Users,
    },
    {
      type: "new_order",
      title: "New Order Received",
      description: "Order #12458 worth $45.50",
      time: "1 hour ago",
      icon: ShoppingCart,
    },
    {
      type: "review",
      title: "New Review Posted",
      description: "5-star review on 'The Italian Kitchen'",
      time: "45 minutes ago",
      icon: MessageSquare,
    },
    {
      type: "restaurant",
      title: "Restaurant Verification",
      description: "Green Kitchen awaiting verification",
      time: "30 minutes ago",
      icon: Eye,
    },
  ];

  const topProducts = [
    { id: 1, name: "Margherita Pizza", orders: 1250, revenue: "$8,750" },
    { id: 2, name: "Caesar Salad", orders: 945, revenue: "$4,725" },
    { id: 3, name: "Chicken Burger", orders: 832, revenue: "$6,656" },
    { id: 4, name: "Pasta Carbonara", orders: 756, revenue: "$7,560" },
  ];

  const topRestaurants = [
    { id: 1, name: "The Italian Kitchen", rating: 4.8, orders: 2450 },
    { id: 2, name: "Dragon House", rating: 4.7, orders: 2120 },
    { id: 3, name: "Green Leaf Cafe", rating: 4.9, orders: 1980 },
    { id: 4, name: "Spice Paradise", rating: 4.6, orders: 1850 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Welcome Back, Admin
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your platform today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-2">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={stat.href}
              className="block p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group relative"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl  font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 opacity-20 flex items-center justify-center text-${stat.color} group-hover:scale-110 transition-transform absolute top-4 right-4`}
                >
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-sm font-semibold text-green-600">
                {stat.change}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Two Column Grid */}
      <ActivityLogs />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl  font-bold text-gray-800">
              🏆 Best Sellers
            </h2>
            <Link
              href="/dashboard/admin/best-sellers"
              className="text-sm text-rose-600 hover:text-rose-700 font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {product.orders} orders
                  </p>
                </div>
                <p className="font-bold text-orange-600">{product.revenue}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Restaurants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl  font-bold text-gray-800">
              ⭐ Top Restaurants
            </h2>
            <Link
              href="/dashboard/admin/best-restaurants"
              className="text-sm text-rose-600 hover:text-rose-700 font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {topRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    {restaurant.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {restaurant.orders} orders
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <p className="font-bold text-gray-800">{restaurant.rating}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
