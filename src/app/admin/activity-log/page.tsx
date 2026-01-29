"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  User,
  Clock,
  AlertCircle,
  ChevronRight,
  Search,
  Download,
} from "lucide-react";

const mockActivityLog = [
  {
    id: 1,
    user: "John Doe",
    action: "User Banned",
    description: "Account suspended for fraudulent activity",
    timestamp: "2 hours ago",
    severity: "high",
    ip: "192.168.1.1",
  },
  {
    id: 2,
    user: "Admin Panel",
    action: "Coupon Created",
    description: "New coupon code SAVE20 created",
    timestamp: "4 hours ago",
    severity: "medium",
    ip: "192.168.1.2",
  },
  {
    id: 3,
    user: "Sarah Smith",
    action: "Profile Updated",
    description: "Restaurant profile information changed",
    timestamp: "6 hours ago",
    severity: "low",
    ip: "192.168.1.3",
  },
  {
    id: 4,
    user: "Admin Panel",
    action: "Banner Updated",
    description: "Homepage banner image changed",
    timestamp: "8 hours ago",
    severity: "low",
    ip: "192.168.1.4",
  },
  {
    id: 5,
    user: "Mike Johnson",
    action: "Order Completed",
    description: "Order #12345 marked as delivered",
    timestamp: "10 hours ago",
    severity: "low",
    ip: "192.168.1.5",
  },
  {
    id: 6,
    user: "Admin Panel",
    action: "Review Reported",
    description: "Inappropriate review removed",
    timestamp: "12 hours ago",
    severity: "medium",
    ip: "192.168.1.6",
  },
  {
    id: 7,
    user: "Lisa Brown",
    action: "Contact Form Submitted",
    description: "Support ticket #789 created",
    timestamp: "1 day ago",
    severity: "low",
    ip: "192.168.1.7",
  },
  {
    id: 8,
    user: "Admin Panel",
    action: "Restaurant Verified",
    description: "New restaurant approved for platform",
    timestamp: "1 day ago",
    severity: "medium",
    ip: "192.168.1.8",
  },
];

export default function ActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [logs, setLogs] = useState(mockActivityLog);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 border border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border border-green-300";
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-Sofia text-3xl font-bold text-gray-800">
              Activity Log
            </h1>
            <p className="text-gray-600 mt-2">Track all platform activities</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
            <Download size={18} />
            Export
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Activities
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by user or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Severity
            </label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-3">
        {filteredLogs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-linear-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{log.action}</p>
                    <p className="text-sm text-gray-600">{log.user}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 ml-13">{log.description}</p>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 ml-13">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={14} />
                    {log.timestamp}
                  </span>
                  <span className="text-xs text-gray-500">IP: {log.ip}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                    log.severity
                  )}`}
                >
                  {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                </span>
                <button className="text-gray-400 hover:text-rose-600 transition">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No activities found matching your filters</p>
        </div>
      )}
    </div>
  );
}
