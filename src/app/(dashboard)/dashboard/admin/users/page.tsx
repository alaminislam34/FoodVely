"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  MoreVertical,
  Ban,
  Shield,
  Trash2,
  Eye,
} from "lucide-react";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/AdminStates";
import { getApiErrorMessage } from "@/utils/apiError";
import { AdminPaginator } from "@/components/admin/AdminPaginator";
import { useAdminListControls } from "@/hooks/useAdminListControls";
import { useAdminUsersList } from "@/hooks/hooks/userAdmin";

export default function UsersManagement() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const limit = 20;

  const { searchInput, setSearchInput, debouncedSearch, page, setPage } =
    useAdminListControls({ debounceMs: 450 });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus, filterRole, setPage]);

  const { data, isLoading, error, refetch } = useAdminUsersList({
    page,
    limit,
    search: debouncedSearch,
    role: filterRole,
    status: filterStatus,
  });

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;
  const errorMessage = error
    ? getApiErrorMessage(error, "Failed to load users")
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "suspended":
        return "bg-yellow-100 text-yellow-700";
      case "banned":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return "👑";
      case "restaurant":
        return "🏪";
      case "customer":
        return "👤";
      default:
        return "❓";
    }
  };

  console.log(users, "total users");

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl  font-bold text-gray-800 mb-2">
          Users Management
        </h1>
        <p className="text-gray-600">
          Manage all users, control access, ban or suspend accounts
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
              <Filter size={18} />
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      {isLoading ? (
        <AdminLoadingState label="Loading users..." />
      ) : errorMessage ? (
        <AdminErrorState
          description={errorMessage}
          onAction={() => refetch()}
        />
      ) : users.length === 0 ? (
        <AdminEmptyState description="No users found matching your filters." />
      ) : (
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
                  <th className="px-6 py-4 text-left text-sm  font-bold text-gray-700">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm  font-bold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm  font-bold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm  font-bold text-gray-700">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-sm  font-bold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.emailVerified && (
                          <span className="text-xs text-green-600 font-semibold">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg">{getRoleIcon(user.role)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          user.status,
                        )}`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Shield size={18} className="text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                          <Ban size={18} className="text-red-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-sm text-gray-600 flex items-center justify-between gap-3"
      >
        <span>
          Showing {users.length} users on page {page} of {totalPages}
        </span>
        <AdminPaginator
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </motion.div>
    </div>
  );
}
