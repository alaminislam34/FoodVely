"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Download,
  Filter,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronDown,
  ArrowUpRight,
  Printer,
  CalendarDays,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// --- Mock Data ---
const monthlySales = [
  { month: "Jan", total: 45000 },
  { month: "Feb", total: 52000 },
  { month: "Mar", total: 48000 },
  { month: "Apr", total: 61000 },
  { month: "May", total: 55000 },
  { month: "Jun", total: 67000 },
];

const paymentMethods = [
  { name: "Digital Pay", value: 45, color: "#e11d48" }, // Rose 600
  { name: "Cash", value: 35, color: "#10b981" }, // Green 500
  { name: "Card", value: 20, color: "#3b82f6" }, // Blue 500
];

export default function SalesReport() {
  const [reportRange, setReportRange] = useState("Last 30 Days");

  return (
    <div className="space-y-8 min-h-screen pb-10">
      {/* Header with Export Options */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800">
            Sales Report
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Detailed analysis of your restaurant's revenue.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:border-rose-500 transition-all shadow-sm">
            <Printer size={18} />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all shadow-lg">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Primary Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-800 font-Sofia">
              Revenue Growth
            </h3>
            <div className="flex items-center gap-2 text-xs font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
              <TrendingUp size={14} /> +18% from last period
            </div>
          </div>

          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 700, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 700, fill: "#94a3b8" }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="total" radius={[10, 10, 0, 0]}>
                  {monthlySales.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === monthlySales.length - 1
                          ? "#e11d48"
                          : "#f43f5e30"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Payment Methods Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-800 font-Sofia mb-2">
            Payment Mix
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">
            Distribution by channel
          </p>

          <div className="h-50 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-gray-800">100%</span>
              <span className="text-[10px] text-gray-400 font-bold">TOTAL</span>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {paymentMethods.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-bold text-gray-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-black text-gray-800">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Transaction Log (Using your Table Design Pattern) */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 font-Sofia">
              Recent Transactions
            </h3>
            <p className="text-sm text-gray-400 font-medium">
              Detailed breakdown of the last 50 orders.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <CalendarDays size={18} className="text-gray-400 ml-2" />
            <select className="bg-transparent text-sm font-bold text-gray-600 outline-none pr-4 py-1">
              <option>Today</option>
              <option>This Week</option>
              <option selected>This Month</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 uppercase tracking-[0.2em] text-[10px] font-black text-gray-400 border-b border-gray-100">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Method</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Tax (5%)</th>
                <th className="px-8 py-5">Net Profit</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  id: "#TRX-9901",
                  method: "Digital Pay",
                  type: Smartphone,
                  amount: 1250,
                  tax: 62.5,
                  profit: 840,
                  status: "Settled",
                },
                {
                  id: "#TRX-9902",
                  method: "Cash",
                  type: Banknote,
                  amount: 850,
                  tax: 42.5,
                  profit: 510,
                  status: "Settled",
                },
                {
                  id: "#TRX-9903",
                  method: "Card Pay",
                  type: CreditCard,
                  amount: 2400,
                  tax: 120,
                  profit: 1680,
                  status: "Pending",
                },
              ].map((trx, i) => (
                <tr key={i} className="hover:bg-white/80 transition-all group">
                  <td className="px-8 py-5 font-bold text-gray-800">
                    {trx.id}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                      <trx.type size={16} className="text-gray-400" />
                      {trx.method}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-gray-800">
                    {trx.amount} ৳
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-400">
                    {trx.tax} ৳
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-green-600">
                      +{trx.profit} ৳
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span
                      className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase border ${
                        trx.status === "Settled"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-orange-50 text-orange-600 border-orange-100"
                      }`}
                    >
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-8 bg-gray-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Total Gross
              </p>
              <p className="text-xl font-bold font-Sofia">4,500 ৳</p>
            </div>
            <div className="w-px h-10 bg-white/10 hidden md:block" />
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Estimated Tax
              </p>
              <p className="text-xl font-bold font-Sofia">225 ৳</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">
              Total Net Income
            </p>
            <p className="text-3xl font-black font-Sofia text-white tracking-tight">
              3,030 ৳
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
