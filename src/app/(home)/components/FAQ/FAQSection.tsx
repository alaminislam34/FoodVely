"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, Search, Sparkles } from "lucide-react";

const faqs = [
  {
    id: "1",
    question: "How do I track my order in real-time?",
    answer:
      "Once your order is confirmed, go to 'My Orders' and click 'Track Order'. You'll see a live map with your delivery partner's location and estimated arrival time.",
  },
  {
    id: "2",
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit/debit cards, PayPal, and digital wallets like Apple Pay and Google Pay. Cash on delivery is available in select areas.",
  },
  {
    id: "3",
    question: "Can I change my delivery address after ordering?",
    answer:
      "You can update your address within 60 seconds of placing the order. After that, please contact our support team immediately through the live chat.",
  },
  {
    id: "4",
    question: "How do I apply a promo code?",
    answer:
      "At the checkout page, look for the 'Promo Code' box under your order summary. Enter your code and click 'Apply' to see your new total.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("1");

  return (
    <section className="py-20 px-6">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-500 rounded-full text-xs font-bold uppercase tracking-widest">
          <Sparkles size={14} /> Common Questions
        </div>
        <h2 className="text-4xl md:text-5xl font-Sofia font-bold text-gray-900">
          How can we{" "}
          <span className="text-rose-500 font-Sofia italic">help you?</span>
        </h2>
        <p className="text-gray-500 font-medium max-w-lg mx-auto">
          Everything you need to know about ordering the best food in town.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <motion.div
              key={faq.id}
              initial={false}
              className={`group overflow-hidden rounded-[2.5rem] transition-all duration-500 ${
                isOpen
                  ? "bg-white shadow-2xl shadow-rose-100 border-rose-100 border"
                  : "bg-gray-50/50 shadow-md hover:bg-gray-50 border-transparent border"
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 md:p-8 text-left outline-none"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isOpen
                        ? "bg-rose-500 text-white rotate-360 shadow-lg shadow-rose-200"
                        : "bg-white text-gray-400"
                    }`}
                  >
                    <HelpCircle size={22} strokeWidth={2.5} />
                  </div>
                  <span
                    className={`font-bold text-lg md:text-xl transition-colors duration-300 ${
                      isOpen
                        ? "text-gray-900"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>

                <div
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isOpen
                      ? "bg-rose-50 text-rose-500 rotate-180"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <ChevronDown size={20} strokeWidth={3} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                  >
                    <div className="px-8 pb-10 pt-2 ml-[4.2rem] pr-12">
                      <p className="text-gray-500 leading-relaxed text-lg font-medium">
                        {faq.answer}
                      </p>
                      <button className="mt-6 text-rose-500 font-bold text-sm flex items-center gap-2 hover:underline">
                        Was this helpful?
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* 4. Footer CTA */}
      <div className="mt-20 p-10 rounded-[3rem] bg-gray-900 text-center space-y-6">
        <h3 className="text-2xl font-bold text-white">Still have questions?</h3>
        <p className="text-gray-400">
          Can't find the answer you're looking for? Please chat to our friendly
          team.
        </p>
        <button className="px-10 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-rose-500 hover:text-white transition-all">
          Get in Touch
        </button>
      </div>
    </section>
  );
}
