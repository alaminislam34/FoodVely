"use client";

import React from "react";
import SectionHeader from "./SectionHeader";
import DeliveryProgress from "./DeliveryProgress";
import { motion } from "motion/react";
import Link from "next/link";

interface Props {
  id: string;
  label: string;
  eta?: string;
  percent?: number;
}

export default function ActiveOrderCard({ id, label, eta = "20 mins", percent = 50 }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-100 rounded-xl p-5">
      <SectionHeader title="Active Order" icon={<span className="text-rose-500">🥡</span>} />

      <div className="mt-3 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800">{label}</h4>
          <p className="text-sm text-slate-500">ETA • {eta}</p>
          <div className="mt-3">
            <DeliveryProgress percent={percent} />
          </div>
        </div>

        <div className="md:w-40 w-full">
          <Link href={`/account/order_track?order=${id}`} className="block text-center bg-rose-600 text-white py-2 rounded-md font-semibold hover:brightness-95 transition">Track</Link>
        </div>
      </div>
    </motion.div>
  );
}
