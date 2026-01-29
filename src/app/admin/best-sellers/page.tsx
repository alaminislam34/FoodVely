"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Award,
  Star,
  DollarSign,
  ShoppingCart,
  Search,
} from "lucide-react";

const mockBestSellers = [
  {
    id: 1,
    name: "Spicy Chicken Burger",
    restaurant: "Burger King",
    rating: 4.8,
    reviews: 2450,
    orders: 15680,
    revenue: "$78,400",
    image: "🍔",
    trend: "+23%",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    restaurant: "Pizzeria Italia",
    rating: 4.9,
    reviews: 3120,
    orders: 18950,
    revenue: "$94,750",
    image: "🍕",
    trend: "+31%",
  },
  {
    id: 3,
    name: "Salmon Sushi Roll",
    restaurant: "Sushi Palace",
    rating: 4.7,
    reviews: 1890,
    orders: 9320,
    revenue: "$46,600",
    image: "🍣",
    trend: "+18%",
  },
  {
    id: 4,
    name: "Chocolate Cake",
    restaurant: "Sweet Dreams",
    rating: 4.9,
    reviews: 2670,
    orders: 14200,
    revenue: "$35,500",
    image: "🍰",
    trend: "+42%",
  },
  {
    id: 5,
    name: "Caesar Salad",
    restaurant: "Salad Bar",
    rating: 4.6,
    reviews: 1450,
    orders: 7890,
    revenue: "$23,670",
    image: "🥗",
    trend: "+12%",
  },
  {
    id: 6,
    name: "Iced Coffee",
    restaurant: "Coffee House",
    rating: 4.8,
    reviews: 3450,
    orders: 21340,
    revenue: "$32,010",
    image: "🥤",
    trend: "+35%",
  },
];

export default function BestSellersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("orders");

  const filteredProducts = mockBestSellers
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "orders") return b.orders - a.orders;
      if (sortBy === "revenue")
        return parseInt(b.revenue.replace(/\D/g, "")) -
          parseInt(a.revenue.replace(/\D/g, ""));
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-Sofia text-3xl font-bold text-gray-800">
          Best Selling Products
        </h1>
        <p className="text-gray-600 mt-2">Top performing products on the platform</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-rose-600">
                {mockBestSellers.length}
              </p>
              <p className="text-sm text-gray-600">Top Products</p>
            </div>
            <Award size={32} className="text-rose-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-orange-600">
                {mockBestSellers.reduce((sum, p) => sum + p.orders, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <ShoppingCart size={32} className="text-orange-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-600">
                ${(mockBestSellers.reduce((sum, p) => sum + parseInt(p.revenue.replace(/\D/g, "")), 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <DollarSign size={32} className="text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {(mockBestSellers.reduce((sum, p) => sum + p.rating, 0) / mockBestSellers.length).toFixed(1)}⭐
              </p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
            <Star size={32} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="orders">Sort by Orders</option>
            <option value="revenue">Sort by Revenue</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Restaurant
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Revenue
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{product.image}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.reviews} reviews</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.restaurant}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {product.rating}
                      </span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {product.orders.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-rose-600">
                    {product.revenue}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                      <TrendingUp size={16} />
                      {product.trend}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
