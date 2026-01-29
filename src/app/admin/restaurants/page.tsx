"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  MoreVertical,
} from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  city: string;
  phone: string;
  rating: number;
  status: "active" | "suspended" | "pending";
  verified: boolean;
  orders: number;
  openingHours: string;
}

export default function RestaurantsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const restaurants: Restaurant[] = [
    {
      id: "1",
      name: "The Italian Kitchen",
      city: "New York",
      phone: "+1-555-0123",
      rating: 4.8,
      status: "active",
      verified: true,
      orders: 2450,
      openingHours: "10:00 AM - 11:00 PM",
    },
    {
      id: "2",
      name: "Dragon House",
      city: "Los Angeles",
      phone: "+1-555-0456",
      rating: 4.7,
      status: "active",
      verified: true,
      orders: 2120,
      openingHours: "11:00 AM - 10:30 PM",
    },
    {
      id: "3",
      name: "Green Leaf Cafe",
      city: "Chicago",
      phone: "+1-555-0789",
      rating: 4.9,
      status: "active",
      verified: true,
      orders: 1980,
      openingHours: "8:00 AM - 9:00 PM",
    },
    {
      id: "4",
      name: "Spice Paradise",
      city: "Houston",
      phone: "+1-555-0321",
      rating: 4.6,
      status: "pending",
      verified: false,
      orders: 0,
      openingHours: "12:00 PM - 11:00 PM",
    },
    {
      id: "5",
      name: "Burger House",
      city: "Phoenix",
      phone: "+1-555-0654",
      rating: 4.5,
      status: "suspended",
      verified: true,
      orders: 1850,
      openingHours: "11:00 AM - 10:00 PM",
    },
  ];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      filterStatus === "all" || restaurant.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-Sofia font-bold text-gray-800 mb-2">
          Restaurants Management
        </h1>
        <p className="text-gray-600">
          Manage restaurant listings, verify new restaurants, handle suspensions
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4"
      >
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search restaurants or cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status Filter
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Restaurants</option>
            <option value="active">Active</option>
            <option value="pending">Pending Verification</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </motion.div>

      {/* Restaurants Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredRestaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-Sofia font-bold text-gray-800 mb-1">
                  {restaurant.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {restaurant.city}
                  </div>
                  <div className="flex items-center gap-1">
                    ⭐ {restaurant.rating}
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  restaurant.status
                )}`}
              >
                {restaurant.status === "pending" ? "⏳ Pending" : ""}
                {restaurant.status === "active" ? "✓ Active" : ""}
                {restaurant.status === "suspended" ? "⚠ Suspended" : ""}
              </span>
            </div>

            {/* Contact */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone size={16} className="text-gray-400" />
                <span>{restaurant.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Clock size={16} className="text-gray-400" />
                <span>{restaurant.openingHours}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 mb-1">Orders</p>
                <p className="font-bold text-orange-600">{restaurant.orders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Status</p>
                {restaurant.verified ? (
                  <p className="flex items-center gap-1 font-semibold text-green-600">
                    <CheckCircle size={16} />
                    Verified
                  </p>
                ) : (
                  <p className="flex items-center gap-1 font-semibold text-yellow-600">
                    <AlertCircle size={16} />
                    Unverified
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-200 transition-colors flex items-center justify-center gap-2">
                <Edit2 size={16} />
                Edit
              </button>
              {restaurant.status === "pending" && (
                <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg font-semibold text-sm hover:bg-green-200 transition-colors">
                  ✓ Verify
                </button>
              )}
              {restaurant.status === "active" && (
                <button className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg font-semibold text-sm hover:bg-yellow-200 transition-colors">
                  ⏸ Suspend
                </button>
              )}
              <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-200 transition-colors flex items-center justify-center gap-2">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredRestaurants.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-2xl border border-gray-200"
        >
          <p className="text-gray-600">No restaurants found</p>
        </motion.div>
      )}
    </div>
  );
}
