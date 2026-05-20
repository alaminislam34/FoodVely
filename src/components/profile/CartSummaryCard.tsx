"use client";

import React from "react";

interface Item {
  id: string | number;
  name: string;
  qty: number;
  price: number;
}

interface Props {
  items?: Item[];
}

export default function CartSummaryCard({ items = [] }: Props) {
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <div className="bg-white border border-slate-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold">My Bag</h4>
        <div className="text-xs text-slate-500">{items.length} items</div>
      </div>

      <div className="space-y-2">
        {items.slice(0, 3).map((it) => (
          <div key={it.id} className="flex items-center justify-between text-sm">
            <div className="text-slate-700">{it.name} <span className="text-xs text-slate-400">x{it.qty}</span></div>
            <div className="font-semibold">BDT {(it.qty * it.price).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between font-semibold">
        <span>Total</span>
        <span>BDT {total.toFixed(2)}</span>
      </div>
    </div>
  );
}
