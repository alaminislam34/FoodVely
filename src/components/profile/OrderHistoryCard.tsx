"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

interface Props {
  id: string | number;
  date?: string;
  total?: number;
  items?: number;
  status?: string;
}

export default function OrderHistoryCard({ id, date, total = 0, items = 1, status = "Delivered" }: Props) {
  return (
    <motion.li whileHover={{ translateY: -3 }} className="bg-white border border-slate-100 rounded-lg p-4 list-none">
      <Link href={`/account/orders/${id}`} className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-800">Order #{id}</div>
          <div className="text-xs text-slate-500">{items} items • {date}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-slate-800">BDT {total.toFixed(2)}</div>
          <div className="text-xs text-rose-500 font-medium">{status}</div>
        </div>
      </Link>
    </motion.li>
  );
}
