"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  restaurant: string;
  stock: number;
  orders: number;
  rating: number;
}

export default function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const products: Product[] = [
    {
      id: "1",
      name: "Margherita Pizza",
      image: "/images/products/pizza.jpg",
      price: 12.99,
      category: "Pizza",
      restaurant: "Italian Kitchen",
      stock: 45,
      orders: 1250,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Caesar Salad",
      image: "/images/products/salad.jpg",
      price: 8.99,
      category: "Salads",
      restaurant: "Green Leaf",
      stock: 32,
      orders: 945,
      rating: 4.6,
    },
    {
      id: "3",
      name: "Grilled Chicken Burger",
      image: "/images/products/burger.jpg",
      price: 10.99,
      category: "Burgers",
      restaurant: "Burger House",
      stock: 0,
      orders: 832,
      rating: 4.7,
    },
    {
      id: "4",
      name: "Pasta Carbonara",
      image: "/images/products/pasta.jpg",
      price: 13.99,
      category: "Pasta",
      restaurant: "Italian Kitchen",
      stock: 28,
      orders: 756,
      rating: 4.9,
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-Sofia font-bold text-gray-800 mb-2">
          Products Management
        </h1>
        <p className="text-gray-600">
          Manage all menu items, prices, inventory, and availability
        </p>
      </motion.div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-3xl font-bold text-rose-600">4</p>
          <p className="text-sm text-gray-600">Total Products</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-3xl font-bold text-orange-600">105</p>
          <p className="text-sm text-gray-600">Avg Stock</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-3xl font-bold text-blue-600">3,783</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-3xl font-bold text-green-600">4.75⭐</p>
          <p className="text-sm text-gray-600">Avg Rating</p>
        </div>
      </div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <div className="w-full h-full bg-linear-to-r from-gray-300 to-gray-200 animate-pulse" />

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                    <AlertCircle size={18} />
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Sale Badge */}
              <div className="absolute top-3 right-3 bg-linear-to-r from-rose-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {product.orders > 1000 ? "🔥 Trending" : "✨ New"}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Category & Restaurant */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-semibold">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <span>⭐</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {product.rating}
                  </span>
                </div>
              </div>

              {/* Name */}
              <h3 className="font-Sofia font-bold text-gray-800 mb-1 text-lg">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{product.restaurant}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600">Stock</p>
                  <p className="font-bold text-gray-800">{product.stock}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Orders</p>
                  <p className="font-bold text-orange-600 flex items-center gap-1">
                    <TrendingUp size={14} />
                    {product.orders}
                  </p>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-Sofia font-bold bg-linear-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                  ${product.price}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                    <Edit2 size={16} className="text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-2xl border border-gray-200"
        >
          <p className="text-gray-600">No products found</p>
        </motion.div>
      )}
    </div>
  );
}
