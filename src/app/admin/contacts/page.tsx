"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Inbox,
  CheckCircle,
  Clock,
  Trash2,
  Reply,
  Star,
  ArrowRight,
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "new" | "read" | "replied";
  priority: "normal" | "urgent";
}

export default function ContactMessages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const messages: ContactMessage[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      subject: "Issue with payment",
      message:
        "I tried to make a payment but got an error. Can you help me resolve this?",
      date: "2024-01-25",
      status: "new",
      priority: "urgent",
    },
    {
      id: "2",
      name: "Sarah Smith",
      email: "sarah@example.com",
      subject: "Partnership inquiry",
      message:
        "I have a restaurant and would like to know how to partner with FoodVely.",
      date: "2024-01-24",
      status: "read",
      priority: "normal",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      subject: "App feedback",
      message:
        "Great app! I have some feature suggestions. Can we discuss?",
      date: "2024-01-23",
      status: "replied",
      priority: "normal",
    },
    {
      id: "4",
      name: "Emma Wilson",
      email: "emma@example.com",
      subject: "Account suspended",
      message:
        "My restaurant account was suspended. I want to know the reason.",
      date: "2024-01-22",
      status: "new",
      priority: "urgent",
    },
  ];

  const filteredMessages = messages.filter((msg) => {
    const matchSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      filterStatus === "all" || msg.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Inbox size={16} className="text-blue-600" />;
      case "read":
        return <CheckCircle size={16} className="text-green-600" />;
      case "replied":
        return <ArrowRight size={16} className="text-orange-600" />;
      default:
        return null;
    }
  };

  const currentMessage = messages.find((m) => m.id === selectedMessage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-Sofia font-bold text-gray-800 mb-2">
          Contact Messages
        </h1>
        <p className="text-gray-600">
          Manage customer inquiries and support messages
        </p>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>

          {/* Messages */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden max-h-96 overflow-y-auto">
            {filteredMessages.map((msg, index) => (
              <motion.button
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedMessage(msg.id)}
                className={`w-full px-4 py-4 border-b border-gray-200 text-left hover:bg-gray-50 transition-colors ${
                  selectedMessage === msg.id ? "bg-rose-50 border-l-4 border-l-rose-500" : ""
                } ${msg.status === "new" ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(msg.status)}
                    <p className="font-semibold text-gray-800 truncate text-sm">
                      {msg.name}
                    </p>
                  </div>
                  {msg.priority === "urgent" && (
                    <span className="text-red-600 font-bold text-xs">!</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate">{msg.subject}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.date).toLocaleDateString()}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Message Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          {currentMessage ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-Sofia font-bold text-gray-800 mb-2">
                      {currentMessage.subject}
                    </h2>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>From: {currentMessage.name}</p>
                      <p>Email: {currentMessage.email}</p>
                      <p>
                        Date:{" "}
                        {new Date(currentMessage.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Status & Priority */}
                  <div className="flex flex-col gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${
                        currentMessage.status === "new"
                          ? "bg-blue-100 text-blue-700"
                          : currentMessage.status === "read"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {currentMessage.status.charAt(0).toUpperCase() +
                        currentMessage.status.slice(1)}
                    </span>
                    {currentMessage.priority === "urgent" && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-center bg-red-100 text-red-700">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {currentMessage.message}
                </p>
              </div>

              {/* Quick Reply */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quick Reply
                </label>
                <textarea
                  placeholder="Type your response here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
                  <Reply size={18} />
                  Send Reply
                </button>
                <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Mark as Read
                </button>
                <button className="px-6 py-3 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center h-full min-h-96">
              <div className="text-center">
                <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Select a message to view details
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
