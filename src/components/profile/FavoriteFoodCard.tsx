"use client";

import { motion } from "motion/react";

interface Props {
  id: string | number;
  image?: string;
  name: string;
  price?: number;
  rating?: number;
  onToggle?: (id: string | number) => void;
}

export default function FavoriteFoodCard({ id, image, name, price, rating, onToggle }: Props) {
  return (
    <motion.article whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-lg p-3">
      <div className="aspect-4/3 rounded-md overflow-hidden bg-slate-100 mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image || '/images/placeholder.png'} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">{name}</h4>
          {price != null && <div className="text-xs text-slate-500">BDT {price}</div>}
        </div>
        <div className="text-xs text-amber-500 font-semibold">{rating?.toFixed?.(1) ?? '—'}</div>
      </div>
    </motion.article>
  );
}
