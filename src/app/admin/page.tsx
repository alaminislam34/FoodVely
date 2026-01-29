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
} from "lucide-react";

export default function AdminDashboard() {
  // Sample stats data
  const stats = [
    {
      title: "Total Users",
      value: "12,458",
      change: "+5.2%",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      href: "/admin/users",
    },
    {
      title: "Total Products",
      value: "3,241",
      change: "+12.5%",
      icon: Package,
      color: "from-green-500 to-green-600",
      href: "/admin/products",
    },
    {
      title: "Restaurants",
      value: "487",
      change: "+8.3%",
      icon: UtensilsCrossed,
      color: "from-orange-500 to-orange-600",
      href: "/admin/restaurants",
    },
    {
      title: "Total Revenue",
      value: "$125,430",
      change: "+15.8%",
      icon: TrendingUp,
      color: "from-rose-500 to-rose-600",
      href: "/admin/analytics",
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
        <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800 mb-2">
          Welcome Back, Admin
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your platform today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={stat.href}
              className="block p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-Sofia font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-linear-to-r ${stat.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
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
      <div className="">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-Sofia font-bold text-gray-800">
              Recent Activity
            </h2>
            <Link
              href="/admin/activity-log"
              className="text-sm text-rose-600 hover:text-rose-700 font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                  <activity.icon size={20} className="text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.description}
                  </p>
                </div>
                <p className="text-xs text-gray-500 shrink-0">
                  {activity.time}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

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
            <h2 className="text-xl font-Sofia font-bold text-gray-800">
              🏆 Best Sellers
            </h2>
            <Link
              href="/admin/best-sellers"
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
            <h2 className="text-xl font-Sofia font-bold text-gray-800">
              ⭐ Top Restaurants
            </h2>
            <Link
              href="/admin/best-restaurants"
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
