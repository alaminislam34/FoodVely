"use client";

import React from "react";
import { motion } from "motion/react";

interface Props {
  percent?: number;
}

export default function DeliveryProgress({ percent = 40 }: Props) {
  return (
    <div className="w-full">
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8 }}
          className="h-2 bg-linear-to-r from-rose-500 to-orange-400"
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>Preparing</span>
        <span>Out for delivery</span>
      </div>
    </div>
  );
}
