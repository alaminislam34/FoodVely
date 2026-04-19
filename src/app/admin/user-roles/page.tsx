"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Shield, Eye, Search } from "lucide-react";
import { adminApi } from "@/api/adminApi";

type RoleItem = {
  id: string;
  name: string;
  description: string;
  permissions: number;
  users: number;
};

export default function UserRolesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState<RoleItem[]>([]);

  useEffect(() => {
    adminApi
      .listRoles({ limit: 100 })
      .then((data) => {
        const mapped: RoleItem[] = data.map((item) => ({
          id: String(item.id ?? ""),
          name: String(item.name ?? "Role"),
          description: String(item.description ?? "Role permissions"),
          permissions: Number(item.permissionsCount ?? item.permissions ?? 0),
          users: Number(item.usersCount ?? item.users ?? 0),
        }));
        setRoles(mapped);
      })
      .catch((error) => console.error("Failed to load roles", error));
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className=" text-3xl font-bold text-gray-800">
          User Roles & Permissions
        </h1>
        <p className="text-gray-600 mt-2">
          Manage system roles and access levels
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search roles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className=" font-bold text-gray-800">
                  {role.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{role.description}</p>
              </div>
              <Shield className="text-rose-500" size={24} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-200">
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {role.permissions}
                </p>
                <p className="text-xs text-gray-600">Permissions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-500">{role.users}</p>
                <p className="text-xs text-gray-600">Users</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center justify-center gap-2">
                <Eye size={16} />
                View
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                Edit
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add New Role */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full md:w-auto px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
      >
        + Create New Role
      </motion.button>
    </div>
  );
}
