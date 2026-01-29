"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Search,
  Copy,
  Edit2,
  Trash2,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  maxUses: number;
  usedCount: number;
  minOrder: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

export default function CouponsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const coupons: Coupon[] = [
    {
      id: "1",
      code: "SAVE20",
      type: "percentage",
      value: 20,
      maxUses: 500,
      usedCount: 342,
      minOrder: 25,
      validFrom: "2024-01-01",
      validUntil: "2024-02-29",
      active: true,
    },
    {
      id: "2",
      code: "FLAT10",
      type: "fixed",
      value: 10,
      maxUses: 300,
      usedCount: 156,
      minOrder: 50,
      validFrom: "2024-01-15",
      validUntil: "2024-03-15",
      active: true,
    },
    {
      id: "3",
      code: "WELCOME",
      type: "percentage",
      value: 30,
      maxUses: 1000,
      usedCount: 987,
      minOrder: 15,
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      active: true,
    },
    {
      id: "4",
      code: "OLDCODE",
      type: "percentage",
      value: 15,
      maxUses: 500,
      usedCount: 500,
      minOrder: 30,
      validFrom: "2023-01-01",
      validUntil: "2024-01-01",
      active: false,
    },
  ];

  const filteredCoupons = coupons.filter((coupon) => {
    const matchSearch = coupon.code
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && coupon.active) ||
      (filterStatus === "inactive" && !coupon.active);
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-Sofia font-bold text-gray-800 mb-2">
            Coupons & Promotions
          </h1>
          <p className="text-gray-600">
            Create and manage discount coupons and promotional codes
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          <Plus size={20} />
          Create Coupon
        </button>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search coupon code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Coupons</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </motion.div>

      {/* Coupons Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-Sofia font-bold text-gray-700">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-Sofia font-bold text-gray-700">
                  Discount
                </th>
                <th className="px-6 py-4 text-left text-sm font-Sofia font-bold text-gray-700">
                  Usage
                </th>
                <th className="px-6 py-4 text-left text-sm font-Sofia font-bold text-gray-700">
                  Min Order
                </th>
                <th className="px-6 py-4 text-left text-sm font-Sofia font-bold text-gray-700">
                  Valid Until
                </th>
                <th className="px-6 py-4 text-left text-sm font-Sofia font-bold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-Sofia font-bold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon, index) => (
                <motion.tr
                  key={coupon.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <code className="px-3 py-2 bg-gray-100 rounded font-mono font-bold text-gray-800">
                        {coupon.code}
                      </code>
                      <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                        <Copy size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-linear-to-r from-rose-100 to-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : `$${coupon.value}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {coupon.usedCount} / {coupon.maxUses}
                      </p>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-rose-500 to-orange-500"
                          style={{
                            width: `${(coupon.usedCount / coupon.maxUses) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ${coupon.minOrder}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(coupon.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        coupon.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {coupon.active ? "✓ Active" : "✕ Expired"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                        <Edit2 size={16} className="text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCoupons.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-600">No coupons found</p>
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Coupons</p>
              <p className="text-3xl font-bold font-Sofia text-gray-800">
                {coupons.filter((c) => c.active).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Redeemed</p>
              <p className="text-3xl font-bold font-Sofia text-gray-800">
                {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimated Saved</p>
              <p className="text-3xl font-bold font-Sofia text-gray-800">
                $1,245
              </p>
            </div>
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <Calendar size={24} className="text-rose-600" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
