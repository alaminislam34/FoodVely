"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Clock,
  AlertCircle,
  ChevronRight,
  Search,
  Download,
} from "lucide-react";
import { useAdmin } from "@/module/hooks/userAdmin";

export default function ActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    platformActivityLogs,
    isGettingPlatformActivityLogs,
    platformActivityLogsError,
  } = useAdmin();

  // Map logs to a consistent structure
  const logs = useMemo(() => {
    if (!platformActivityLogs) return [];
    return platformActivityLogs.map((item) => ({
      id: String(item.id ?? ""),
      user: String(item.actorId ?? "System"),
      action: String(item.action ?? "Activity"),
      description: String(item.details ? JSON.stringify(item.details) : ""),
      timestamp: String(item.createdAt ?? ""),
      severity: "low", // You can map severity if available
      ip: String(item.ip ?? "-"),
    }));
  }, [platformActivityLogs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity =
        filterSeverity === "all" || log.severity === filterSeverity;
      return matchesSearch && matchesSeverity;
    });
  }, [logs, searchQuery, filterSeverity]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

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

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePage = (p: number) => setPage(p);

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
            <h1 className=" text-3xl font-bold text-gray-800">Activity Log</h1>
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
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by user or action..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
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
              onChange={(e) => {
                setFilterSeverity(e.target.value);
                setPage(1);
              }}
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
        {isGettingPlatformActivityLogs && (
          <div className="text-gray-500 text-sm">Loading...</div>
        )}
        {platformActivityLogsError && (
          <div className="text-red-500 text-sm">
            Failed to load activity logs.
          </div>
        )}
        {!isGettingPlatformActivityLogs &&
          !platformActivityLogsError &&
          paginatedLogs.map((log, index) => (
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
                      <p className="font-semibold text-gray-800">
                        {log.action}
                      </p>
                      <p className="text-sm text-gray-600">{log.user}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 ml-13">
                    {log.description}
                  </p>
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
                      log.severity,
                    )}`}
                  >
                    {log.severity.charAt(0).toUpperCase() +
                      log.severity.slice(1)}
                  </span>
                  <button className="text-gray-400 hover:text-rose-600 transition">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePage(i + 1)}
              className={`px-3 py-1 rounded border border-gray-300 ${page === i + 1 ? "bg-rose-500 text-white" : "bg-white text-gray-700"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isGettingPlatformActivityLogs &&
        !platformActivityLogsError &&
        paginatedLogs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              No activities found matching your filters
            </p>
          </div>
        )}
    </div>
  );
}
