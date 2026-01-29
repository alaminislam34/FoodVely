"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Ban,
  Clock,
  AlertTriangle,
  Mail,
  Trash2,
  Undo2,
  Search,
} from "lucide-react";

const mockBannedUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    reason: "Fraudulent activity",
    bannedDate: "2024-12-15",
    banDuration: "Permanent",
    orders: 45,
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    reason: "Abusive behavior",
    bannedDate: "2024-12-10",
    banDuration: "30 days",
    orders: 23,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    reason: "Payment fraud",
    bannedDate: "2024-12-05",
    banDuration: "Permanent",
    orders: 67,
  },
  {
    id: 4,
    name: "Lisa Brown",
    email: "lisa@example.com",
    reason: "Spam complaints",
    bannedDate: "2024-11-28",
    banDuration: "14 days",
    orders: 12,
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    reason: "Harassing drivers",
    bannedDate: "2024-11-20",
    banDuration: "7 days",
    orders: 34,
  },
];

export default function BannedUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bannedUsers, setBannedUsers] = useState(mockBannedUsers);

  const filteredUsers = bannedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-Sofia text-3xl font-bold text-gray-800">
          Banned Users
        </h1>
        <p className="text-gray-600 mt-2">
          Manage banned and suspended user accounts
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-3xl font-bold text-red-600">{bannedUsers.length}</p>
          <p className="text-sm text-gray-600">Total Banned</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-3xl font-bold text-orange-600">
            {bannedUsers.filter((u) => u.banDuration === "Permanent").length}
          </p>
          <p className="text-sm text-gray-600">Permanent Bans</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-3xl font-bold text-yellow-600">
            {bannedUsers.filter((u) => u.banDuration !== "Permanent").length}
          </p>
          <p className="text-sm text-gray-600">Temporary Bans</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Banned Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Reason
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Banned Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-500" />
                      <span className="text-sm text-gray-700">{user.reason}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.bannedDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        user.banDuration === "Permanent"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <Clock size={14} />
                      {user.banDuration}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.orders}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition" title="Unban user">
                        <Undo2 size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Delete account">
                        <Trash2 size={18} />
                      </button>
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
