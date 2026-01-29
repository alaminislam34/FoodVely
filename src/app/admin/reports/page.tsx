"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Swal from "sweetalert2";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Trash2,
  ShieldAlert,
  Box,
  Store,
  Flag,
  Loader2,
  XCircle,
  MoreVertical,
  ThumbsDown,
  History,
} from "lucide-react";

interface Report {
  id: string;
  reportedBy: {
    role: string;
    id: string;
    name: string;
    avatar?: string;
    logo?: string;
  };
  target: {
    type: "product" | "restaurant" | "customer";
    product?: { id: string; name: string; category: string };
    restaurant?: { id: string; name: string };
    customer?: { id: string; name: string; avatar: string };
  };
  issue: {
    type: string;
    reason: string;
    tags: string[];
  };
  evidence?: {
    images?: string[];
    note?: string;
  };
  status: {
    current: "pending" | "under_review" | "action_taken";
    action?: string;
    adminNote?: string; // Added for the SweetAlert input
    isResolved: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ReportsManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/reports.json");
        const data = await res.json();
        setReports(data);
        if (data.length > 0) setSelectedId(data[0].id);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  // --- Handlers using SweetAlert2 ---

  const handleResolve = async (id: string, isAccepting: boolean) => {
    const title = isAccepting ? "Accept Violation" : "Reject Report";
    const confirmButtonColor = isAccepting ? "#f43f5e" : "#64748b";
    const actionText = isAccepting ? "Violation Confirmed" : "Report Rejected";

    const { value: adminNote } = await Swal.fire({
      title: `<span class="font-Sofia">${title}</span>`,
      input: "textarea",
      inputLabel: "Admin Resolution Notes",
      inputPlaceholder: "Enter the details/reason for this decision...",
      showCancelButton: true,
      confirmButtonText: isAccepting
        ? "Confirm & Take Action"
        : "Reject Report",
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value) return "You must provide notes to proceed!";
      },
      customClass: {
        popup: "rounded-3xl border border-gray-200 shadow-xl",
        confirmButton: "rounded-xl px-6 py-3 font-bold",
        cancelButton: "rounded-xl px-6 py-3 font-bold",
      },
    });

    if (adminNote) {
      setIsProcessing(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: {
                  current: "action_taken",
                  isResolved: true,
                  action: actionText,
                  adminNote: adminNote,
                },
                updatedAt: new Date().toISOString(),
              }
            : r,
        ),
      );

      setIsProcessing(false);
      Swal.fire({
        title: "Success!",
        text: "The report has been processed.",
        icon: "success",
        confirmButtonColor: "#f43f5e",
      });
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This report will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        if (selectedId === id) setSelectedId(null);
        Swal.fire("Deleted!", "The report has been removed.", "success");
      }
    });
  };

  const handleInvestigate = async (id: string) => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: { ...r.status, current: "under_review" },
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setIsProcessing(false);
  };

  // --- Filtering ---
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchSearch =
        r.reportedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.issue.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        filterStatus === "all" || r.status.current === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [reports, searchQuery, filterStatus]);

  const currentReport = reports.find((r) => r.id === selectedId);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "under_review":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "action_taken":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Safety & Reports
        </h1>
        <p className="text-gray-500 font-medium">
          Manage platform integrity and investigations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-rose-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-medium outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="action_taken">Resolved</option>
            </select>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden h-150 overflow-y-auto shadow-sm p-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Loader2 className="animate-spin mb-2" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                <XCircle size={40} className="mb-2 opacity-20" />
                <p>No reports found.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredReports.map((report) => (
                  <motion.button
                    layout
                    key={report.id}
                    onClick={() => setSelectedId(report.id)}
                    className={`w-full p-4 border-b border-gray-100 text-left transition-all relative ${selectedId === report.id ? "bg-rose-50/50" : "hover:bg-gray-50"}`}
                  >
                    {selectedId === report.id && (
                      <motion.div
                        layoutId="active-bar"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"
                      />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {report.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${getStatusStyle(report.status.current)}`}
                      >
                        {report.status.current.replace("_", " ")}
                      </span>
                    </div>
                    <p className="font-bold text-gray-800 text-sm truncate">
                      {report.issue.reason}
                    </p>
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-2">
          {currentReport ? (
            <motion.div
              key={currentReport.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden"
            >
              <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 uppercase">
                      Report Details
                    </h2>
                    <p className="text-sm text-gray-500">
                      Submitted{" "}
                      {new Date(currentReport.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isProcessing && (
                    <Loader2 size={18} className="animate-spin text-rose-500" />
                  )}
                  <button className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-1">
                      <Flag size={12} /> Reported By
                    </p>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          currentReport.reportedBy.avatar ||
                          currentReport.reportedBy.logo
                        }
                        className="h-10 w-10 rounded-xl object-cover border-2 border-white shadow-sm"
                        alt=""
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {currentReport.reportedBy.name}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {currentReport.reportedBy.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30">
                    <p className="text-[10px] font-black text-rose-400 uppercase mb-3 flex items-center gap-1">
                      <ShieldAlert size={12} /> Violation Target
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white border border-rose-100 flex items-center justify-center text-rose-500">
                        {currentReport.target.type === "product" ? (
                          <Box size={20} />
                        ) : (
                          <Store size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {currentReport.target.product?.name ||
                            currentReport.target.restaurant?.name ||
                            currentReport.target.customer?.name}
                        </p>
                        <p className="text-xs text-rose-400 capitalize">
                          Type: {currentReport.target.type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-700">
                    Violation Reason
                  </h3>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 italic text-gray-700 leading-relaxed font-medium">
                    "{currentReport.issue.reason}"
                  </div>
                </div>

                {/* Admin Resolution History Card */}
                {currentReport.status.isResolved && (
                  <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2">
                    <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                      <History size={16} /> Resolution Verdict
                    </h4>
                    <p className="text-sm font-bold text-emerald-900">
                      Result: {currentReport.status.action}
                    </p>
                    <p className="text-sm text-emerald-700 bg-white/50 p-3 rounded-xl border border-emerald-100">
                      <span className="font-bold">Admin Note:</span>{" "}
                      {currentReport.status.adminNote}
                    </p>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                  {!currentReport.status.isResolved ? (
                    <>
                      <button
                        disabled={isProcessing}
                        onClick={() => handleResolve(currentReport.id, true)}
                        className="flex-1 min-w-35 flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-bold hover:shadow-lg disabled:opacity-50 transition-all"
                      >
                        <CheckCircle size={18} /> Accept Violation
                      </button>

                      <button
                        disabled={isProcessing}
                        onClick={() => handleResolve(currentReport.id, false)}
                        className="flex-1 min-w-35 flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 text-white rounded-2xl font-bold hover:bg-black disabled:opacity-50 transition-all"
                      >
                        <ThumbsDown size={18} /> Reject Report
                      </button>

                      {currentReport.status.current === "pending" && (
                        <button
                          disabled={isProcessing}
                          onClick={() => handleInvestigate(currentReport.id)}
                          className="flex-1 min-w-35 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50"
                        >
                          Mark Investigating
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center gap-2 p-4 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 font-bold italic">
                      This case is closed.
                    </div>
                  )}

                  <button
                    disabled={isProcessing}
                    onClick={() => handleDelete(currentReport.id)}
                    className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-125 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <ShieldAlert size={64} className="text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium text-lg">
                Select a report to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
