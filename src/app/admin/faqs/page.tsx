"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  HelpCircle,
  ChevronDown,
  Search,
  Edit3,
  Trash2,
  MessageCircle,
  Settings,
  ShoppingBag,
  Info,
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Orders" | "Delivery" | "Restaurant";
}

const mockFaqs: FAQ[] = [
  {
    id: "1",
    category: "General",
    question: "How do I create a FoodVally account?",
    answer:
      "You can sign up by clicking the profile icon in the top right corner and providing your email address.",
  },
  {
    id: "2",
    category: "Orders",
    question: "Can I cancel my order after payment?",
    answer:
      "Orders can be cancelled within 2 minutes of placement. After that, the restaurant begins preparation.",
  },
  {
    id: "3",
    category: "Restaurant",
    question: "How do I register my restaurant?",
    answer:
      "Visit the 'Partner with us' page in the footer to submit your business details for verification.",
  },
];

export default function FAQManage() {
  const [activeTab, setActiveTab] = useState("General");
  const [openId, setOpenId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "General", icon: <Info size={18} /> },
    { name: "Orders", icon: <ShoppingBag size={18} /> },
    { name: "Restaurant", icon: <MessageCircle size={18} /> },
  ];

  const filteredFaqs = mockFaqs.filter(
    (faq) =>
      faq.category === activeTab &&
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-Sofia font-bold text-gray-800">
            Support Center
          </h1>
          <p className="text-gray-500 font-medium">
            Manage frequently asked questions for your users.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-rose-100 transition-all">
          <Plus size={20} /> Add New FAQ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Category Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(cat.name)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
                activeTab === cat.name
                  ? "bg-white text-rose-500 shadow-sm border border-rose-100"
                  : "text-gray-400 hover:bg-white/50"
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right: Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/60 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/5 font-medium transition-all"
            />
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredFaqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group bg-white border rounded-3xl transition-all ${
                    openId === faq.id
                      ? "border-rose-200 shadow-lg"
                      : "border-gray-100 hover:border-rose-100"
                  }`}
                >
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-xl transition-colors ${openId === faq.id ? "bg-rose-500 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-400"}`}
                      >
                        <HelpCircle size={20} />
                      </div>
                      <span className="font-bold text-gray-700">
                        {faq.question}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openId === faq.id ? 180 : 0 }}
                      className="text-gray-300"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 ml-14">
                          <p className="text-gray-500 leading-relaxed font-medium">
                            {faq.answer}
                          </p>

                          {/* Admin Controls */}
                          <div className="flex gap-4 mt-6 pt-6 border-t border-gray-50">
                            <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors">
                              <Edit3 size={14} /> Edit
                            </button>
                            <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
